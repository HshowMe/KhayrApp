import {create} from 'zustand';
import firestore from '@react-native-firebase/firestore';
import { sendStatusUpdateNotification } from '../services/notificationService';
import { onDeliveryConfirmed } from '../services/impactService';
import { Donation } from '../models/types';

interface TaskState {
  tasks: any[];
  isLoading: boolean;
  listenToTasks: () => () => void;
  acceptTask: (donationId: string, volunteerId: string) => Promise<void>;
  confirmDelivery: (donationId: string) => Promise<void>;
  submitVolunteerRating: (donationId: string, volunteerId: string, stars: number, note: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,

  listenToTasks: () => {
    set({ isLoading: true });
    const subscriber = firestore()
      .collection('donations')
      .where('status', 'in', ['Accepted', 'In Transit', 'Delivered'])
      .onSnapshot(querySnapshot => {
        const t: any[] = [];
        querySnapshot.forEach(doc => {
          t.push({ ...doc.data(), id: doc.id });
        });
        set({ tasks: t, isLoading: false });
      }, error => {
        console.error("Tasks fetch error:", error);
        set({ isLoading: false });
      });
    return subscriber;
  },

  acceptTask: async (donationId, volunteerId) => {
    set({isLoading: true});
    try {
      const docRef = firestore().collection('donations').doc(donationId);

      await firestore().runTransaction(async transaction => {
        const docSnapshot = await transaction.get(docRef);
        if (!docSnapshot.exists) throw new Error('Donation/Task does not exist.');

        const data = docSnapshot.data() as Donation;
        if (data.status !== 'Accepted' || data.volunteerId) {
            throw new Error('Task has already been accepted by another volunteer.');
        }

        transaction.update(docRef, {
            status: 'In Transit',
            volunteerId: volunteerId
        });
      });

      const taskDoc = await docRef.get();
      const taskData = taskDoc.data() as Donation;
      
      await sendStatusUpdateNotification(donationId, 'In Transit', [taskData.donorId], "A volunteer is on the way to pick up your donation");
      if (taskData.charityId) {
        await sendStatusUpdateNotification(donationId, 'In Transit', [taskData.charityId], "A volunteer accepted the pickup task");
      }

      set({isLoading: false});
    } catch(e) {
      set({isLoading: false});
      throw e;
    }
  },

  confirmDelivery: async (donationId) => {
    set({isLoading: true});
    try {
      const docRef = firestore().collection('donations').doc(donationId);
      const doc = await docRef.get();
      const data = doc.data() as Donation;

      await docRef.update({
        status: 'Delivered',
        deliveredAt: new Date().toISOString()
      });

      // Update Environmental & Social Metrics across all involved profiles
      await onDeliveryConfirmed(data);

      await sendStatusUpdateNotification(donationId, 'Delivered', [data.donorId, data.charityId, data.volunteerId].filter((id): id is string => Boolean(id)), "Donation delivered successfully!");
      
      set({isLoading: false});
    } catch(e) {
      set({isLoading: false});
      throw e;
    }
  },

  submitVolunteerRating: async (donationId, volunteerId, stars, note) => {
      try {
        await firestore().collection('ratings').add({
            donationId,
            volunteerId,
            stars,
            note,
            createdAt: new Date().toISOString()
        });
      } catch (e) {
          console.error("Failed to submit rating", e);
          throw e;
      }
  }

}));

import {create} from 'zustand';
import {Donation} from '../models/types';
import firestore from '@react-native-firebase/firestore';
import { sendDonationCreatedAlert, sendSOSAlert, sendStatusUpdateNotification } from '../services/notificationService';
import { getNearbyUserIds } from '../services/locationService';

interface DonationState {
  donations: Donation[];
  isLoading: boolean;
  addDonation: (
    donationData: Omit<Donation, 'id' | 'status' | 'createdAt'>
  ) => Promise<void>;
  acceptDonation: (id: string, charityId: string) => Promise<void>;
  cancelDonation: (id: string) => Promise<void>;
  updateDonation: (
    id: string,
    updates: Partial<Omit<Donation, 'id' | 'status' | 'createdAt'>>
  ) => Promise<void>;
  listenToDonations: () => () => void; // returns unsubscribe function
}

export const useDonationStore = create<DonationState>((set, get) => ({
  donations: [],
  isLoading: false,

  listenToDonations: () => {
    set({ isLoading: true });
    // Real-time listener
    const subscriber = firestore()
      .collection('donations')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const d: Donation[] = [];
        querySnapshot.forEach(documentSnapshot => {
          d.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          } as Donation);
        });
        set({ donations: d, isLoading: false });
      }, error => {
        console.error("Donations fetch error:", error);
        set({ isLoading: false });
      });
      
    return subscriber;
  },

  addDonation: async (donationData) => {
    set({isLoading: true});
    try {
      const docRef = firestore().collection('donations').doc();
      const id = docRef.id;

      let imageUrl = donationData.imageUrl;

      // Auto-SOS Check (24 hours = 86400000 ms)
      const isUrgent = new Date(donationData.expiryDate).getTime() - Date.now() < 86400000;
      const isSOS = donationData.isSOS || isUrgent;

      const newDonation = {
        ...donationData,
        imageUrl,
        isSOS,
        id,
        status: 'Created',
        createdAt: new Date().toISOString(),
      };

      await docRef.set(newDonation);

      // Trigger location matching & notifications
      const center = donationData.location;
      const nearbyCharities = await getNearbyUserIds(center, 50, 'charity'); 
      if (isSOS) {
        const nearbyVols = await getNearbyUserIds(center, 50, 'volunteer');
        await sendSOSAlert(newDonation as Donation, nearbyCharities, nearbyVols);
      } else {
        await sendDonationCreatedAlert(newDonation as Donation, nearbyCharities);
      }
      set({isLoading: false});
    } catch (e) {
      set({isLoading: false});
      throw e;
    }
  },

  acceptDonation: async (id, charityId) => {
    set({isLoading: true});
    try {
      const docRef = firestore().collection('donations').doc(id);

      await firestore().runTransaction(async transaction => {
        const docSnapshot = await transaction.get(docRef);
        if (!docSnapshot.exists) {
            throw new Error('Donation does not exist.');
        }

        const data = docSnapshot.data() as Donation;
        if (data.status !== 'Created') {
            throw new Error('Donation is no longer available to be accepted');
        }

        transaction.update(docRef, {
            status: 'Accepted',
            charityId: charityId
        });
      });

      // Fetch the updated donation to get location & donor info
      const doc = await docRef.get();
      const donData = doc.data() as Donation;
      
      const nearbyVols = await getNearbyUserIds(donData.location, 50, 'volunteer');

      await sendStatusUpdateNotification(id, 'Accepted', [donData.donorId], "A charity accepted your donation!");
      if (nearbyVols.length > 0) {
        await sendStatusUpdateNotification(id, 'Accepted', nearbyVols, "New pickup task available near you");
      }

      set({isLoading: false});
    } catch(e) {
      set({isLoading: false});
      throw e;
    }
  },

    cancelDonation: async (id) => {
    set({isLoading: true});
    try {
       const donation = get().donations.find(d => d.id === id);
       if (!donation) throw new Error('Donation not found');

       await firestore().collection('donations').doc(id).update({
         status: 'Cancelled'
       });

       const parties = [donation.charityId, donation.volunteerId].filter(Boolean) as string[];
       if (parties.length > 0) {
         await sendStatusUpdateNotification(id, 'Cancelled', parties, "Donation has been cancelled");
       }
       set({isLoading: false});
    } catch(e) {
       set({isLoading: false});
       throw e;
    }
  },

  updateDonation: async (id, updates) => {
    set({isLoading: true});
    try {
      await firestore().collection('donations').doc(id).update(updates);
      set({isLoading: false});
    } catch (e) {
      set({isLoading: false});
      throw e;
    }
  }
}));

import {create} from 'zustand';
import firestore from '@react-native-firebase/firestore';
import { generateCSV, generatePDF, exportViaShareAPI } from '../services/reportExport';

interface AdminState {
  isLoading: boolean;
  users: any[];
  startUsersListener: () => void;
  stopUsersListener: () => void;
  approveCharity: (userId: string) => Promise<void>;
  rejectCharity: (userId: string) => Promise<void>;
  suspendUser: (userId: string) => Promise<void>;
  restoreUser: (userId: string) => Promise<void>;
  generateReport: (type: 'csv'|'pdf', dateRange: {start: string, end: string}) => Promise<void>;
}

let unsubUsers: (() => void) | null = null;

export const useAdminStore = create<AdminState>((set) => ({
  isLoading: false,
  users: [],

  startUsersListener: () => {
    if (unsubUsers) return;
    unsubUsers = firestore().collection('users').onSnapshot(snapshot => {
      const usersList: any[] = [];
      snapshot.forEach(doc => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      set({ users: usersList });
    });
  },

  stopUsersListener: () => {
    if (unsubUsers) unsubUsers();
    unsubUsers = null;
    set({ users: [] });
  },

  approveCharity: async (userId: string) => {
    set({isLoading: true});
    try {
      await firestore().collection('users').doc(userId).update({
        status: 'active'
      });
      set({isLoading: false});
    } catch(e) {
      set({isLoading: false});
      throw e;
    }
  },

  rejectCharity: async (userId: string) => {
    set({isLoading: true});
    try {
      await firestore().collection('users').doc(userId).update({
        status: 'rejected'
      });
      set({isLoading: false});
    } catch(e) {
      set({isLoading: false});
      throw e;
    }
  },

  suspendUser: async (userId: string) => {
    set({isLoading: true});
    try {
      await firestore().collection('users').doc(userId).update({
        isSuspended: true,
        status: 'suspended'
      });
      set({isLoading: false});
    } catch(e) {
      set({isLoading: false});
      throw e;
    }
  },

  restoreUser: async (userId: string) => {
    set({isLoading: true});
    try {
      await firestore().collection('users').doc(userId).update({
        isSuspended: false,
        status: 'active'
      });
      set({isLoading: false});
    } catch(e) {
      set({isLoading: false});
      throw e;
    }
  },

  generateReport: async (type, dateRange) => {
    set({isLoading: true});
    try {
      // Fetch all donations (removed date filter so export never fails if database is new)
      const snapshot = await firestore().collection('donations').get();
        
      if (snapshot.empty) {
        throw new Error('No data available for the selected dates');
      }

      const reportData: any[] = [];
      snapshot.forEach(doc => { reportData.push({...doc.data(), id: doc.id}) });

      if (type === 'csv') {
          const csvText = await generateCSV(reportData);
          await exportViaShareAPI(csvText, false);
      } else {
          const pdfUrl = await generatePDF(reportData);
          await exportViaShareAPI(pdfUrl, true);
      }

      set({isLoading: false});
    } catch(e) {
      set({isLoading: false});
      throw e;
    }
  }
}));

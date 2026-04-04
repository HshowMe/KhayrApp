import {create} from 'zustand';
import {User, Role} from '../models/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string, mockRole?: Role) => Promise<void>;
  signup: (email: string, pass: string, name: string, role: Role, extras?: any) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  signup: async (email, pass, name, role, extras) => {
    set({isLoading: true});
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, pass);
      const uid = userCredential.user.uid;

      let status = 'approved';
      if (role === 'charity') {
        status = 'pending_approval';
      }

      const newUserData = {
        id: uid,
        name,
        email,
        role,
        status,
        stats: {totalDonations: 0, mealsProvided: 0, co2Saved: 0, rating: 5},
        createdAt: new Date().toISOString(),
        ...extras
      };

      await firestore().collection('users').doc(uid).set(newUserData);

      if (status === 'pending_approval') {
        await auth().signOut();
        set({isLoading: false});
        throw new Error('Charity account created! Pending admin approval.');
      }

      const user: User = newUserData as User;
      set({user, isAuthenticated: true, isLoading: false});
    } catch (e: any) {
      set({isLoading: false});
      throw e;
    }
  },
  
  login: async (email, pass, mockRole) => {
    set({isLoading: true});
    try {
      // 1. Firebase Auth SignIn
      const userCredential = await auth().signInWithEmailAndPassword(email, pass);
      const uid = userCredential.user.uid;

      // 2. Fetch User Document
      const userDoc = await firestore().collection('users').doc(uid).get();
      if (!userDoc.exists) {
        throw new Error('User record not found in system.');
      }
      
      const userData = userDoc.data() as any;

      // 3. Check Suspended/Approval Status
      if (userData.isSuspended) {
        throw new Error('Account suspended by administrator.');
      }
      if (userData.role === 'charity' && userData.status === 'pending_approval') {
        throw new Error('Account is pending admin approval.');
      }

      // 4. Register FCM Token
      try {
        const token = await messaging().getToken();
        await firestore().collection('users').doc(uid).update({ fcmToken: token });
      } catch(e) { console.log('FCM Registration failed', e); }

      const user: User = {
        id: uid,
        name: userData.name || 'User',
        email: email,
        phone: userData.phone,
        role: userData.role || mockRole || 'donor',
        stats: userData.stats || {totalDonations: 0, mealsProvided: 0, co2Saved: 0, rating: 5},
        location: userData.location,
        address: userData.address,
        operatingAreas: userData.operatingAreas,
      };

      set({user: user, isAuthenticated: true, isLoading: false});

    } catch (error: any) {
      set({isLoading: false});
      if (error.code === 'auth/too-many-requests') {
        throw new Error('Account temporarily locked due to many failed attempts. Try again later.');
      }
      throw error;
    }
  },

  deleteUserAccount: async () => {
    set({isLoading: true});
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await firestore().collection('users').doc(currentUser.uid).delete();
        await currentUser.delete();
        set({user: null, isAuthenticated: false, isLoading: false});
      }
    } catch (e) {
      set({isLoading: false});
      throw e;
    }
  },

  logout: async () => {
    try {
      if (auth().currentUser) {
        await auth().signOut();
      }
    } catch (e) {
      console.warn('Firebase logout error:', e);
    } finally {
      set({user: null, isAuthenticated: false});
    }
  },

  updateUser: async (data) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;
    await firestore().collection('users').doc(currentUser.id).update(data);
    set({user: {...currentUser, ...data} as User});
  },

  setUser: user => set({user, isAuthenticated: !!user}),
}));

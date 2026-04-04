import firebaseApp from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';

export const firebase = {
  app: firebaseApp,
  auth,
  firestore,
  messaging,
  storage,
};

export default firebase;

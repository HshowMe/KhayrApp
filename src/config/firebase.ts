import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

// App is already initialized automatically by @react-native-firebase/app via google-services.json
// But we can export the instances here for easy mocking or centralized access.

export {auth, firestore, messaging};

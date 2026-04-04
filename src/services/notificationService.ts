import messaging from '@react-native-firebase/messaging';
import { Donation } from '../models/types';

// In a real app, these would call a backend Cloud Function to properly fan-out FCM messages securely.
// For the sake of the client-side mock/Firebase prototype, we log the intended outbound calls.

export const sendDonationCreatedAlert = async (donation: Donation, nearbyCharityIds: string[]) => {
  console.log(`[Notification] Alerting charities ${nearbyCharityIds.join(', ')} of new donation: ${donation.title}`);
};

export const sendSOSAlert = async (donation: Donation, nearbyCharityIds: string[], nearbyVolunteerIds: string[]) => {
  console.log(`[Notification] 🚨 SOS ALERT 🚨 for ${donation.title}. Alerting charities & volunteers.`);
};

export const sendStatusUpdateNotification = async (donationId: string, newStatus: string, involvedUserIds: string[], customMessage?: string) => {
  const msg = customMessage || `Donation ${donationId} status updated to ${newStatus}`;
  console.log(`[Notification FCM-MOCK] Alerting users: ${involvedUserIds.join(', ')} | Message: "${msg}"`);
};

export const notifyAdminOfPendingCharity = async (charityId: string) => {
  console.log(`[Notification] Alerting Admin: New Charity ${charityId} requires approval.`);
};

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    const token = await messaging().getToken();
    return token;
  }
  return null;
};

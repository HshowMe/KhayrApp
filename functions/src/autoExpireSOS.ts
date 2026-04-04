import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

export const autoExpireSOS = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
  const now = admin.firestore.Timestamp.now();

  try {
    const expiredDonationsSnapshot = await db.collection('donations')
      .where('status', '==', 'available')
      .where('expiryDate', '<', now.toDate().toISOString())
      .get();

    if (expiredDonationsSnapshot.empty) {
      console.log('No expired donations found.');
      return null;
    }

    const batch = db.batch();
    const expiredIds: string[] = [];

    expiredDonationsSnapshot.forEach(doc => {
      expiredIds.push(doc.id);
      batch.update(doc.ref, {
        status: 'cancelled',
        cancelReason: 'auto-expired'
      });
    });

    await batch.commit();

    console.log(`Auto-expired ${expiredIds.length} donations.`);
    return null;

  } catch (error) {
    console.error('Error auto-expiring SOS donations:', error);
    return null;
  }
});

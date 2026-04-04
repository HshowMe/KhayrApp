import firestore from '@react-native-firebase/firestore';
import { Donation } from '../models/types';

const MEALS_PER_KG = 2; // Assuming 1kg of food provides about 2 meals
const CO2_KG_PER_KG_FOOD = 2.5; // Preventing 1kg of food waste saves roughly 2.5kg of CO2 equivalent emissions

export const onDeliveryConfirmed = async (donation: Donation) => {
  try {
    // Parse the quantity assuming it contains the string 'kg' e.g., '15 kg'
    const match = donation.quantity.match(/(\d+)/);
    const weightKg = match ? parseInt(match[1], 10) : 0;
    
    const mealsSaved = weightKg * MEALS_PER_KG;
    const co2Prevented = weightKg * CO2_KG_PER_KG_FOOD;

    if (mealsSaved > 0 && co2Prevented > 0) {
      // We will perform a batched write to update the Donor, Volunteer, and Charity profiles simultaneously.
      const batch = firestore().batch();

      const userRefs = [
        donation.donorId,
        donation.charityId,
        donation.volunteerId
      ].filter(Boolean) as string[];

      for (const userId of userRefs) {
        const ref = firestore().collection('users').doc(userId);
        batch.set(ref, {
          stats: {
            mealsProvided: firestore.FieldValue.increment(mealsSaved),
            co2Saved: firestore.FieldValue.increment(co2Prevented),
            totalDonations: firestore.FieldValue.increment(1),
          },
        }, {merge: true});
      }

      // We could also maintain a global stats document here
      const globalRef = firestore().collection('platform').doc('stats');
      batch.set(globalRef, {
        totalMeals: firestore.FieldValue.increment(mealsSaved),
        totalCo2: firestore.FieldValue.increment(co2Prevented),
        totalDonations: firestore.FieldValue.increment(1),
      }, {merge: true});

      await batch.commit();
      console.log(`[Impact] Metric successfully synced: +${mealsSaved} meals, +${co2Prevented}kg CO2`);
    }

  } catch (error) {
    console.error('Failed to update impact metrics', error);
  }
};

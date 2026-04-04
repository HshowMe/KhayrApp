import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export const getUserCurrentLocation = async (): Promise<GeoPoint> => {
  // Placeholder for real GPS/expo-location coords. In production this queries the device.
  return { latitude: 24.7136, longitude: 46.6753 }; // Riyadh Mock
};

export const storeUserLocation = async (userId: string, geoPoint: GeoPoint) => {
  try {
    await firestore().collection('users').doc(userId).update({
      location: geoPoint
    });
  } catch (error) {
    console.error('Failed to store user location', error);
  }
};

// Simplified distance calculation using Haversine formula
const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; 
};

export const getNearbyUserIds = async (center: GeoPoint, radiusKm: number, role: string): Promise<string[]> => {
  try {
    // In production, you would use GeoFirestore or standard geohash queries here.
    // For now, we pull all users of the role and filter by distance locally.
    const snapshot = await firestore().collection('users').where('role', '==', role).get();
    const nearbyIds: string[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.location) {
        const dist = getDistanceFromLatLonInKm(center.latitude, center.longitude, data.location.latitude, data.location.longitude);
        if (dist <= radiusKm) {
          nearbyIds.push(doc.id);
        }
      }
    });
    
    return nearbyIds;
  } catch (error) {
    console.error('Error fetching nearby users', error);
    return [];
  }
};

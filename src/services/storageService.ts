import storage from '@react-native-firebase/storage';

export const uploadDonationImage = async (localUri: string, donationId: string): Promise<string> => {
  try {
    const filename = `donations/${donationId}_${Date.now()}.jpg`;
    const reference = storage().ref(filename);
    
    // Upload local file to Firebase Storage
    await reference.putFile(localUri);
    
    // Retrieve and return the download URL
    const url = await reference.getDownloadURL();
    return url;
  } catch (error) {
    console.error('Error uploading image: ', error);
    throw error;
  }
};

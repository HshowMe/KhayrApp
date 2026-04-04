export type Role = 'donor' | 'charity' | 'volunteer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  stats: {
    totalDonations?: number; // Donors
    mealsProvided?: number; // Donors
    co2Saved?: number; // Donors
    tasksCompleted?: number; // Volunteers
    rating?: number; // Volunteers/Charities
  };
  location?: {latitude: number; longitude: number};
  address?: string;
  operatingAreas?: string;
}

export interface Donation {
  id: string;
  donorId: string;
  title: string;
  foodType: string;
  quantity: string;
  expiryDate: string; // ISO String
  isSOS: boolean;
  status: 'Created' | 'Accepted' | 'In Transit' | 'Delivered' | 'Cancelled';
  imageUrl?: string;
  location: {latitude: number; longitude: number};
  charityId?: string;
  volunteerId?: string;
  createdAt: string;
}

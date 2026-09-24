export type RestaurantRegStatus = 
  | 'UNREGISTERED' 
  | 'DOCS_SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'ACTIVE';

export type RestaurantType = 
  | 'Restaurant' 
  | 'Cafe' 
  | 'Bakery' 
  | 'Fast Food' 
  | 'Cloud Kitchen' 
  | 'Sweet Shop' 
  | 'Juice Shop';

export interface OpeningHour {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isOpen: boolean;
  openTime: string; // e.g. "11:00 AM"
  closeTime: string; // e.g. "11:00 PM"
}

export interface VerificationDocument {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
  status: 'NOT_UPLOADED' | 'UPLOADED' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  previewUrl?: string;
}

export interface RestaurantDetails {
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  altPhone?: string;
  
  restaurantName: string;
  restaurantType: RestaurantType;
  cuisines: string[];
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  
  fssaiNumber: string;
  panNumber: string;
  gstNumber?: string;
  bankAccount: string;
  bankName: string;
  ifscCode: string;
  
  logoUrl: string;
  coverUrl: string;
  description: string;
  rating: number;
  totalReviews: number;
  
  isOnline: boolean;
  autoAcceptOrders: boolean;
  newOrderSound: boolean;
  openingHours: OpeningHour[];
  regStatus: RestaurantRegStatus;
}

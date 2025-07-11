export interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  listingId: string;
  listingType: 'product' | 'service' | 'food';
  rating: number;
  comment: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

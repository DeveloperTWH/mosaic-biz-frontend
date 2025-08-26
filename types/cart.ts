export type CartItem = {
  productId: string;
  variantId: string;
  size?: string;
  quantity: number;
};

export type GuestCart = {
  businessId?: string;
  items: CartItem[];
};

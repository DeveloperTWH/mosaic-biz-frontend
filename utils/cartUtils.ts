import { isUserLoggedIn } from './authUtils';

interface CartItem {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
}

export const addToCart = async (
  productId: string,
  variantId: string,
  size: string,
  quantity: number = 1
): Promise<void> => {
  const loggedIn = await isUserLoggedIn();

  if (loggedIn) {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/add`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, variantId, size, quantity }),
    });
  } else {
    const guestCart: CartItem[] = JSON.parse(localStorage.getItem('guest_cart') || '[]');

    const existing = guestCart.find(
      item =>
        item.productId === productId &&
        item.variantId === variantId &&
        item.size === size
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      guestCart.push({ productId, variantId, size, quantity });
    }

    localStorage.setItem('guest_cart', JSON.stringify(guestCart));
  }
};


export const getCart = async (): Promise<CartItem[]> => {
  const loggedIn = await isUserLoggedIn();

  if (loggedIn) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`, {
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch cart');

    const data = await res.json();
    return data.cart || [];
  } else {
    return JSON.parse(localStorage.getItem('guest_cart') || '[]');
  }
};


export const updateCartQuantity = async (
  productId: string,
  variantId: string,
  size: string,
  newQuantity: number
): Promise<void> => {
  const loggedIn = await isUserLoggedIn();

  if (loggedIn) {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/update-quantity`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, variantId, size, quantity: newQuantity }),
    });
  } else {
    let guestCart: CartItem[] = JSON.parse(localStorage.getItem('guest_cart') || '[]');

    guestCart = guestCart.map(item =>
      item.productId === productId &&
      item.variantId === variantId &&
      item.size === size
        ? { ...item, quantity: newQuantity }
        : item
    );

    localStorage.setItem('guest_cart', JSON.stringify(guestCart));
  }
};


export const removeFromCart = async (
  productId: string,
  variantId: string,
  size: string
): Promise<void> => {
  const loggedIn = await isUserLoggedIn();

  if (loggedIn) {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/remove`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, variantId, size }),
    });
  } else {
    const guestCart: CartItem[] = JSON.parse(localStorage.getItem('guest_cart') || '[]');

    const updatedCart = guestCart.filter(
      item =>
        !(
          item.productId === productId &&
          item.variantId === variantId &&
          item.size === size
        )
    );

    localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
  }
};

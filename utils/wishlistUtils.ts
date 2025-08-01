import { isUserLoggedIn } from './authUtils';

/**
 * Toggle wishlist for both logged-in and guest users.
 */
export const toggleWishlist = async (productId: string): Promise<void> => {
//   const loggedIn = await isUserLoggedIn();
  const loggedIn = false;

  if (loggedIn) {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist/toggle`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
  } else {
    let wishlist = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');

    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter((id: string) => id !== productId);
    } else {
      wishlist.push(productId);
    }

    localStorage.setItem('guest_wishlist', JSON.stringify(wishlist));
  }
};

/**
 * Get the wishlist for a guest user.
 */
export const getGuestWishlist = (): string[] => {
  return JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
};

/**
 * Check if a product is in the wishlist (supports both user and guest).
 */
export const isProductWishlisted = async (productId: string): Promise<boolean> => {
//   const loggedIn = await isUserLoggedIn();
  const loggedIn = false;

  if (loggedIn) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist`, {
      credentials: 'include',
    });
    const data = await res.json();
    return Array.isArray(data.wishlist) && data.wishlist.includes(productId);
  } else {
    const wishlist = getGuestWishlist();
    return wishlist.includes(productId);
  }
};

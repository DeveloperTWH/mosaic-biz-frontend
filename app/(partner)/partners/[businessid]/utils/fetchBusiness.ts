import axios from 'axios';
import { Business } from '@/types/business';

export const fetchBusinessBySlug = async (slug: string): Promise<Business> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/${slug}`,
    { withCredentials: true }
  );

  if (response.status !== 200) {
    throw new Error('Failed to fetch business data');
  }

  const { business, subscriptionPlan } = response.data.data;

  // 🔹 Merge imageLimit & videoLimit from subscription plan into business
  return {
    ...business,
    imageLimit: subscriptionPlan?.limits?.imageLimit ?? 0,
    videoLimit: subscriptionPlan?.limits?.videoLimit ?? 0,
  };
};

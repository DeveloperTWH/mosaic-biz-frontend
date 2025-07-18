'use client';
import { create } from 'zustand';
import { Business } from '@/types/business';

interface BusinessStore {
  business: Business | null;
  setBusiness: (business: Business) => void;
  clearBusiness: () => void;
}

export const useBusinessStore = create<BusinessStore>((set) => ({
  business: null,
  setBusiness: (business) => set({ business }),
  clearBusiness: () => set({ business: null }),
}));

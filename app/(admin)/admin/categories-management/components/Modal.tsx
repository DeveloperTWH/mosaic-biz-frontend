// components/Modal.tsx
'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, children }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-lg p-6 bg-white rounded shadow-lg">
        <button onClick={onClose} className="absolute text-gray-500 top-3 right-3 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

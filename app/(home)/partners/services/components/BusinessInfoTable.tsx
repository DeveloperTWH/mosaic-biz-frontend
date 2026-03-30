'use client';

import React from 'react';
import { Edit2, MapPin } from 'lucide-react';
import { Service } from '../types';

interface Props {
  service: Service | null;
  onEdit: (service: Service) => void;
}

const getOpenDaysLabel = (service: Service) => {
  const openDays = (service.businessHours || []).filter((day) => !day.closed).length;
  return `${openDays} open day${openDays === 1 ? '' : 's'}`;
};

export default function BusinessInfoTable({ service, onEdit }: Props) {
  if (!service) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
        <p className="text-gray-500">No business service info found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-900">Business Service Info</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-400">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Business</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Location & Hours</th>
              {/* <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Images</th> */}
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  {service.coverImage ? (
                    <img src={service.coverImage} alt="Business cover" className="w-14 h-14 object-cover rounded" />
                  ) : (
                    <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                      No img
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">Business Info</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <p className="text-gray-900">{service.categoryId?.name || '-'}</p>
                <p className="text-xs text-gray-500">{service.subcategoryId?.name || '-'}</p>
              </td>
              <td className="px-4 py-4">
                <div className="space-y-1">
                  <div className="flex items-start gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                    <span className="line-clamp-2">{service.location || 'No map location added'}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <button
                  onClick={() => onEdit(service)}
                  className="w-8 h-8 flex items-center justify-center bg-yellow-100 hover:bg-yellow-200 rounded transition-colors"
                  aria-label="Edit business info"
                >
                  <Edit2 className="w-4 h-4 text-yellow-600" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

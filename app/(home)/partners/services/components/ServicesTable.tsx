import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { ChildServiceRow } from '../types';

interface Props {
  services: ChildServiceRow[];
  onEdit: (service: ChildServiceRow) => void;
  onDelete: (id: string) => void;
}

export default function ServicesTable({ services, onEdit, onDelete }: Props) {
  if (services.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
        <p className="text-gray-500">No services found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-900">Services</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-400">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Service</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Duration</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service, index) => {
              return (
              <tr key={service._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {service.image ? (
                      <img src={service.image} alt={service.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-900">{service.name}</span>
                      <p className="text-xs text-gray-500 mt-1">
                        {service.parentServiceTitle || 'Business service'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-gray-700 line-clamp-2">{service.description || '-'}</p>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-gray-900">{service.categoryId?.name || '-'}</p>
                    <p className="text-xs text-gray-500">{service.subcategoryId?.name || '-'}</p>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-900">
                  {service.duration || `${service.durationMinutes || 0} minutes`}
                </td>
                <td className="px-4 py-4 text-gray-900">
                  ${service.price ?? 0}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onEdit(service)} 
                      className="w-8 h-8 flex items-center justify-center bg-yellow-100 hover:bg-yellow-200 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-yellow-600" />
                    </button>
                    <button 
                      onClick={() => onDelete(service._id)} 
                      className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

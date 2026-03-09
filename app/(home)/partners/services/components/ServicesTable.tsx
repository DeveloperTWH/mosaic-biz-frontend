import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { Service } from '../types';

interface Props {
  services: Service[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ServicesTable({ services, onView, onEdit, onDelete }: Props) {
  
  const getStatusBadge = (isPublished: boolean) => {
    return isPublished 
      ? <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Published</span>
      : <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Draft</span>;
  };

  if (services.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
        <p className="text-gray-500">No services found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-400">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Service</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Category</th>
              {/* <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Subservises</th> */}
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service, index) => {
              const actionId = service.parentServiceId || service._id;
              return (
              <tr key={service._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {service.coverImage ? (
                      <img src={service.coverImage} alt={service.title} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-900">{service.title}</span>
                      <p className="text-xs text-gray-500 mt-1">{service.duration}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-gray-900">{service.categoryId?.name || '-'}</p>
                    <p className="text-xs text-gray-500">{service.subcategoryId?.name || '-'}</p>
                  </div>
                </td>
                {/* <td className="px-4 py-4">
                  <span className="text-sm text-gray-900">{service.services?.length || 0}</span>
                </td> */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onView(actionId)} 
                      className="w-8 h-8 flex items-center justify-center bg-blue-100 hover:bg-blue-200 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    <button 
                      onClick={() => onEdit(actionId)} 
                      className="w-8 h-8 flex items-center justify-center bg-yellow-100 hover:bg-yellow-200 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-yellow-600" />
                    </button>
                    <button 
                      onClick={() => onDelete(actionId)} 
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

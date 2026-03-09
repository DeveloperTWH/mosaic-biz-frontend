import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { Food } from '../types';

interface Props {
  foods: Food[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function FoodsTable({ foods, onView, onEdit, onDelete }: Props) {
  
  const getStatusBadge = (isPublished: boolean) => {
    return isPublished 
      ? <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Published</span>
      : <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Draft</span>;
  };

  if (foods.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
        <p className="text-gray-500">No foods found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Food Item</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th> */}
              {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prep Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th> */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {foods.map((food) => (
              <tr key={food._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {food.coverImage ? (
                      <img src={food.coverImage} alt={food.title} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{food.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{food.categoryId?.name || '-'}</td>
                {/* <td className="px-4 py-3 font-medium">${food.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-600">{food.preparationTime}</td> */}
                {/* <td className="px-4 py-3">{getStatusBadge(food.isPublished)}</td> */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onView(food._id)} className="p-1 hover:bg-blue-50 rounded">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    <button onClick={() => onEdit(food._id)} className="p-1 hover:bg-green-50 rounded">
                      <Edit2 className="w-4 h-4 text-green-600" />
                    </button>
                    <button onClick={() => onDelete(food._id)} className="p-1 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
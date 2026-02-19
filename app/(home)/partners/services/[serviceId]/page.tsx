'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchService();
  }, [params.serviceId]);

  const fetchService = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/services/${params.serviceId}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      setService(data.service);
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-12 h-12 text-[#c9a227] animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Service not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => router.back()} className="flex items-center text-gray-600 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <div className="bg-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{service.title}</h1>
          <p className="text-gray-600 mb-4">{service.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><span className="font-medium">Price:</span> ${service.price}</div>
            <div><span className="font-medium">Duration:</span> {service.duration}</div>
            <div><span className="font-medium">Category:</span> {service.categoryId?.name}</div>
            <div><span className="font-medium">Status:</span> {service.isPublished ? 'Published' : 'Draft'}</div>
          </div>

          {service.services && service.services.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Service Options</h2>
              {service.services.map((s: any, i: number) => (
                <div key={i} className="border-t pt-2 mt-2">
                  <p><span className="font-medium">{s.name}</span> - ${s.price} / {s.durationMinutes}min</p>
                  <p className="text-sm text-gray-600">{s.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Car, Edit, Trash2, Plus } from 'lucide-react';

interface CarData {
  _id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  type: string;
  images: string[];
}

export default function AdminCarsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchCars();
  }, [session, status, router]);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      if (response.ok) {
        const data = await response.json();
        setCars(data);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCars(cars.filter(car => car._id !== carId));
      } else {
        alert('Failed to delete car');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Error deleting car');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Car Management</h1>
              <p className="text-gray-600">Add, edit, and remove cars from inventory</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => router.push('/admin/cars/add')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
              >
                <Plus className="h-4 w-4" />
                <span>Add Car</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Cars ({cars.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price/Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cars.map((car) => (
                  <tr key={car._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {car.images && car.images.length > 0 ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={car.images[0]}
                              alt={car.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Car className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{car.name}</div>
                          <div className="text-sm text-gray-500">{car.brand} {car.model}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{car.year}</div>
                      <div className="text-sm text-gray-500">{car.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${car.pricePerDay}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/admin/cars/edit/${car._id}`)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteCar(car._id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {cars.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Car className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No cars</h3>
              <p className="mt-1 text-sm text-gray-500">No cars found in the inventory.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

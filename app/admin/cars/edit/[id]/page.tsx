'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Car, ArrowLeft, Upload } from 'lucide-react';

interface CarFormData {
  name: string;
  brand: string;
  year: number;
  pricePerDay: number;
  type: string;
  description: string;
  features: string[];
  images: string[];
  available: boolean;
}

export default function EditCarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const carId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState<CarFormData>({
    name: '',
    brand: '',
    year: new Date().getFullYear(),
    pricePerDay: 0,
    type: '',
    description: '',
    features: [],
    images: [],
    available: true,
  });

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchCar();
  }, [session, status, router, carId]);

  const fetchCar = async () => {
    try {
      const response = await fetch(`/api/cars/${carId}`);
      if (response.ok) {
        const car = await response.json();
        setFormData({
          name: car.name || '',
          brand: car.brand || '',
          year: car.year || new Date().getFullYear(),
          pricePerDay: car.pricePerDay || 0,
          type: car.type || '',
          description: car.description || '',
          features: car.features || [],
          images: car.images || [],
          available: car.available !== undefined ? car.available : true,
        });
      } else {
        alert('Failed to fetch car data');
        router.push('/admin/cars');
      }
    } catch (error) {
      console.error('Error fetching car:', error);
      alert('Error fetching car data');
      router.push('/admin/cars');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/cars');
      } else {
        alert('Failed to update car');
      }
    } catch (error) {
      console.error('Error updating car:', error);
      alert('Error updating car');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const features = e.target.value.split(',').map(f => f.trim()).filter(f => f);
    setFormData(prev => ({ ...prev, features }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const images = e.target.value.split(',').map(img => img.trim()).filter(img => img);
    setFormData(prev => ({ ...prev, images }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  if (status === 'loading' || fetchLoading) {
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Car</h1>
                <p className="text-gray-600">Update car information</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Car Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., BMW X5"
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., BMW"
                />
              </div>



              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Day ($) *
                </label>
                <input
                  type="number"
                  id="pricePerDay"
                  name="pricePerDay"
                  required
                  min="0"
                  step="0.01"
                  value={formData.pricePerDay}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="50.00"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="suv">SUV</option>
                  <option value="sedan">Sedan</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="coupe">Coupe</option>
                  <option value="convertible">Convertible</option>
                  <option value="wagon">Wagon</option>
                  <option value="pickup">Pickup</option>
                  <option value="van">Van</option>
                  <option value="luxury">Luxury</option>
                  <option value="sports">Sports</option>
                  <option value="truck">Truck</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe the car..."
              />
            </div>

            <div>
              <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
                Features (comma-separated)
              </label>
              <input
                type="text"
                id="features"
                name="features"
                value={formData.features.join(', ')}
                onChange={handleFeaturesChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Air conditioning, GPS, Leather seats"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Car image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-car.jpg'; // fallback image
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    placeholder="Enter image URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        if (input.value.trim()) {
                          setFormData(prev => ({
                            ...prev,
                            images: [...prev.images, input.value.trim()]
                          }));
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input.value.trim()) {
                        setFormData(prev => ({
                          ...prev,
                          images: [...prev.images, input.value.trim()]
                        }));
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
                  >
                    Add URL
                  </button>
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer">
                    <Upload className="h-4 w-4 inline mr-2" />
                    Upload Files
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Add images by entering URLs (press Enter or click "Add URL") or upload files from your computer. Hover over images to remove them.
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="available"
                name="available"
                checked={formData.available}
                onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                Available for booking
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating Car...' : 'Update Car'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Car } from '../types';
import { Heart, Star, Eye, ImageOff } from 'lucide-react';

interface CarCardProps {
  car: Car;
  showActions?: boolean;
}

export default function CarCard({ car, showActions = true }: CarCardProps) {
  const { data: session } = useSession();
  const [imageError, setImageError] = useState(false);
  const [isBookingTestDrive, setIsBookingTestDrive] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleBookTestDrive = async (carId: string) => {
    if (!session) {
      alert('Please sign in to book a test drive.');
      return;
    }

    setIsBookingTestDrive(true);
    try {
      const contactInfo = {
        name: session.user?.name || 'User',
        email: session.user?.email || '',
        phone: '',
      };

      const response = await fetch('/api/test-drives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId,
          contactInfo,
          notes: 'Booked from car card',
        }),
      });

      if (response.ok) {
        alert('Test drive booked successfully! We will contact you soon.');
      } else if (response.status === 409) {
        alert('You have already booked a test drive for this car.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || 'Failed to book test drive. Please try again.');
      }
    } catch (error) {
      console.error('Error booking test drive:', error);
      alert('Failed to book test drive. Please try again.');
    } finally {
      setIsBookingTestDrive(false);
    }
  };

  const handleAddToFavorites = async (carId: string) => {
    if (!session) {
      alert('Please sign in to add favorites.');
      return;
    }

    setIsFavorited(true); // Set immediately for better UX
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId }),
      });

      if (response.ok) {
        alert('Car added to favorites!');
      } else if (response.status === 409) {
        alert('Car is already in your favorites!');
        setIsFavorited(false); // Revert if already favorited
      } else if (response.status === 401) {
        alert('Please sign in to add favorites.');
        setIsFavorited(false);
      } else {
        throw new Error('Failed to add to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites. Please try again.');
      setIsFavorited(false); // Revert on error
    }
  };

  const averageRating = car.reviews.length > 0
    ? car.reviews.reduce((sum, review) => sum + review.rating, 0) / car.reviews.length
    : car.rating || 0;

  const carImage = car.images && car.images.length > 0
    ? car.images[0]
    : car.image || '/images/cars/placeholder.jpg';

  return (
    <div className="bg-white dark:bg-[#1F1F2E] rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900/30 hover:shadow-2xl hover:shadow-purple-100/50 dark:hover:shadow-purple-900/20 hover:-translate-y-2 transition-all duration-300 group animate-fade-in">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        {!imageError ? (
          <Image
            src={carImage}
            alt={car.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <div className="text-center">
              <ImageOff className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Image unavailable</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

        {/* Overlay Actions */}
        {showActions && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => car._id && handleAddToFavorites(car._id)}
              className="p-2 bg-white/90 dark:bg-[#1F1F2E]/90 rounded-full hover:bg-white dark:hover:bg-[#1F1F2E] transition-colors duration-300"
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-400'}`} />
            </button>
            <Link
              href={`/cars/${car._id}`}
              className="p-2 bg-white/90 dark:bg-[#1F1F2E]/90 rounded-full hover:bg-white dark:hover:bg-[#1F1F2E] transition-colors duration-300"
            >
              <Eye className="h-4 w-4 text-[#C084FC]" />
            </Link>
          </div>
        )}

        {/* Year Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-[#C084FC] to-[#A78BFA] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          {car.year}
        </div>
      </div>

      <div className="p-5">
        {/* Car Name, Brand, and Type in Box */}
        <div className="mb-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300">
            {car.brand} {car.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Brand: {car.brand || 'N/A'}
            </span>
            <span className="inline-block bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
              {car.type}
            </span>
          </div>
        </div>

        {/* Price */}
        <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-3">
          ${car.price.toLocaleString()}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'text-[#D8B4FE] fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-purple-600 dark:text-purple-400 ml-1">
              {averageRating.toFixed(1)} ({car.reviews.length})
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2">
            <Link
              href={`/cars/${car._id}`}
              className="flex-1 bg-gradient-to-r from-[#D8B4FE] to-[#C084FC] text-white text-center py-2 px-4 rounded-lg hover:from-[#C4B5FD] hover:to-[#A78BFA] transition-all duration-300 transform hover:scale-105 font-medium"
            >
              View Details
            </Link>
            <button
              onClick={() => car._id && handleBookTestDrive(car._id)}
              disabled={isBookingTestDrive}
              className="px-4 py-2 bg-gradient-to-r from-[#F5E0FF] to-[#DDD6FE] dark:from-[#2B2B3D] dark:to-[#3B3B4D] text-[#6D28D9] dark:text-[#EDE9FE] rounded-lg hover:from-[#DDD6FE] hover:to-[#C4B5FD] dark:hover:from-[#3B3B4D] dark:hover:to-[#4B4B5D] transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBookingTestDrive ? 'Booking...' : 'Book Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import Image from 'next/image';
import { Car, Review } from '../../../types';
import { Star, Heart, Calendar, Gauge, Fuel, Palette, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CarCard from '../../../components/CarCard';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CarDetails() {
  const params = useParams();
  const id = params.id as string;

  const { data: car, error, isLoading } = useSWR<Car>(
    id ? `/api/cars/${id}` : null,
    fetcher
  );

  const { data: reviews, mutate: mutateReviews } = useSWR<Review[]>(
    id ? `/api/reviews/${id}` : null,
    fetcher
  );

  const { data: relatedCars, error: relatedError, isLoading: relatedLoading } = useSWR<Car[]>(
    id && car ? `/api/cars?type=${car.type}&limit=4&exclude=${id}` : null,
    fetcher
  );

  const [newReview, setNewReview] = useState({ user: '', rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState('guest');
  const [isBookingTestDrive, setIsBookingTestDrive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAddToFavorites = async () => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, carId: id }),
      });

      if (response.ok) {
        setIsFavorite(true);
        alert('Car added to favorites!');
      } else if (response.status === 409) {
        alert('Car is already in your favorites!');
      } else {
        throw new Error('Failed to add to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites. Please try again.');
    }
  };

  const handleBookTestDrive = async () => {
    setIsBookingTestDrive(true);
    try {
      const contactInfo = { name: 'Guest User', email: 'guest@example.com', phone: '' };
      const response = await fetch('/api/test-drives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, carId: id, contactInfo, notes: 'Booked from car details page' }),
      });

      if (response.ok) {
        alert('Test drive booked successfully! We will contact you soon.');
      } else if (response.status === 409) {
        alert('You have already booked a test drive for this car.');
      } else {
        throw new Error('Failed to book test drive');
      }
    } catch (error) {
      console.error('Error booking test drive:', error);
      alert('Failed to book test drive. Please try again.');
    } finally {
      setIsBookingTestDrive(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.user.trim() || !newReview.comment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId: id, ...newReview }),
      });

      if (response.ok) {
        setNewReview({ user: '', rating: 5, comment: '' });
        mutateReviews();
      } else {
        console.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE] dark:from-[#1F1F2E] dark:via-[#2B2B3D] dark:to-[#1F1F2E] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C084FC] mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading car details...</p>
      </div>
    </div>
  );

  if (error || !car) return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE] dark:from-[#1F1F2E] dark:via-[#2B2B3D] dark:to-[#1F1F2E] flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">Failed to load car details.</p>
      </div>
    </div>
  );

  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const images = car.images && car.images.length > 0 ? car.images : [car.image || '/images/cars/placeholder.jpg'];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE] dark:from-[#1F1F2E] dark:via-[#2B2B3D] dark:to-[#1F1F2E]">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-500 transition-colors duration-300 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Cars
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Carousel */}
          <div className="relative">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
            </div>

            {/* Main Image Container */}
            <div className="relative h-96 lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl transform-gpu hover:scale-105 transition-all duration-700 ease-out"
                 style={{
                   background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)',
                   backdropFilter: 'blur(20px)',
                   border: '1px solid rgba(255,255,255,0.2)',
                   boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                   transform: 'perspective(1000px) rotateX(2deg) rotateY(-2deg)',
                 }}>
              {/* Inner Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 rounded-3xl"></div>

              {/* Image with Enhanced Styling */}
              <Image
                src={images[currentImageIndex]}
                alt={car.name ? `${car.name} - ${car.type} ${car.year} car` : 'Car image'}
                fill
                className="object-contain relative z-10 drop-shadow-2xl"
                quality={100}
                priority
                style={{
                  filter: 'brightness(1.05) contrast(1.1) saturate(1.1)',
                }}
              />

              {/* Floating Decorative Elements */}
              <div className="absolute top-6 left-6 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-lg animate-bounce delay-300"></div>
              <div className="absolute top-12 right-8 w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full shadow-lg animate-bounce delay-700"></div>
              <div className="absolute bottom-8 left-12 w-4 h-4 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full shadow-lg animate-bounce delay-500"></div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md p-3 rounded-full hover:bg-white/50 transition">
                  <ChevronLeft className="h-6 w-6 text-purple-700" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md p-3 rounded-full hover:bg-white/50 transition">
                  <ChevronRight className="h-6 w-6 text-purple-700" />
                </button>
              </>
            )}

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 justify-center flex-wrap">
                {images.map((img, index) => (
                  <div key={index} onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 ${index === currentImageIndex ? 'border-purple-500' : 'border-transparent'} transition-all duration-300 hover:scale-105`}
                  >
                    <Image src={img} alt={`Thumbnail ${index + 1} of ${car.name || 'car'}`} width={80} height={80} className="object-cover" quality={100} />
                  </div>
                ))}
              </div>
            )}

            {/* Favorite Button */}
            <button onClick={handleAddToFavorites} className="absolute top-4 right-4 bg-white/90 dark:bg-[#1F1F2E]/90 p-3 rounded-full hover:bg-white dark:hover:bg-[#1F1F2E] transition-all duration-300">
              <Heart className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-400'}`} />
            </button>
          </div>

          {/* Car Information */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">{car.brand} {car.name}</h1>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-gradient-to-r from-purple-200 to-purple-400 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">{car.type}</span>
              <span className="bg-gradient-to-r from-purple-100 to-purple-300 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {car.year}
              </span>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-6">${car.price ? car.price.toLocaleString() : 'N/A'}</p>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">{car.description}</p>

            {/* Car Specs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {car.engine && (
                <div className="bg-white/70 dark:bg-[#2B2B3D]/70 p-4 rounded-xl shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-2"><Gauge className="h-5 w-5 text-purple-500" /><span className="text-sm font-medium text-gray-600 dark:text-gray-400">Engine</span></div>
                  <p className="text-gray-900 dark:text-white font-semibold">{car.engine}</p>
                </div>
              )}
              {car.fuel && (
                <div className="bg-white/70 dark:bg-[#2B2B3D]/70 p-4 rounded-xl shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-2"><Fuel className="h-5 w-5 text-purple-500" /><span className="text-sm font-medium text-gray-600 dark:text-gray-400">Fuel</span></div>
                  <p className="text-gray-900 dark:text-white font-semibold">{car.fuel}</p>
                </div>
              )}
            </div>

            {/* Colors */}
            {car.colors && car.colors.length > 0 && (
              <div className="bg-white/70 dark:bg-[#2B2B3D]/70 p-4 rounded-xl shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-2 mb-3"><Palette className="h-5 w-5 text-purple-500" /><span className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Colors</span></div>
                <div className="flex flex-wrap gap-2">
                  {car.colors.map((color, index) => (
                    <span key={index} className="bg-gradient-to-r from-purple-200 to-purple-400 text-purple-700 px-3 py-1 rounded-full text-sm">{color}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Rating */}
            <div className="bg-white/70 dark:bg-[#2B2B3D]/70 p-4 rounded-xl shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-6 h-6 ${i < Math.floor(averageRating) ? 'text-purple-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">({reviews?.length || 0} reviews)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button onClick={handleBookTestDrive} disabled={isBookingTestDrive}
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-700 text-white py-4 px-6 rounded-xl hover:from-purple-600 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg">
                {isBookingTestDrive ? 'Booking...' : 'Book Test Drive'}
              </button>
              <button onClick={handleAddToFavorites}
                className="px-6 py-4 bg-gradient-to-r from-purple-100 to-purple-300 text-purple-700 rounded-xl hover:from-purple-200 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 font-semibold">
                Add to Favorites
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white/80 dark:bg-[#1F1F2E]/80 rounded-2xl shadow-xl p-8 mb-12 backdrop-blur-md">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Reviews & Ratings</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Write Review */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                  <input type="text" value={newReview.user} onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-[#2B2B3D] dark:text-[#EDE9FE] transition-all duration-300" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button key={rating} type="button" onClick={() => setNewReview({ ...newReview, rating })}
                        className={`p-2 rounded-lg transition-all duration-300 ${rating <= newReview.rating ? 'text-purple-400 bg-purple-100 dark:bg-[#2B2B3D]' : 'text-gray-300 hover:text-purple-400'}`}>
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                  <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-[#2B2B3D] dark:text-[#EDE9FE] transition-all duration-300 resize-none"
                    placeholder="Share your experience with this car..." required />
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 px-6 rounded-xl hover:from-purple-600 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold">
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>

            {/* Recent Reviews */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Recent Reviews</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-[#2B2B3D] dark:to-[#1F1F2E] p-4 rounded-xl shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{review.user}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-purple-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Cars */}
        {relatedCars && relatedCars.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Related Cars</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCars.map((c) => (
                <CarCard key={c._id} car={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

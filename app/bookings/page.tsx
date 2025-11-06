'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowLeft, Edit, Trash2, CheckCircle, XCircle, Clock, Car } from 'lucide-react';
import { Car as CarType } from '../../types';
import Header from '../../components/Header';
import { useSession } from 'next-auth/react';
import { formatDate, formatDateRange } from '../../lib/dateUtils';

interface Booking {
  _id: string;
  user: string;
  car: CarType;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function BookingsPageContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const carId = searchParams.get('carId');

  useEffect(() => {
    // Force English locale for date inputs
    document.documentElement.lang = 'en';
  }, []);

  const { data, error, isLoading, mutate } = useSWR<{ bookings: Booking[] }>(
    session ? `/api/bookings` : null,
    fetcher
  );

  const bookings = data?.bookings;

  const { data: car, error: carError, isLoading: carLoading } = useSWR<CarType>(
    carId ? `/api/cars/${carId}` : null,
    fetcher
  );

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Force English date picker
  useEffect(() => {
    const inputs = document.querySelectorAll('input[type="date"]') as NodeListOf<HTMLInputElement>;
    inputs.forEach(input => {
      input.setAttribute('lang', 'en');
      // Override the browser's date picker locale
      const originalValue = input.value;
      input.value = '';
      input.value = originalValue;
    });
  }, []);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !carId) return;

    setIsBooking(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId, startDate, endDate, notes }),
      });

      if (response.ok) {
        setSuccessMessage('Booking created successfully!');
        setStartDate('');
        setEndDate('');
        setNotes('');
        mutate(); // Refresh bookings list
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || 'Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        mutate(); // Refresh the list
        alert('Booking cancelled successfully.');
      } else {
        throw new Error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE] dark:from-[#1F1F2E] dark:via-[#2B2B3D] dark:to-[#1F1F2E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C084FC] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE] dark:from-[#1F1F2E] dark:via-[#2B2B3D] dark:to-[#1F1F2E] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">Failed to load bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#C084FC] hover:text-[#A78BFA] transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cars
          </Link>
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-[#C084FC]" />
            <h1 className="text-3xl font-bold gradient-text">
              My Bookings
            </h1>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 p-4 rounded-xl mb-8 text-center font-semibold">
            {successMessage}
          </div>
        )}

        {/* Booking Form */}
        {carId && car ? (
          <div className="bg-white dark:bg-[#2B2B3D] rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Book {car.name}</h2>
            <form onSubmit={handleCreateBooking} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date (MM/DD/YYYY)</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-[#1F1F2E] dark:text-[#EDE9FE] transition-all duration-300"
                    lang="en"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date (MM/DD/YYYY)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-[#1F1F2E] dark:text-[#EDE9FE] transition-all duration-300"
                    lang="en"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-[#1F1F2E] dark:text-[#EDE9FE] transition-all duration-300 resize-none"
                  placeholder="Any special requests or notes..."
                />
              </div>
              <button
                type="submit"
                disabled={isBooking}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-4 px-6 rounded-xl hover:from-purple-600 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
              >
                {isBooking ? 'Creating Booking...' : 'Create Booking'}
              </button>
            </form>
          </div>
        ) : null}

        {/* Bookings List */}
        {!carId ? (
          !bookings || bookings.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No bookings scheduled</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Book your first car rental to get started!</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Car className="h-5 w-5" />
                Browse Cars
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {bookings && bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((booking) => (
                <div key={booking._id} className="bg-white dark:bg-[#2B2B3D] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="relative h-48">
                    <Image
                      src={booking.car?.images?.[0] || booking.car?.image || 'https://via.placeholder.com/400x300/cccccc/666666?text=No+Image'}
                      alt={booking.car?.name || 'Car'}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{booking.car?.name || 'Unknown Car'}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-gradient-to-r from-[#DDD6FE] to-[#C084FC] dark:from-[#3B3B4D] dark:to-[#4B4B5D] text-[#6D28D9] dark:text-[#EDE9FE] px-3 py-1 rounded-full text-sm font-semibold">
                        {booking.car?.type || 'N/A'}
                      </span>
                      <span className="bg-gradient-to-r from-[#F5E0FF] to-[#DDD6FE] dark:from-[#4B4B5D] dark:to-[#5B5B6D] text-[#6D28D9] dark:text-[#EDE9FE] px-3 py-1 rounded-full text-sm font-semibold">
                        {booking.car?.year || 'N/A'}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDateRange(booking.startDate, booking.endDate)}</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        Total: ${booking.totalPrice}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Booked on {formatDate(booking.createdAt)}
                      </div>
                      <div className="flex gap-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 font-medium text-sm flex items-center gap-2"
                            title="Cancel Booking"
                          >
                            <Trash2 className="h-4 w-4" />
                            Cancel
                          </button>
                        )}
                        <Link
                          href={`/cars/${booking.car?._id}`}
                          className="bg-[#C084FC] text-white px-4 py-2 rounded-md hover:bg-[#A78BFA] transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                        >
                          View Car
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingsPageContent />
    </Suspense>
  );
}

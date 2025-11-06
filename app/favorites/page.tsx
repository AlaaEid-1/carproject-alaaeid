'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { Car, Heart, ArrowLeft, Trash2, LogIn } from 'lucide-react';
import { Car as CarType } from '../../types';
import Header from '../../components/Header';

interface Favorite {
  _id: string;
  userId: string;
  carId: CarType;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FavoritesPage() {
  const { data: session, status } = useSession();

  const { data: favorites, error, isLoading, mutate } = useSWR<Favorite[]>(
    status === 'authenticated' ? '/api/favorites' : null,
    fetcher
  );

  const handleRemoveFavorite = async (carId: string) => {
    try {
      const response = await fetch(`/api/favorites/${carId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?.email }),
      });

      if (response.ok) {
        mutate(); // Refresh the favorites list
      } else {
        console.error('Failed to remove favorite');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE] dark:from-[#1F1F2E] dark:via-[#2B2B3D] dark:to-[#1F1F2E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C084FC] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE] dark:from-[#1F1F2E] dark:via-[#2B2B3D] dark:to-[#1F1F2E] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">Failed to load favorites.</p>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE] dark:from-[#1F1F2E] dark:via-[#2B2B3D] dark:to-[#1F1F2E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C084FC] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE] dark:from-[#1F1F2E] dark:via-[#2B2B3D] dark:to-[#1F1F2E] flex items-center justify-center">
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please sign in to view your favorites.</p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C084FC] to-[#A78BFA] text-white px-6 py-3 rounded-xl hover:from-[#A78BFA] hover:to-[#8B5CF6] transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            <LogIn className="h-5 w-5" />
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE] dark:from-[#1F1F2E] dark:via-[#2B2B3D] dark:to-[#1F1F2E]">
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
            <Heart className="h-6 w-6 text-red-500 fill-current" />
            <h1 className="text-3xl font-bold gradient-text">
              My Favorites
            </h1>
          </div>
        </div>

        {/* Favorites Grid */}
        {!favorites || favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No favorites yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start exploring cars and add them to your favorites!</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C084FC] to-[#A78BFA] text-white px-6 py-3 rounded-xl hover:from-[#A78BFA] hover:to-[#8B5CF6] transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <Car className="h-5 w-5" />
              AlaaExplorion
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites && favorites.map((favorite) => (
              <div key={favorite._id} className="bg-white dark:bg-[#2B2B3D] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-48">
                  <Image
                    src={favorite.carId?.images?.[0] || favorite.carId?.image || 'https://via.placeholder.com/400x300/cccccc/666666?text=No+Image'}
                    alt={favorite.carId?.name || 'Car'}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => favorite.carId?._id && handleRemoveFavorite(favorite.carId._id)}
                    className="absolute top-3 right-3 bg-white/90 dark:bg-[#1F1F2E]/90 p-2 rounded-full hover:bg-white dark:hover:bg-[#1F1F2E] transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{favorite.carId?.name || 'Unknown Car'}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-gradient-to-r from-[#DDD6FE] to-[#C4B5FD] dark:from-[#3B3B4D] dark:to-[#4B4B5D] text-[#6D28D9] dark:text-[#EDE9FE] px-3 py-1 rounded-full text-sm font-semibold">
                      {favorite.carId?.type || 'N/A'}
                    </span>
                    <span className="bg-gradient-to-r from-[#F5E0FF] to-[#DDD6FE] dark:from-[#4B4B5D] dark:to-[#5B5B6D] text-[#6D28D9] dark:text-[#EDE9FE] px-3 py-1 rounded-full text-sm font-semibold">
                      {favorite.carId?.year || 'N/A'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] bg-clip-text text-transparent mb-4">
                    ${favorite.carId?.price?.toLocaleString() || 'N/A'}
                  </p>
                  <Link
                    href={`/cars/${favorite.carId?._id}`}
                    className="w-full bg-gradient-to-r from-[#C084FC] to-[#A78BFA] text-white py-3 px-4 rounded-xl hover:from-[#A78BFA] hover:to-[#8B5CF6] transition-all duration-300 transform hover:scale-105 font-semibold text-center block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

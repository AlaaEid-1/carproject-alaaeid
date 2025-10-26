'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { Car, Calendar, ArrowLeft, Phone, Mail, User, Trash2 } from 'lucide-react';
import { Car as CarType } from '../../types';
import Header from '../../components/Header';

interface TestDrive {
  _id: string;
  userId: string;
  carId: CarType;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TestDrivesPage() {
  const [userId, setUserId] = useState('guest'); // In a real app, this would come from authentication

  const { data: testDrives, error, isLoading, mutate } = useSWR<TestDrive[]>(
    `/api/test-drives?userId=${userId}`,
    fetcher
  );

  const handleDeleteTestDrive = async (testDriveId: string) => {
    if (!confirm('Are you sure you want to cancel this test drive?')) return;

    try {
      const response = await fetch(`/api/test-drives?id=${testDriveId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        mutate(); // Refresh the list
        alert('Test drive cancelled successfully.');
      } else {
        throw new Error('Failed to cancel test drive');
      }
    } catch (error) {
      console.error('Error cancelling test drive:', error);
      alert('Failed to cancel test drive. Please try again.');
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
          <p className="text-gray-600 dark:text-gray-400">Loading test drives...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE] dark:from-[#1F1F2E] dark:via-[#2B2B3D] dark:to-[#1F1F2E] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">Failed to load test drives.</p>
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
              My Test Drives
            </h1>
          </div>
        </div>

        {/* Test Drives List */}
        {!testDrives || testDrives.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No test drives scheduled</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Book your first test drive to experience the cars!</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
            >
              <Car className="h-5 w-5" />
              AlaaExplorion
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {testDrives && testDrives.map((testDrive) => (
              <div key={testDrive._id} className="bg-white dark:bg-[#2B2B3D] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="relative h-48">
                  <Image
                    src={testDrive.carId?.images?.[0] || testDrive.carId?.image || 'https://via.placeholder.com/400x300/cccccc/666666?text=No+Image'}
                    alt={testDrive.carId?.name || 'Car'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(testDrive.status)}`}>
                      {testDrive.status.charAt(0).toUpperCase() + testDrive.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{testDrive.carId?.name || 'Unknown Car'}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gradient-to-r from-[#DDD6FE] to-[#C4B5FD] dark:from-[#3B3B4D] dark:to-[#4B4B5D] text-[#6D28D9] dark:text-[#EDE9FE] px-3 py-1 rounded-full text-sm font-semibold">
                      {testDrive.carId?.type || 'N/A'}
                    </span>
                    <span className="bg-gradient-to-r from-[#F5E0FF] to-[#DDD6FE] dark:from-[#4B4B5D] dark:to-[#5B5B6D] text-[#6D28D9] dark:text-[#EDE9FE] px-3 py-1 rounded-full text-sm font-semibold">
                      {testDrive.carId?.year || 'N/A'}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <User className="h-4 w-4" />
                      <span>{testDrive.contactInfo.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      <span>{testDrive.contactInfo.email}</span>
                    </div>
                    {testDrive.contactInfo.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4" />
                        <span>{testDrive.contactInfo.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Booked on {new Date(testDrive.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteTestDrive(testDrive._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 font-medium text-sm flex items-center gap-2"
                        title="Cancel Test Drive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                      <Link
                        href={`/cars/${testDrive.carId?._id}`}
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
        )}
      </div>
    </div>
  );
}

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Car, Calendar, BarChart3, Shield, Settings } from 'lucide-react';

interface Stats {
  users: number;
  cars: number;
  bookings: number;
  testDrives: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ users: 0, cars: 0, bookings: 0, testDrives: 0 });

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    // Fetch stats
    const fetchStats = async () => {
      try {
        const [usersRes, carsRes, bookingsRes, testDrivesRes] = await Promise.all([
          fetch('/api/users/stats'),
          fetch('/api/cars/stats'),
          fetch('/api/bookings/stats'),
          fetch('/api/test-drives/stats'),
        ]);

        const usersData = await usersRes.json();
        const carsData = await carsRes.json();
        const bookingsData = await bookingsRes.json();
        const testDrivesData = await testDrivesRes.json();

        setStats({
          users: usersData.count || 0,
          cars: carsData.count || 0,
          bookings: bookingsData.count || 0,
          testDrives: testDrivesData.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [session, status, router]);

  if (status === 'loading') {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, cars, and bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cars</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cars}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Test Drives</p>
                <p className="text-2xl font-bold text-gray-900">{stats.testDrives}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/users"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-blue-600" />
              <h3 className="ml-3 text-lg font-semibold text-gray-900">User Management</h3>
            </div>
            <p className="text-gray-600">View, edit, and manage user accounts</p>
          </Link>

          <Link
            href="/admin/cars"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <Car className="h-6 w-6 text-green-600" />
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Car Management</h3>
            </div>
            <p className="text-gray-600">Add, edit, and remove cars from inventory</p>
          </Link>

          <Link
            href="/admin/bookings"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-purple-600" />
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Booking Management</h3>
            </div>
            <p className="text-gray-600">View and manage all bookings</p>
          </Link>

          <Link
            href="/admin/test-drives"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <Settings className="h-6 w-6 text-orange-600" />
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Test Drive Management</h3>
            </div>
            <p className="text-gray-600">View and manage test drive requests</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Calendar, Edit, Trash2, CheckCircle, XCircle, Clock, User, Phone, Mail } from 'lucide-react';
import { formatDate } from '../../../lib/dateUtils';

interface TestDrive {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  carId: {
    name: string;
    brand: string;
    type: string;
    year: number;
  };
  preferredDate: string;
  preferredTime: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function AdminTestDrivesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchTestDrives();
  }, [session, status, router]);

  const fetchTestDrives = async () => {
    try {
      const response = await fetch('/api/test-drives/admin');
      if (response.ok) {
        const data = await response.json();
        setTestDrives(data);
      }
    } catch (error) {
      console.error('Error fetching test drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTestDriveStatus = async (testDriveId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/test-drives/admin?id=${testDriveId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTestDrive = await response.json();
        setTestDrives(testDrives.map(testDrive =>
          testDrive._id === testDriveId ? updatedTestDrive : testDrive
        ));
      } else {
        alert('Failed to update test drive status');
      }
    } catch (error) {
      console.error('Error updating test drive:', error);
      alert('Error updating test drive status');
    }
  };

  const deleteTestDrive = async (testDriveId: string) => {
    if (!confirm('Are you sure you want to delete this test drive?')) return;

    try {
      const response = await fetch(`/api/test-drives/admin?id=${testDriveId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTestDrives(testDrives.filter(testDrive => testDrive._id !== testDriveId));
      } else {
        alert('Failed to delete test drive');
      }
    } catch (error) {
      console.error('Error deleting test drive:', error);
      alert('Error deleting test drive');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Drive Management</h1>
              <p className="text-gray-600">View and manage all test drive requests</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Test Drives ({testDrives.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testDrives.map((testDrive) => (
                  <tr key={testDrive._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{testDrive.userId.name}</div>
                      <div className="text-sm text-gray-500">{testDrive.userId.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{testDrive.carId.name}</div>
                      <div className="text-sm text-gray-500">{testDrive.carId.brand} {testDrive.carId.type} {testDrive.carId.year}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {testDrive.contactInfo.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {testDrive.contactInfo.email}
                      </div>
                      {testDrive.contactInfo.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {testDrive.contactInfo.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(testDrive.status)}`}>
                        {getStatusIcon(testDrive.status)}
                        <span className="ml-1 capitalize">{testDrive.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => testDrive.status === 'pending' ? updateTestDriveStatus(testDrive._id, 'confirmed') : null}
                          className={`transition-colors duration-300 ${testDrive.status === 'pending' ? 'text-green-600 hover:text-green-900' : 'text-gray-400 cursor-not-allowed'}`}
                          title={testDrive.status === 'pending' ? 'Confirm test drive' : 'Already confirmed'}
                          disabled={testDrive.status !== 'pending'}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteTestDrive(testDrive._id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-300"
                          title="Delete test drive"
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

          {testDrives.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No test drives</h3>
              <p className="mt-1 text-sm text-gray-500">No test drive requests found in the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

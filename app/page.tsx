'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import CarCard from '../components/CarCard';
import SearchFilter from '../components/SearchFilter';
import Chat from '../components/Chat';
import Header from '../components/Header';
import { Car } from '../types';
import { ChevronDown, Car as CarIcon } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    type: '',
    year: '',
    priceMin: '',
    priceMax: '',
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [showChat, setShowChat] = useState(false);
  const carsPerPage = 9;

  // Initialize filters from URL search params
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setFilters(prev => ({ ...prev, search }));
    }
  }, [searchParams]);

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.year) params.append('year', filters.year);
    if (filters.priceMin) params.append('priceMin', filters.priceMin);
    if (filters.priceMax) params.append('priceMax', filters.priceMax);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    return params.toString();
  };

  const { data: cars, error, isLoading } = useSWR<Car[]>(
    `/api/cars?${buildQueryString()}`,
    fetcher
  );

  const handleFilter = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSort = (sortBy: string) => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    setFilters({ ...filters, sortBy, sortOrder: newSortOrder });
  };

  // Pagination logic
  const totalPages = Array.isArray(cars) ? Math.ceil(cars.length / carsPerPage) : 0;
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;
  const currentCars = Array.isArray(cars) ? cars.slice(startIndex, endIndex) : [];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select diverse cars for hero section, excluding CR-V
  const heroCars = useMemo(() => {
    if (!cars || !Array.isArray(cars) || cars.length === 0) return [];
    const uniqueTypes = new Set();
    const selectedCars = [];
    for (const car of cars) {
      if (!uniqueTypes.has(car.type) && selectedCars.length < 4 && !car.name.toLowerCase().includes('cr-v')) {
        uniqueTypes.add(car.type);
        selectedCars.push(car);
      }
    }
    // If we don't have 4 different types, fill with remaining cars (excluding CR-V)
    if (selectedCars.length < 4) {
      for (const car of cars) {
        if (!selectedCars.find(selected => selected._id === car._id) && selectedCars.length < 4 && !car.name.toLowerCase().includes('cr-v')) {
          selectedCars.push(car);
        }
      }
    }
    return selectedCars;
  }, [cars]);

  return (
    <div className="min-h-screen">
      {/* Professional Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(139,92,246,0.1),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.1),transparent_50%),radial-gradient(circle_at_40%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Left Side - Content */}
            <div className="space-y-10">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-slate-800 via-purple-700 to-slate-800 bg-clip-text text-transparent">
                    Discover Your
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent">
                    Perfect Car
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
                  Explore our exclusive collection of luxury and performance vehicles. From elegant sedans to powerful SUVs, find the automobile that defines your journey.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => document.getElementById('cars-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white px-10 py-5 rounded-2xl font-semibold text-lg overflow-hidden shadow-2xl hover:shadow-purple-900/30 transition-all duration-500 transform hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <CarIcon className="h-5 w-5" />
                    Explore Collection
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-800 via-pink-600 to-purple-800 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform -skew-x-12 group-hover:animate-pulse"></div>
                </button>
              </div>


            </div>

            {/* Right Side - Car Showcase */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-8">
                {/* 4 Professional Car Images */}
                {heroCars.map((car, index) => (
                  <div key={`hero-${car._id}`} className="group">
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-white to-slate-50 p-4 hover:shadow-3xl hover:shadow-purple-900/20 transition-all duration-700 transform hover:scale-110 hover:-rotate-1">
                      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-white">
                        <img
                          src={car.images && car.images.length > 0 ? car.images[0] : car.image || '/images/cars/placeholder.jpg'}
                          alt={car.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-all duration-700 drop-shadow-lg"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl">
                        <div className="absolute bottom-4 left-4 right-4">
                          <h4 className="text-white font-bold text-lg mb-2 drop-shadow-lg">{car.name}</h4>
                          <p className="text-gray-200 text-sm font-medium drop-shadow-md">{car.year} • {car.type}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-300 text-xs font-medium">Available Now</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 -right-4 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg animate-bounce delay-500"></div>
            </div>
          </div>
        </div>

        {/* Bottom Wave with Gradient */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 fill-current text-white">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div id="cars-section" className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-4">
              <SearchFilter onFilter={handleFilter} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sorting and Results Count */}
            {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 dark:text-gray-300">
                  {cars ? `${cars.length} cars found` : 'Loading...'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-[#2B2B3D] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm"
                >
                  Price
                  <ChevronDown className={`h-4 w-4 transition-transform ${filters.sortBy === 'price' && filters.sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => handleSort('year')}
                  className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-[#2B2B3D] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm"
                >
                  Year
                  <ChevronDown className={`h-4 w-4 transition-transform ${filters.sortBy === 'year' && filters.sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-[#2B2B3D] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm"
                >
                  Name
                  <ChevronDown className={`h-4 w-4 transition-transform ${filters.sortBy === 'name' && filters.sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div> */}

            {/* Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {isLoading && (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C084FC] mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading cars...</p>
                </div>
              )}

              {error && (
                <div className="col-span-full text-center py-12">
                  <p className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">Failed to load cars. Please try again.</p>
                </div>
              )}

              {cars && cars.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="bg-gradient-to-r from-[#F5F3FF] to-[#EDE9FE] dark:from-[#2B2B3D] dark:to-[#1F1F2E] p-8 rounded-lg shadow-lg">
                    <CarIcon className="h-16 w-16 text-[#C084FC] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No cars found</h3>
                    <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria.</p>
                  </div>
                </div>
              )}
              {cars && cars.length > 0 && currentCars.map((car) => (
                <CarCard key={car._id || Math.random()} car={car} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-8">
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    scrollToTop();
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gradient-to-r from-[#D8B4FE] to-[#C084FC] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#C4B5FD] hover:to-[#A78BFA] transition-all duration-300"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        scrollToTop();
                      }}
                      className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-[#C084FC] to-[#A78BFA] text-white'
                          : 'bg-white dark:bg-[#2B2B3D] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#3B3B4D]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    scrollToTop();
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gradient-to-r from-[#D8B4FE] to-[#C084FC] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#C4B5FD] hover:to-[#A78BFA] transition-all duration-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}

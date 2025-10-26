'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, MessageCircle, Heart, Calendar, Search, Menu, X, User } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        // First, search for cars to find exact matches
        const response = await fetch(`/api/cars?search=${encodeURIComponent(searchQuery.trim())}&limit=1`);
        const cars = await response.json();

        if (cars && cars.length > 0) {
          // If exact match found, navigate to car detail page
          router.push(`/cars/${cars[0]._id}`);
        } else {
          // If no exact match, go to home page with search
          router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
        }
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to home page search
        router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    } else {
      router.push('/');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 transform hover:scale-105 transition-transform duration-300">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
             AlaaExplorion
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-300 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
            </Link>

            <Link
              href="/favorites"
              className="flex items-center space-x-1 text-gray-700 hover:text-pink-500 font-medium transition-colors duration-300 relative group"
            >
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full"></span>
            </Link>

            <Link
              href="/test-drives"
              className="flex items-center space-x-1 text-gray-700 hover:text-green-500 font-medium transition-colors duration-300 relative group"
            >
              <Calendar className="h-4 w-4" />
              <span>Test Drives</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full"></span>
            </Link>

            <Link
              href="/chat"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-500 font-medium transition-colors duration-300 relative group"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
            </Link>

            {/* User Profile Button */}
            {/* <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-300">
              <User className="h-5 w-5 text-gray-600" />
            </button> */}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-100 transition-colors duration-300"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 font-medium py-2 px-3 rounded-md hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Home</span>
              </Link>

              <Link
                href="/favorites"
                className="flex items-center space-x-2 text-gray-700 hover:text-pink-500 font-medium py-2 px-3 rounded-md hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-4 w-4" />
                <span>Favorites</span>
              </Link>

              <Link
                href="/test-drives"
                className="flex items-center space-x-2 text-gray-700 hover:text-green-500 font-medium py-2 px-3 rounded-md hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar className="h-4 w-4" />
                <span>Test Drives</span>
              </Link>

              <Link
                href="/chat"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 font-medium py-2 px-3 rounded-md hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat</span>
              </Link>

              {/* Mobile User Profile */}
              <div className="flex items-center space-x-2 text-gray-700 py-2 px-3">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

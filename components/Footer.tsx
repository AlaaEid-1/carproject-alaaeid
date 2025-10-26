import Link from 'next/link';
import { Car, Phone, Mail, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                AlaaExplorion
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover your perfect car with our comprehensive platform and expert guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm">
                  Home
                </Link>
              </li>
             
              <li>
                <Link href="/favorites" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm">
                  Favorites
                </Link>
              </li>
              <li>
                <Link href="/test-drives" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm">
                  Test Drives
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-purple-400" />
                <a href="tel:+970590000000" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm">
                  +970595555555
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-purple-400" />
                <a href="mailto:Alaasupport@gmail.com" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm">
                  alaasupport@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 AlaaEid. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

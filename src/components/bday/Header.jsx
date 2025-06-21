import React from 'react';
import { Gift, Heart } from 'lucide-react';

const Header = ({ currentPage, totalPages, onPageSelect }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Birthday Wishes
            </span>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <Heart className="h-4 w-4 text-pink-500" />
              <span className="text-sm text-gray-600">
                {currentPage} of {totalPages}
              </span>
            </div>

            {/* Page dots */}
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => onPageSelect(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentPage === i
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

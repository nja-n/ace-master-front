import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import QuoteCard from './QuoteCard';
import {birthdayQuotes} from '../../data/quotes'

const GalleryPage = ({ initialPage = 0, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const totalPages = birthdayQuotes.length;

  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage, onPageChange]);

  const goToPage = (pageIndex) => {
    if (pageIndex >= 0 && pageIndex < totalPages && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentPage(pageIndex);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  };

  // Touch/Mouse event handlers
  const handleStart = (clientX) => {
    startXRef.current = clientX;
    isDraggingRef.current = true;
  };

  const handleEnd = (clientX) => {
    if (!isDraggingRef.current) return;

    const deltaX = startXRef.current - clientX;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && currentPage < totalPages - 1) {
        nextPage();
      } else if (deltaX < 0 && currentPage > 0) {
        prevPage();
      }
    }
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    handleEnd(e.changedTouches[0].clientX);
  };

  const handleMouseDown = (e) => {
    handleStart(e.clientX);
  };

  const handleMouseUp = (e) => {
    handleEnd(e.clientX);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevPage();
      } else if (e.key === 'ArrowRight') {
        nextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Quote cards */}
      <div 
        className="flex transition-transform duration-300 ease-out h-full"
        style={{ transform: `translateX(-${currentPage * 100}%)` }}
      >
        {birthdayQuotes.map((quote, index) => (
          <div key={quote.id} className="w-full flex-shrink-0">
            <QuoteCard 
              quote={quote} 
              isActive={Math.abs(index - currentPage) <= 1}
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevPage}
        disabled={currentPage === 0}
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md p-3 rounded-full shadow-lg transition-all duration-300 ${
          currentPage === 0 
            ? 'opacity-30 cursor-not-allowed' 
            : 'opacity-70 hover:opacity-100 hover:scale-110'
        }`}
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      <button
        onClick={nextPage}
        disabled={currentPage === totalPages - 1}
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md p-3 rounded-full shadow-lg transition-all duration-300 ${
          currentPage === totalPages - 1 
            ? 'opacity-30 cursor-not-allowed' 
            : 'opacity-70 hover:opacity-100 hover:scale-110'
        }`}
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Swipe hint */}
      {currentPage === 0 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
            <p className="text-white text-sm">Swipe left or right to navigate</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;

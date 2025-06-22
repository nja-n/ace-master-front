import React from 'react';
import { ArrowRight, Gift, Heart, Star, Sparkles } from 'lucide-react';

const WelcomePage = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 animate-bounce">
          <Star className="h-8 w-8 text-yellow-300 opacity-70" />
        </div>
        <div className="absolute top-20 right-20 animate-pulse">
          <Heart className="h-6 w-6 text-pink-300 opacity-60" />
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce delay-1000">
          <Sparkles className="h-10 w-10 text-purple-300 opacity-50" />
        </div>
        <div className="absolute bottom-10 right-10 animate-pulse delay-500">
          <Gift className="h-7 w-7 text-yellow-300 opacity-70" />
        </div>
      </div>

      <div className="text-center z-10 max-w-2xl mx-auto px-6">
        {/* Main content */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/30">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full shadow-lg animate-pulse">
              <Gift className="h-12 w-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 animate-fade-in">
            Happy Birthday!
          </h1>

          <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed">
            A collection of heartfelt wishes just for you ✨
          </p>

          <p className="text-lg text-white/80 mb-10 max-w-lg mx-auto">
            Every moment you touch holds a feeling I haven't yet spoken - but you’ll feel it in every word, every color, every wish. Happy birthday, from all of me.
          </p>

          <button
            onClick={onStart}
            className="group bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Floating hearts animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute animate-float-${i + 1} opacity-30`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            >
              <Heart className="h-4 w-4 text-pink-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;

import React, { useState } from 'react';
import { Quote as QuoteIcon } from 'lucide-react';

const QuoteCard = ({ quote, isActive }) => {
  const [language, setLanguage] = useState("en");
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${quote.background})` }}
      />

      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${quote.theme} opacity-80`} />

      {/* Content */}
      <div className={`relative z-10 max-w-2xl mx-auto text-center transform transition-all duration-1000 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-70'
        }`}>
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/30">
          {/* Quote icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/30 p-3 rounded-full">
              <QuoteIcon className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Quote text */}
          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium text-white leading-relaxed mb-6">
            "{language === "ml" ? quote.mtext : quote.text}"
          </blockquote>

          {/* Author */}
          {quote.author && (
            <cite className="text-white/80 text-lg font-light">
              — {quote.author}
            </cite>
          )}

          {/* Page number */}
          <div className="mt-8 pt-6 border-t border-white/30">
            <span className="text-white/70 text-sm">
              Whisper #{quote.id}
            </span>
            <div className="flex justify-center m-4">
              <button
                onClick={() => setLanguage("en")}
                className={`px-4 py-1 rounded-l-full text-sm ${language === "en" ? "bg-white text-black" : "bg-white/20 text-white"
                  }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("ml")}
                className={`px-4 py-1 rounded-r-full text-sm ${language === "ml" ? "bg-white text-black" : "bg-white/20 text-white"
                  }`}
              >
                മലയാളം
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;

import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setLoading(false);
            onLoadingComplete();
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    // Ensure loading completes within 3 seconds
    const timeout = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        onLoadingComplete();
      }, 500);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [onLoadingComplete]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8 animate-pulse">
          <img 
            src="/logo.png" 
            alt="WangarèLuxe" 
            className="h-24 w-24 mx-auto mb-4 object-contain"
          />
          <h1 className="text-3xl font-serif text-white font-bold tracking-wider">
            WangarèLuxe
          </h1>
          <p className="text-gray-300 text-sm mt-2 tracking-widest">
            LUXURY REDEFINED
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="mb-8">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-gold rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto mb-4">
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-gold to-yellow-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            {Math.round(Math.min(progress, 100))}%
          </p>
        </div>

        {/* Loading Text */}
        <div className="text-gray-300 text-sm">
          <p className="animate-pulse">Loading your luxury experience...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

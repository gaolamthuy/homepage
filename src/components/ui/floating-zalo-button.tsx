/**
 * Floating Zalo Button Component
 * Nút liên hệ Zalo nổi trên màn hình để khách hàng dễ dàng liên hệ
 */

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface FloatingZaloButtonProps {
  phoneNumber?: string;
  className?: string;
  showOnScroll?: boolean;
  scrollThreshold?: number;
}

/**
 * Component floating Zalo button
 * @param phoneNumber - Số điện thoại Zalo (mặc định: 0901467300)
 * @param className - CSS classes tùy chỉnh
 * @param showOnScroll - Hiển thị khi scroll xuống
 * @param scrollThreshold - Ngưỡng scroll để hiển thị button
 */
const FloatingZaloButton: React.FC<FloatingZaloButtonProps> = ({
  phoneNumber = '0901.467.300',
  className,
  showOnScroll = false, // Mặc định luôn hiển thị
  scrollThreshold = 200
}) => {
  const [isVisible, setIsVisible] = useState(true); // Luôn visible
  const [isHovered, setIsHovered] = useState(false);

  // Handle scroll visibility (chỉ khi showOnScroll = true)
  useEffect(() => {
    if (!showOnScroll) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showOnScroll, scrollThreshold]);

  // Zalo URL
  const zaloUrl = `https://zalo.me/${phoneNumber}`;

  // Handle click với analytics tracking
  const handleClick = () => {
    // Track click event (có thể thêm analytics sau)
    console.log('Zalo button clicked');
    
    // Open Zalo in new tab
    window.open(zaloUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
        className
      )}
    >
      {/* Main Zalo Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'relative group p-2 transition-all duration-300 transform hover:scale-110',
          'focus:outline-none focus:ring-2 focus:ring-[#2962ff]/30 focus:ring-offset-2'
        )}
        aria-label={`Liên hệ Zalo ${phoneNumber}`}
        title={`Chat Zalo với ${phoneNumber}`}
      >
        {/* Zalo Icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 48 48" 
          width="48" 
          height="48"
          className="transition-transform duration-300 group-hover:rotate-12 drop-shadow-lg"
        >
          <path fill="#2962ff" d="M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10	c4.722,0,8.883-2.348,11.417-5.931V36H15z"/>
          <path fill="#eee" d="M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19	c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742	c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083	C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z"/>
          <path fill="#2962ff" d="M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75	S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z"/>
          <path fill="#2962ff" d="M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z"/>
          <path fill="#2962ff" d="M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75	S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5	c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z"/>
          <path fill="#2962ff" d="M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5	c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z"/>
        </svg>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-[#2962ff] blur-sm opacity-20 rounded-lg"></div>
      </button>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span>Chat Zalo ngay!</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          {/* Arrow */}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Phone Number Badge */}
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce">
        {phoneNumber}
      </div>
    </div>
  );
};

export default FloatingZaloButton;

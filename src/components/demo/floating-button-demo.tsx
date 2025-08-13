/**
 * Demo Component cho Floating Zalo Button
 * Hiển thị các variants khác nhau của floating button
 */

import React, { useState } from 'react';
import FloatingZaloButton from '@/components/ui/floating-zalo-button';

/**
 * Demo component để test floating Zalo button
 */
const FloatingButtonDemo: React.FC = () => {
  const [showButton, setShowButton] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('0901.467.300');
  const [showOnScroll, setShowOnScroll] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Floating Zalo Button Demo
        </h1>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Show/Hide Button
              </label>
              <button
                onClick={() => setShowButton(!showButton)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {showButton ? 'Hide' : 'Show'} Button
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Show on Scroll
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showOnScroll}
                  onChange={(e) => setShowOnScroll(e.target.checked)}
                  className="mr-2"
                />
                Enable scroll-based visibility
              </label>
            </div>
          </div>
        </div>

        {/* Demo Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Demo Content</h2>
          
          <p className="mb-4">
            Scroll xuống để thấy floating button xuất hiện (nếu enabled).
          </p>

          {/* Dummy content để scroll */}
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <h3 className="text-lg font-medium mb-2">
                Section {i + 1}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          ))}
        </div>

        {/* Floating Button */}
        {showButton && (
          <FloatingZaloButton
            phoneNumber={phoneNumber}
            showOnScroll={showOnScroll}
          />
        )}
      </div>
    </div>
  );
};

export default FloatingButtonDemo;

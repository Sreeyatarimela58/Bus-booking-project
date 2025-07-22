import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">🚌</div>
              <h3 className="text-xl font-bold">Bus B</h3>
            </div>
            <p className="text-gray-400">India's largest online bus ticket booking platform</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Download App</h4>
            <div className="space-y-2">
              <div className="bg-gray-700 px-4 py-2 rounded cursor-pointer hover:bg-gray-600">📱 Download for iOS</div>
              <div className="bg-gray-700 px-4 py-2 rounded cursor-pointer hover:bg-gray-600">
                🤖 Download for Android
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AbhiBus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;

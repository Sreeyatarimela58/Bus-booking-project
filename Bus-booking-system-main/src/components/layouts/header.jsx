import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [showAccount, setShowAccount] = React.useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = React.useState(false);
  
  // Safely get user from localStorage
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
  }

  // Get user initials for avatar
  const getUserInitials = (email) => {
    if (!email) return 'U';
    const name = email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-[#e57373] text-white shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🚌</span>
          <span className="text-2xl font-bold">Bus B</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-red-200 font-medium transition">
            Bus Tickets
          </Link>
          <Link
            to="/mybookings"
            className="hover:text-red-200 font-medium transition"
          >
            My Bookings
          </Link>
          <Link
            to="/help"
            className="hover:text-red-200 font-medium transition"
          >
            Help
          </Link>
          {user ? (
            <button
              className="relative rounded-full bg-gradient-to-r from-pink-400 to-red-400 text-white w-12 h-12 flex items-center justify-center border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
              onClick={() => setShowAccount((v) => !v)}
            >
              <div className="text-lg font-bold">
                {getUserInitials(user.email)}
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
            </button>
          ) : (
            <button
              className="bg-white text-[#00b4d8] hover:bg-gray-100 px-4 py-2 rounded text-sm font-semibold transition"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          )}
        </nav>
        {/* Enhanced Account Drawer */}
        {showAccount && user && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 animate-fadeIn"
              onClick={() => setShowAccount(false)}
            ></div>
            <div className="fixed top-0 right-0 w-96 h-full bg-gradient-to-b from-white to-gray-50 shadow-2xl z-50 animate-slideIn overflow-y-auto">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 p-6 text-white relative">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">My Account</h2>
                  <button
                    onClick={() => setShowAccount(false)}
                    className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Enhanced Avatar */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-300 to-red-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white animate-pulse">
                      {getUserInitials(user.email)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-3 border-white rounded-full animate-pulse"></div>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="font-semibold text-lg">{user.name || 'User'}</div>
                    <div className="text-sm opacity-90">{user.email}</div>
                    <div className="text-xs opacity-75 mt-1">Online</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group hover:shadow-md"
                      onClick={() => {
                        setShowAccount(false);
                        navigate('/mybookings');
                      }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-800">My Bookings</div>
                        <div className="text-sm text-gray-600">View your travel history</div>
                      </div>
                    </button>

                    <button
                      className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 group hover:shadow-md"
                      onClick={() => setShowPersonalInfo((v) => !v)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-800">Personal Information</div>
                        <div className="text-sm text-gray-600">Manage your profile</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Personal Information Section */}
                {showPersonalInfo && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 animate-fadeIn">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Account Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-purple-100">
                        <span className="font-medium text-gray-600">Email:</span>
                        <span className="text-gray-800">{user.email || '-'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-purple-100">
                        <span className="font-medium text-gray-600">Name:</span>
                        <span className="text-gray-800">{user.name || '-'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-purple-100">
                        <span className="font-medium text-gray-600">Phone:</span>
                        <span className="text-gray-800">{user.phone || '-'}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium text-gray-600">Password:</span>
                        <span className="text-gray-800">{user.password ? '••••••••' : '-'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Logout Button */}
                <button
                  className="w-full bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center"
                  onClick={() => {
                    localStorage.removeItem('user');
                    setShowAccount(false);
                    window.location.reload();
                  }}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
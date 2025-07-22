import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookSeat } from '../api/api';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { bus, selectedSeats, finalPrice, travelDate } = location.state || {};

  useEffect(() => {
    const createBooking = async () => {
      try {
        // Create booking through API
        await bookSeat({
          busId: bus._id,
          seats: selectedSeats,
          totalAmount: finalPrice,
          travelDate: travelDate
        });

        // Store booking in localStorage for immediate display
        const myBookings = JSON.parse(localStorage.getItem('myBookings')) || [];
        myBookings.push({
          id: Date.now(),
          bus: bus,
          seats: selectedSeats,
          amount: finalPrice,
          date: travelDate,
          status: 'Confirmed'
        });
        localStorage.setItem('myBookings', JSON.stringify(myBookings));
      } catch (err) {
        console.error('Error creating booking:', err);
        setError(err.response?.data?.message || 'Failed to create booking');
      }
    };

    if (bus && selectedSeats) {
      createBooking();
    }
  }, [bus, selectedSeats, finalPrice, travelDate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Booking Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Successful!</h2>
          <p className="text-gray-600 mb-8">
            Your booking has been confirmed. You can view your booking details in My Bookings.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/my-bookings')}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layouts/header';
import Home from './pages/home';
import SearchResults from './pages/SearchResults';
import SeatBooking from './pages/SeatBooking';
import Payment from './pages/Payment';
import Footer from './components/layouts/footer';
import MyBooking from './pages/MyBooking';
import Register from './pages/Register';
import Login from './pages/login';
import PaymentSuccess from './pages/PaymentSuccess'; // Import PaymentSuccess component
import Help from './pages/Help'; // Import Help component

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/seats" element={<SeatBooking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/mybookings" element={<MyBooking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
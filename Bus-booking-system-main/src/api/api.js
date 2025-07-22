import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Helper to get auth token from localStorage
function getToken() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// User Auth
export function registerUser(data) {
  return api.post('/auth/register', data);
}

export function loginUser(data) {
  return api.post('/auth/login', data);
}

// Bus Search & Details
export function searchBuses(data) {
  return api.post('/buses/search', data); // Changed to POST
}

export function getAllBuses() {
  return api.get('/buses');
}

export function getBusDetails(busId) {
  return api.get(`/buses/${busId}`);
}

// Booking
export function bookSeat(data) {
  return api.post('/bookings', data, { headers: authHeaders() });
}

export function getMyBookings() {
  return api.get('/bookings/my', { headers: authHeaders() });
}

export function cancelBooking(bookingId) {
  return api.delete(`/bookings/${bookingId}`, { headers: authHeaders() });
}

// Admin
export function addBus(data) {
  return api.post('/admin/buses', data, { headers: authHeaders() });
}

export function editBus(busId, data) {
  return api.put(`/admin/buses/${busId}`, data, { headers: authHeaders() });
}

export function deleteBus(busId) {
  return api.delete(`/admin/buses/${busId}`, { headers: authHeaders() });
}

export function getAllBookings() {
  return api.get('/admin/bookings', { headers: authHeaders() });
}

export default api;

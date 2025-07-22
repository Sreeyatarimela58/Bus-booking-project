import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// If using react-toastify, import it:
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    otp: "",
  });
  const [step, setStep] = useState('form'); // 'form' or 'otp'
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerifyOtp = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
      setError("Please fill all fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    setMessage("");
    setStep("otp"); // Show OTP input immediately
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ OTP sent to your email");
        toast.success("OTP sent to your email");
      } else {
        setError(data.message || "Failed to send OTP.");
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.otp) {
      setError("Please enter the OTP.");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);
    try {
      console.log('Sending registration request with:', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        otp: formData.otp,
      });
      
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          otp: formData.otp,
        }),
      });
      const data = await res.json();
      console.log('Backend registration response:', data);
      
      if (data.token && data.user) {
        // Auto-login successful - store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setMessage("🎉 Registration successful! You are now logged in.");
        setError("");
        toast.success("🎉 Registration successful! You are now logged in.");
        
        // Redirect to home page (logged in)
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else if (data.success) {
        // Traditional registration success (no auto-login)
        setMessage("🎉 Registered! You can now log in.");
        setError("");
        toast.success("🎉 Registered! You can now log in.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "OTP verification failed.");
        toast.error(data.message || "OTP verification failed.");
        setMessage("");
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError("Network error. Please try again.");
      toast.error("Network error. Please try again.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#363c3f]">
      <ToastContainer />
      <div className="flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'none' }}>
        {/* Left Section */}
        <div className="bg-[#f44336] flex flex-col justify-center items-center p-10 md:p-16 min-w-[320px]">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white flex items-center gap-2">
            Join Us <span className="text-2xl">🎉</span>
          </h2>
          <p className="text-white text-lg text-center">Create an account and start booking your trip today.</p>
        </div>
        {/* Right Section */}
        <div className="bg-white flex flex-col justify-center p-10 md:p-16 min-w-[350px]">
          <form onSubmit={e => e.preventDefault()} className="w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Create an Account</h2>
            <label className="block mb-2 font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={step === 'otp'}
              placeholder="John Doe"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f44336] bg-white"
              required
            />
            <label className="block mb-2 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={step === 'otp'}
              placeholder="you@example.com"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f44336] bg-white"
              required
            />
            <label className="block mb-2 font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={step === 'otp'}
              placeholder="10-digit mobile number"
              pattern="^\d{10}$"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f44336] bg-white"
              required
            />
            <label className="block mb-2 font-medium text-gray-700">Password</label>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={step === 'otp'}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f44336] bg-white pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{ background: 'none', border: 'none', padding: '4px' }}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {/* OTP/Confirm Password logic in the form: */}
            {step === 'form' ? (
              <>
                <label className="block mb-2 font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f44336] bg-white"
                  required
                />
                <button
                  type="button"
                  className="w-full bg-[#f44336] text-white py-2 rounded mb-2 font-semibold hover:bg-[#d32f2f] transition disabled:opacity-60"
                  disabled={loading}
                  onClick={handleVerifyOtp}
                >
                  Get OTP
                </button>
              </>
            ) : (
              <>
                {/* OTP input and Register button are only shown after successful OTP request */}
                <label className="block mb-2 font-medium text-gray-700">OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f44336] bg-white"
                  required
                />
                <button
                  type="button"
                  className="w-full bg-[#f44336] text-white py-2 rounded mb-2 font-semibold hover:bg-[#d32f2f] transition disabled:opacity-60"
                  disabled={loading || !formData.otp}
                  onClick={handleRegister}
                >
                  Register
                </button>
              </>
            )}
            {error && <div className="text-[#f44336] mb-4 text-center">{error}</div>}
            {message && (
              <div className={`text-center mb-2 ${message.startsWith('✅') || message.startsWith('🎉') ? 'text-green-600' : 'text-red-500'}`}>{message}</div>
            )}
            <div className="text-center mt-2 text-gray-700 text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#f44336] hover:text-[#d32f2f] font-medium transition"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

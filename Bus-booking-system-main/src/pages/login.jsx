import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load remembered credentials on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    const rememberMeStatus = localStorage.getItem('rememberMe') === 'true';
    
    if (rememberMeStatus && rememberedEmail) {
      setEmail(rememberedEmail);
      setPassword(rememberedPassword || '');
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log('Sending login request with:', { email, password });
      
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Backend login response:', data);

      if (data.token && data.user) {
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
          localStorage.setItem('rememberMe', 'false');
        }

        // Store user data with token in localStorage
        const userData = {
          ...data.user,
          token: data.token
        };
        localStorage.setItem("user", JSON.stringify(userData));
        
        setError("");
        
        // Show animated success popup
        setShowSuccessPopup(true);
        
        // Auto hide after 2 seconds and navigate
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate("/");
        }, 2000);
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#363c3f]">
      {/* Animated Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform animate-bounceIn max-w-sm mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Login Successful!</h3>
              <p className="text-gray-600 mb-4">🎉 Welcome back!</p>
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden" style={{background: 'none'}}>
        {/* Left Welcome Section */}
        <div className="bg-[#cfe1c0] flex flex-col justify-center items-center p-10 md:p-16 min-w-[320px]">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-700 flex items-center gap-2">
            Welcome Back <span className="text-2xl">👋</span>
          </h2>
          <p className="text-gray-600 text-lg text-center">Login to continue booking your journey.</p>
        </div>
        {/* Right Login Form Section */}
        <div className="bg-[#fafbe7] flex flex-col justify-center p-10 md:p-16 min-w-[350px]">
          <form onSubmit={handleLogin} className="w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Login to Your Account</h2>
            <label className="block mb-2 font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e57373] bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
            <label className="block mb-2 font-medium text-gray-700">Password</label>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e57373] bg-white pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
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
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-gray-600 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  className="mr-2 w-4 h-4 text-[#e57373] border-gray-300 rounded focus:ring-[#e57373] focus:ring-2"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                /> 
                Remember me
              </label>
              <span className="text-gray-600 text-sm cursor-pointer hover:underline" onClick={() => alert('Password reset feature coming soon!')}>Forgot Password?</span>
            </div>
            {error && <div className="text-[#e57373] mb-4 text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-[#e57373] text-white py-2 rounded mb-2 font-semibold hover:bg-[#d45d5d] transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <div className="text-center mt-2 text-gray-700 text-sm">
              Don&apos;t have an account?{' '}
              <span
                className="text-[#e57373] cursor-pointer hover:underline"
                onClick={() => navigate('/register')}
              >
                Register
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

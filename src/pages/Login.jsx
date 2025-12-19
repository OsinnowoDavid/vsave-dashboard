import React, { useState } from 'react';
import Vsave from "../assets/vsave.png";
import { Eye, EyeOff, LogIn, Shield, Mail, Lock } from 'lucide-react';
// import Link from "react-router-dom"
// import { useNavigate } from 'react-router-dom';
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
// const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle login logic here
    }, 1500);
    // navigate("/manageSavings")

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0  rounded-xl blur-sm"></div>
              <img 
                src={Vsave} 
                className="w-20 h-20 relative z-10 drop-shadow-lg" 
                alt="VSave Logo"
              />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                VSAVE
              </h1>
              <p className="text-emerald-200 text-sm font-medium">
                ADMIN DASHBOARD
              </p>
            </div>
          </div>
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-white text-sm font-medium">Secure Access Portal</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <LogIn className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Administrator Login</h2>
              <p className="text-emerald-200 text-sm">Enter your credentials to access the dashboard</p>
            </div>

            <form className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-emerald-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="admin@vsave.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-emerald-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-300 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 bg-white/5 border-white/20 rounded focus:ring-emerald-500 focus:ring-offset-slate-900"
                  />
                  <span className="ml-2 text-sm text-emerald-200">Remember me</span>
                </label>
                <a href="#" className="text-sm text-green-300 hover:text-green-200 transition-colors duration-200 font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
              onSubmit={handleSubmit}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-emerald-400 disabled:to-green-400 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Authenticating...</span>

                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    {/* <Link href="/manageSavings"> */}
                    <span>Sign In to Dashboard</span>
                    {/* </Link> */}

                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-black/20 border-t border-white/10 px-8 py-4">
            <p className="text-center text-emerald-300 text-xs">
             VSave Admin. Restricted access only.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-emerald-300/80 text-sm flex items-center justify-center space-x-1">
            <Shield className="w-4 h-4" />
            <span>Your credentials are encrypted and secure</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
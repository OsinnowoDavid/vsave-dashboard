import React, { useState } from 'react';
import Vsave from "../assets/vsave.png";
import { waitList } from "../api/waitList.jsx";

function WaitList() {
  // ✅ FIXED: State keys match the input names
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    interest: 'savings' // Set default value
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // ✅ FIXED: handleChange updates state correctly
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ FIXED: handleSubmit with proper error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Submitting:', formData);
      
      // Call the waitList API
      const data = await waitList(formData);
      console.log("WAIT-LIST RESPONSE:", data);
      
      // If successful, set submitted to true
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          interest: 'savings'
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ FIXED: Add Tailwind color definitions if not in config
  const colors = {
    'vsave-green': '#10B981',
    'vsave-dark': '#059669',
  };

  const features = [
    { icon: '💰', title: 'Smart Savings', desc: 'Automated daily savings solution' },
    { icon: '🏦', title: 'Quick Loans', desc: 'Instant loans with competitive rates' },
    { icon: '📱', title: 'Airtime & Data', desc: 'Buy airtime and data bundles instantly' },
    { icon: '🎫', title: 'Lottery Wallet', desc: 'Fund and manage your lottery sales' },
    { icon: '🛡️', title: 'Secure Banking', desc: 'Bank-level security for all transactions' },
    { icon: '⚡', title: 'Instant Transactions', desc: 'Fast and reliable payment processing' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
           
            <span className="text-2xl font-bold text-gray-900">VSave</span>
            <img className='w-20' src={Vsave} alt="VSave Logo" />
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <span className="text-gray-600 font-medium">Coming Soon</span>
            <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
              2026
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Revolutionize Your
              <span className="text-emerald-600"> Financial</span> Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              VSave empowers you to save smarter, borrow better, and manage all your financial needs in one secure platform.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="text-3xl font-bold text-emerald-600">10K+</div>
              <div className="text-gray-600">Early Signups</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="text-3xl font-bold text-emerald-600">24/7</div>
              <div className="text-gray-600">Service Available</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="text-3xl font-bold text-emerald-600">99.9%</div>
              <div className="text-gray-600">Uptime Guarantee</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="text-3xl font-bold text-emerald-600">₦0</div>
              <div className="text-gray-600">Account Fees</div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column - Features */}
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Everything You Need in One WaitList</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Waitlist Form */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Join the Waitlist</h2>
                  <p className="text-gray-600 mt-2">Get early access and exclusive benefits</p>
                </div>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">You're on the list!</h3>
                    <p className="text-gray-600 mt-2">We'll notify you when we launch</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ✅ FIXED: Full Name input - name matches state key */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* ✅ FIXED: Email input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="you@example.com"
                      />
                    </div>

                    {/* ✅ FIXED: Phone Number input - name matches state key */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="+234 800 000 0000"
                      />
                    </div>

                    {/* ✅ FIXED: Interest dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Interest
                      </label>
                      <select
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="savings">Savings & Investments</option>
                        <option value="loans">Quick Loans</option>
                        <option value="airtime">Airtime & Data</option>
                        <option value="lottery">Lottery Wallet</option>
                        <option value="all">All Features</option>
                      </select>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                        I agree to receive updates and promotional offers from VSave
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Join Waitlist'
                      )}
                    </button>
                  </form>
                )}

                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>By joining, you'll get:</p>
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 text-emerald-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Early Access
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 text-emerald-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Special Bonus
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 text-emerald-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Zero Fees
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className=" md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                
                <span className="text-2xl font-bold">VSave</span>
              </div>
              <p className="text-gray-400">Your all-in-one financial companion</p>
            </div>
{/*             
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-4">All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white">Contact</a>
              </div>
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default WaitList;
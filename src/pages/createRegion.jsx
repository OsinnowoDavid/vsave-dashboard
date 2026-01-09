import React, { useState } from 'react';
import Sidebar from '../component/SideBar';
import Header from '../component/NavBar';
import { createRegion } from '../api/admin';
import useAuthStore from '../store/useAuthStore';

function CreateRegion() {
    const {token} = useAuthStore()
  const [formData, setFormData] = useState({
    regionName: '',
    shortCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await createRegion(token,formData)


      setMessage({
        type: 'success',
        text: response.data.message || 'Region created successfully!'
      });

      // Reset form on success
      setFormData({
        regionName: '',
        shortCode: ''
      });

    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to create region. Please try again.'
      });
      console.error('Error creating region:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50  ">
      <div className="max-w-4xl ">
        <Header />
        
        <div className="mb-8">
          <div className="flex items-start ">
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Create New Region</h1>
                <p className="text-gray-600 mt-2">Add a new region to the system</p>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Region Name Field */}
                  <div>
                    <label htmlFor="regionName" className="block text-sm font-medium text-gray-700 mb-2">
                      Region Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="regionName"
                      name="regionName"
                      value={formData.regionName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Enter region name (e.g., Ondo)"
                      maxLength={100}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Full name of the region
                    </p>
                  </div>

                  {/* Short Code Field */}
                  <div>
                    <label htmlFor="shortCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Short Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="shortCode"
                      name="shortCode"
                      value={formData.shortCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all uppercase"
                      placeholder="Enter short code (e.g., OND)"
                    //   maxLength={10}
                    //   pattern="[A-Z0-9]{2,10}"
                      title="Please use uppercase letters and numbers only (2-10 characters)"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      2-10 character unique code (uppercase letters and numbers only)
                    </p>
                  </div>

                  {/* Message Display */}
                  {message.text && (
                    <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                      {message.text}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-all ${loading
                          ? 'bg-emerald-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg'
                        } text-white flex items-center justify-center min-w-[140px]`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        'Create Region'
                      )}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CreateRegion;
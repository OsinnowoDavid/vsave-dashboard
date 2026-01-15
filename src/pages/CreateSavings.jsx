import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../component/NavBar';
import Sidebar from '../component/SideBar';
import { createSavings } from '../api/savings';
import useAuthStore from '../store/useAuthStore';

const CreateSavingsPage = () => {
  const { token } = useAuthStore();
  
  // Initial state matching the provided payload
  const [formData, setFormData] = useState({
    subRegion: '68e755d6750af7a3d4fee758',
    savingsTitle: '5000N for 20 weeks savings circle',
    frequency: 'WEEKLY',
    savingsAmount: 5000,
    deductionPeriod: 'monday',
    duration: 20
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for subRegions
  const subRegions = [
    { id: '68e755d6750af7a3d4fee758', name: 'Lagos Mainland' },
    { id: '68e755d6750af7a3d4fee759', name: 'Abuja Central' },
    { id: '68e755d6750af7a3d4fee760', name: 'Port Harcourt Zone' },
    { id: '68e755d6750af7a3d4fee761', name: 'Kano Region' },
  ];

  // Frequency options
  const frequencyOptions = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
  ];

  // Deduction period options based on frequency
  const getDeductionPeriodOptions = () => {
    switch (formData.frequency) {
      case 'DAILY':
        return [
          { value: 'morning', label: 'Morning (8 AM)' },
          { value: 'afternoon', label: 'Afternoon (2 PM)' },
          { value: 'evening', label: 'Evening (8 PM)' },
        ];
      case 'WEEKLY':
        return [
          { value: 'monday', label: 'Monday' },
          { value: 'tuesday', label: 'Tuesday' },
          { value: 'wednesday', label: 'Wednesday' },
          { value: 'thursday', label: 'Thursday' },
          { value: 'friday', label: 'Friday' },
          { value: 'saturday', label: 'Saturday' },
          { value: 'sunday', label: 'Sunday' },
        ];
      case 'MONTHLY':
        return [
          { value: '1', label: '1st of the month' },
          { value: '15', label: '15th of the month' },
          { value: 'last', label: 'Last day of month' },
        ];
      default:
        return [];
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Calculate total savings
  const calculateTotalSavings = () => {
    const amount = formData.savingsAmount || 0;
    const duration = formData.duration || 0;
    return amount * duration;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subRegion) {
      newErrors.subRegion = 'Please select a sub-region';
    }
    
    if (!formData.savingsTitle.trim()) {
      newErrors.savingsTitle = 'Savings title is required';
    } else if (formData.savingsTitle.length < 5) {
      newErrors.savingsTitle = 'Title must be at least 5 characters';
    }
    
    if (!formData.frequency) {
      newErrors.frequency = 'Please select a frequency';
    }
    
    if (!formData.savingsAmount || formData.savingsAmount <= 0) {
      newErrors.savingsAmount = 'Savings amount must be greater than 0';
    }
    
    if (!formData.deductionPeriod) {
      newErrors.deductionPeriod = 'Please select a deduction period';
    }
    
    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // SECURITY CHECK: Validate token exists
    if (!token || token.trim() === '') {
      toast.error('Authentication required. Please log in.');
      // In a real app, you might want to redirect to login
      // navigate('/login');
      return;
    }
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Form Validation Failed!');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const loadingToast = toast.loading('Creating savings plan...');
      const response = await createSavings(formData); // Token is now handled internally by the API function
      
      toast.dismiss(loadingToast);
      
      if (response.success) {
        const successMessage = response.data?.message || response.message || 'Savings plan created successfully!';
        toast.success(successMessage);
        
        // Reset form after successful submission
        setFormData({
          subRegion: '68e755d6750af7a3d4fee758',
          savingsTitle: '',
          frequency: 'WEEKLY',
          savingsAmount: 0,
          deductionPeriod: 'monday',
          duration: 0
        });
        setErrors({});
      } else {
        const errorMessage = response.error?.message || response.message || 'Failed to create savings plan';
        toast.error(errorMessage);
      }
    } catch (error) {
      // Handle authentication errors specifically
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        // Clear invalid token and redirect (you'd need to implement this)
        // useAuthStore.getState().clearToken();
        // navigate('/login');
      } else {
        let errorMessage = 'Network error or unexpected issue. Please try again.';
        if (error.response?.data?.message) errorMessage = error.response.data.message;
        else if (error.message) errorMessage = error.message;
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial values
  const handleReset = () => {
    setFormData({
      subRegion: '68e755d6750af7a3d4fee758',
      savingsTitle: '5000N for 20 weeks savings circle',
      frequency: 'WEEKLY',
      savingsAmount: 5000,
      deductionPeriod: 'monday',
      duration: 20
    });
    setErrors({});
    toast.info('Form reset to default values!');
  };

  // Log form data to console (development only)
  const handleLogData = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Form data:', formData);
      toast.info('Form data logged to console!');
    } else {
      toast.info('Console logging is disabled in production.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header at the top of the page */}
      <Header />
      
      <div className="flex flex-col md:flex-row">
        {/* Sidebar on the left - Hidden on mobile, shown on tablet and up */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        {/* Mobile sidebar toggle could be added here if needed */}
        
        {/* Main content area */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 mt-16 md:mt-20 md:ml-0 ">
          <div className="max-w-6xl mx-auto">
            {/* Page header */}
            <div className="mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Create Savings Plan</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Set up a new savings circle for your community</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {/* Left Column - Form */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
                  {/* Form Header */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                      <div className="bg-white/20 p-2 sm:p-3 rounded-lg self-start sm:self-auto">
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Create New Savings Plan</h2>
                        <p className="text-emerald-100 mt-1 text-sm sm:text-base">Fill in the details below to create a savings circle</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 md:p-8">
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Sub-region Selection */}
                        <div className="md:col-span-2">
                          <label htmlFor="subRegion" className="block text-sm font-medium text-gray-700 mb-1">
                            Sub-region <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              id="subRegion"
                              name="subRegion"
                              value={formData.subRegion}
                              onChange={handleChange}
                              className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border ${errors.subRegion ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 appearance-none text-sm sm:text-base`}
                              aria-describedby={errors.subRegion ? "subRegion-error" : undefined}
                            >
                              <option value="">Select a sub-region</option>
                              {subRegions.map(region => (
                                <option key={region.id} value={region.id}>
                                  {region.name}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          {errors.subRegion && <p id="subRegion-error" className="mt-1 text-xs sm:text-sm text-red-600">{errors.subRegion}</p>}
                        </div>

                        {/* Savings Title */}
                        <div className="md:col-span-2">
                          <label htmlFor="savingsTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            Savings Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="savingsTitle"
                            name="savingsTitle"
                            value={formData.savingsTitle}
                            onChange={handleChange}
                            className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border ${errors.savingsTitle ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 text-sm sm:text-base`}
                            placeholder="Enter a descriptive title for your savings plan"
                            aria-describedby={errors.savingsTitle ? "savingsTitle-error" : undefined}
                          />
                          {errors.savingsTitle && <p id="savingsTitle-error" className="mt-1 text-xs sm:text-sm text-red-600">{errors.savingsTitle}</p>}
                        </div>

                        {/* Frequency */}
                        <div>
                          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                            Frequency <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              id="frequency"
                              name="frequency"
                              value={formData.frequency}
                              onChange={(e) => handleSelectChange('frequency', e.target.value)}
                              className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border ${errors.frequency ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 appearance-none text-sm sm:text-base`}
                              aria-describedby={errors.frequency ? "frequency-error" : undefined}
                            >
                              <option value="">Select frequency</option>
                              {frequencyOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          {errors.frequency && <p id="frequency-error" className="mt-1 text-xs sm:text-sm text-red-600">{errors.frequency}</p>}
                        </div>

                        {/* Savings Amount */}
                        <div>
                          <label htmlFor="savingsAmount" className="block text-sm font-medium text-gray-700 mb-1">
                            Savings Amount <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 text-sm sm:text-base">₦</span>
                            </div>
                            <input
                              type="number"
                              id="savingsAmount"
                              name="savingsAmount"
                              value={formData.savingsAmount}
                              onChange={handleChange}
                              min="0"
                              step="100"
                              className={`w-full pl-10 pr-3 py-2.5 sm:pl-10 sm:pr-4 sm:py-3 border ${errors.savingsAmount ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 text-sm sm:text-base`}
                              placeholder="0"
                              aria-describedby={errors.savingsAmount ? "savingsAmount-error" : undefined}
                            />
                          </div>
                          {errors.savingsAmount && <p id="savingsAmount-error" className="mt-1 text-xs sm:text-sm text-red-600">{errors.savingsAmount}</p>}
                        </div>

                        {/* Deduction Period */}
                        <div>
                          <label htmlFor="deductionPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                            Deduction Period <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              id="deductionPeriod"
                              name="deductionPeriod"
                              value={formData.deductionPeriod}
                              onChange={(e) => handleSelectChange('deductionPeriod', e.target.value)}
                              className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border ${errors.deductionPeriod ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 appearance-none text-sm sm:text-base`}
                              aria-describedby={errors.deductionPeriod ? "deductionPeriod-error" : undefined}
                            >
                              <option value="">Select deduction period</option>
                              {getDeductionPeriodOptions().map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          {errors.deductionPeriod && <p id="deductionPeriod-error" className="mt-1 text-xs sm:text-sm text-red-600">{errors.deductionPeriod}</p>}
                        </div>

                        {/* Duration */}
                        <div>
                          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                            Duration <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              id="duration"
                              name="duration"
                              value={formData.duration}
                              onChange={handleChange}
                              min="1"
                              max="365"
                              className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border ${errors.duration ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 text-sm sm:text-base`}
                              placeholder="Number of periods"
                              aria-describedby={errors.duration ? "duration-error" : undefined}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 text-xs sm:text-sm">
                                {formData.frequency === 'DAILY' ? 'days' : 
                                 formData.frequency === 'WEEKLY' ? 'weeks' : 
                                 formData.frequency === 'MONTHLY' ? 'months' : 'quarters'}
                              </span>
                            </div>
                          </div>
                          {errors.duration && <p id="duration-error" className="mt-1 text-xs sm:text-sm text-red-600">{errors.duration}</p>}
                        </div>
                      </div>

                      {/* Form actions */}
                      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 space-y-3 sm:space-y-0">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="px-4 py-2.5 sm:px-6 sm:py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200 w-full sm:w-auto text-sm sm:text-base"
                          aria-label="Reset form to default values"
                        >
                          Reset to Default
                        </button>
                        
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={handleLogData}
                            className="px-4 py-2.5 sm:px-6 sm:py-3 border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition duration-200 w-full sm:w-auto text-sm sm:text-base"
                            aria-label="Log form data to console (development only)"
                          >
                            Log Data
                          </button>
                          
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-5 py-2.5 sm:px-8 sm:py-3 font-medium rounded-lg transition duration-200 w-full sm:w-auto text-sm sm:text-base ${isSubmitting ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                            aria-label={isSubmitting ? "Creating savings plan..." : "Create savings plan"}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                              </span>
                            ) : 'Create Savings Plan'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Right Column - Summary & Preview */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden h-full">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-green-600 to-black p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Savings Summary</h2>
                    <p className="text-blue-100 mt-1 text-sm sm:text-base">Preview your savings plan</p>
                  </div>

                  <div className="p-4 sm:p-6">
                    {/* Summary Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                            <svg className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm text-gray-600">Total Savings</p>
                            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{formatCurrency(calculateTotalSavings())}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">Per Period:</span>
                          <span className="font-semibold text-sm sm:text-base">{formatCurrency(formData.savingsAmount)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">Frequency:</span>
                          <span className="font-semibold text-sm sm:text-base capitalize">{formData.frequency.toLowerCase()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">Duration:</span>
                          <span className="font-semibold text-sm sm:text-base">{formData.duration} {formData.frequency === 'DAILY' ? 'days' : formData.frequency === 'WEEKLY' ? 'weeks' : formData.frequency === 'MONTHLY' ? 'months' : 'quarters'}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">Deduction:</span>
                          <span className="font-semibold text-sm sm:text-base capitalize">
                            {getDeductionPeriodOptions().find(opt => opt.value === formData.deductionPeriod)?.label || formData.deductionPeriod}
                          </span>
                        </div>
                        
                        <div className="pt-3 sm:pt-4 border-t border-blue-100">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Estimated Completion:</span>
                            <span className="font-semibold text-xs sm:text-sm text-right">
                              {(() => {
                                const today = new Date();
                                let completionDate = new Date(today);
                                
                                if (formData.frequency === 'DAILY') {
                                  completionDate.setDate(today.getDate() + formData.duration);
                                } else if (formData.frequency === 'WEEKLY') {
                                  completionDate.setDate(today.getDate() + (formData.duration * 7));
                                } else if (formData.frequency === 'MONTHLY') {
                                  completionDate.setMonth(today.getMonth() + formData.duration);
                                } else {
                                  completionDate.setMonth(today.getMonth() + (formData.duration * 3));
                                }
                                
                                return completionDate.toLocaleDateString('en-NG', { 
                                  weekday: 'short', 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                });
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-amber-800">Important Information</h3>
                          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-amber-700">
                            <ul className="list-disc pl-4 sm:pl-5 space-y-1">
                              <li>Savings plans cannot be modified once created</li>
                              <li>Ensure all members agree to the terms</li>
                              <li>Defaulters may be charged penalties</li>
                              <li>Funds are released at the end of the cycle</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center">
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{formData.duration}</p>
                        <p className="text-xs sm:text-sm text-gray-600">Total Periods</p>
                      </div>
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center">
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                          {formatCurrency(formData.savingsAmount)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">Per Period</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-xl shadow">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">About Savings Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">How it Works</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Members contribute a fixed amount at regular intervals. The total pool is distributed to each member in rotation.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Key Features</h4>
                  <ul className="text-gray-600 text-xs sm:text-sm space-y-0.5 sm:space-y-1">
                    <li>• Fixed contribution amounts</li>
                    <li>• Regular deduction schedule</li>
                    <li>• Transparent tracking</li>
                    <li>• Automatic reminders</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Best Practices</h4>
                  <ul className="text-gray-600 text-xs sm:text-sm space-y-0.5 sm:space-y-1">
                    <li>• Choose a realistic amount</li>
                    <li>• Set a comfortable frequency</li>
                    <li>• Involve trusted members</li>
                    <li>• Communicate clearly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateSavingsPage;
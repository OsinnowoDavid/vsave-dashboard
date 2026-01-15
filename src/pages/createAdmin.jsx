import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Shield, 
  PlusCircle, 
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../component/NavBar';
import Sidebar from '../component/SideBar';
import { createAdmin } from '../api/admin';
import useAuthStore from '../store/useAuthStore';

// Move these components outside to prevent recreation on every render
const InputField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange,
  error, 
  icon: Icon, 
  required = false,
  disabled = false,
  showPassword = false,
  showConfirmPassword = false,
  onTogglePasswordVisibility,
  ...props 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full ${Icon ? 'pl-9 sm:pl-10' : 'pl-3 sm:pl-4'} pr-10 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all text-sm sm:text-base ${
          error
            ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
            : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-400'
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
        required={required}
        disabled={disabled}
        {...props}
      />
      {(name === 'password' || name === 'confirmPassword') && onTogglePasswordVisibility && (
        <button
          type="button"
          onClick={() => onTogglePasswordVisibility(name)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 disabled:opacity-50"
          disabled={disabled}
        >
          {(name === 'password' && !showPassword) || (name === 'confirmPassword' && !showConfirmPassword) 
            ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> 
            : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
          }
        </button>
      )}
    </div>
    {error && (
      <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);

const SelectField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  error, 
  required = false,
  disabled = false 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all text-sm sm:text-base ${
        error
          ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
          : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-400'
      } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
      required={required}
      disabled={disabled}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);

const CreateAdminForm = () => {
  const { token } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    // password: '',
    // confirmPassword: '',
    role: 'SUPER ADMIN',
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 11 digits';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Show validation error toast
      toast.error('Form Validation Failed!');
      return;
    }
    
    setIsSubmitting(true);
    
    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: formData.phoneNumber.trim(),
      role: formData.role,
      status: formData.status
    };
    
    try {
      console.log('Creating admin with payload:', payload);

      // Show loading toast
      const loadingToast = toast.loading('Creating admin account...');

      const response = await createAdmin(token, payload);
      
      console.log('create admin response:', response);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Check for success based on your API response structure
      if (response.data?.Status === 'success' || response.success) {
        // Show success toast with API message
        const successMessage = response.data?.message || 'Admin Account Created Successfully!';
        toast.success(successMessage);
        
        // Reset form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          confirmPassword: '',
          role: 'SUPER ADMIN',
          status: 'active'
        });
        
      } else {
        // Handle API error that doesn't throw an exception
        throw new Error(response.data?.message || response.error || 'Failed to create admin');
      }
      
    } catch (error) {
      console.error('Error creating admin:', error);
      
      let errorMessage = 'Failed to create admin. Please try again.';
      
      // Extract error message from different possible locations
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      // Show error toast
      toast.error(errorMessage);
      
      setErrors(prev => ({ 
        ...prev, 
        submit: errorMessage 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      role: 'SUPER ADMIN',
      status: 'active'
    });
    setErrors({});
    
    // Show info toast when form is cleared
    toast.info('Form cleared successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-3 sm:p-4 md:p-6">
      <Header />
      
      <div className="flex flex-col lg:flex-row mt-16 md:mt-20">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        {/* Main content area */}
        <main className="flex-1 ">
          <div className="max-w-4xl mx-auto px-2 sm:px-0">
            <div className="mb-4 sm:mb-6 md:mb-8">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Mobile Sidebar Toggle (optional) - You can add hamburger menu here */}
                {/* <button className="lg:hidden p-2">
                  <Menu className="w-6 h-6" />
                </button> */}
                
                <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg sm:rounded-xl shadow">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">Create New Admin</h1>
                  <p className="text-slate-600 mt-1 text-sm sm:text-base">Add a new administrator to the system</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
              <div className="border-b border-slate-200 p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Admin Information</h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">Fill in the details for the new administrator</p>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <InputField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    icon={User}
                    required
                    placeholder="Enter first name"
                    disabled={isSubmitting}
                  />

                  <InputField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    icon={User}
                    required
                    placeholder="Enter last name"
                    disabled={isSubmitting}
                  />

                  <div className="md:col-span-2">
                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      icon={Mail}
                      required
                      placeholder="Enter email address"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <InputField
                      label="Phone Number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      error={errors.phoneNumber}
                      icon={Phone}
                      required
                      placeholder="Enter 11-digit phone number"
                      disabled={isSubmitting}
                    />
                  </div>

                  <SelectField
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    options={[
                      { value: 'SUPER ADMIN', label: 'Super Administrator' },
                      { value: 'SUBREGIONAL ADMIN', label: 'Sub-Regional admin' },
                      { value: 'REGIONAL ADMIN', label: 'Regional admin' }
                    ]}
                    error={errors.role}
                    required
                    disabled={isSubmitting}
                  />

                  <SelectField
                    label="Account Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                      { value: 'pending', label: 'Pending Activation' }
                    ]}
                    error={errors.status}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium rounded-lg shadow transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm sm:text-base w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Admin...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Create Admin Account</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-6">
                <div className="flex items-start sm:items-center space-x-3">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-700">Administrator Permissions</p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      New admins will receive an email with login instructions and temporary credentials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateAdminForm;
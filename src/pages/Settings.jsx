import React, { useState, useEffect } from 'react'
import Header from '../component/NavBar'
import Sidebar from '../component/SideBar'
import { 
  User, 
  Mail, 
  Phone, 
  Shield,
  CheckCircle,
  XCircle,
  Save,
  Edit2,
  Loader2 
} from 'lucide-react'
import { getAdminProfile, updateAdminProfile } from '../api/admin'

function Settings() {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  })

  // Fetch profile data
  const getProfile = async () => {
    try {
      setProfileLoading(true)
      setErrorMessage('')
      
      const response = await getAdminProfile()
      
      // Check the response structure based on your API
      // Assuming response structure: { Status, message, data }
      if (response && response.data) {
        const userData = response.data
        setUser(userData)
        
        // Initialize form data with user data
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setErrorMessage(
        error.message || 
        error.response?.data?.message || 
        'Failed to load profile. Please try again.'
      )
    } finally {
      setProfileLoading(false)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      // Call update API
      const response = await updateAdminProfile(formData)
      
      if (response.Status === 'success') {
        // Update local state with new data
        setUser(prev => ({
          ...prev,
          ...formData
        }))
        
        setSuccessMessage(response.message || 'Profile updated successfully!')
        setIsEditing(false)
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('')
        }, 3000)
      } else {
        setErrorMessage(response.message || 'Failed to update profile.')
      }
      
    } catch (error) {
      console.error('Update error:', error)
      setErrorMessage(
        error.message || 
        error.response?.data?.message || 
        'Failed to update profile. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Handle resend verification email
  const handleResendVerification = async () => {
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')
    
    try {
      // TODO: Replace with actual API call
      // const response = await resendVerificationEmail();
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccessMessage('Verification email sent! Check your inbox.')
      
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
      
    } catch (error) {
      setErrorMessage('Failed to send verification email.')
    } finally {
      setLoading(false)
    }
  }

  // Reset form when canceling edit
  const handleCancelEdit = () => {
    // Reset form data to current user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      })
    }
    setIsEditing(false)
    setErrorMessage('')
  }

  // Show loading state
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Show error state
  if (errorMessage && !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="mb-8 mt-16">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <XCircle className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-red-700">Error Loading Profile</h3>
              </div>
              <p className="text-red-600 mb-4">{errorMessage}</p>
              <button
                onClick={getProfile}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 mt-16">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-green-700">{successMessage}</span>
            </div>
          )}
          
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-700">{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      disabled={loading}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      ) : (
                        <p className="px-4 py-2 bg-gray-50 rounded-lg">{user?.firstName || 'Not set'}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      ) : (
                        <p className="px-4 py-2 bg-gray-50 rounded-lg">{user?.lastName || 'Not set'}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                          disabled // Email is usually not editable
                        />
                      ) : (
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
                          <span>{user?.email || 'Not set'}</span>
                          {!user?.isEmailVerified && (
                            <button
                              onClick={handleResendVerification}
                              disabled={loading}
                              className="text-sm text-red-600 flex items-center hover:text-red-800 disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Not Verified
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      ) : (
                        <p className="px-4 py-2 bg-gray-50 rounded-lg">{user?.phoneNumber || 'Not set'}</p>
                      )}
                    </div>

                    {/* Role (Read-only) */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                        <Shield className="h-5 w-5 text-green-600 mr-3" />
                        <span className="font-medium">{user?.role || 'Not set'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Sidebar Info */}
           
          </div>
        </main>
      </div>
    </div>
  )
}

export default Settings
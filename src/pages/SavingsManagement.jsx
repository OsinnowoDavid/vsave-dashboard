import React, { useState, useEffect } from 'react'
import Header from '../component/NavBar'
import Sidebar from '../component/SideBar'
import { getUserSavings, adminSavingsData } from '../api/savings'

function SavingsManagement() {
  const [adminSavings, setAdminSavings] = useState([])
  const [userSavings, setUserSavings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('admin')

  // Fetch admin savings
  const fetchAdminSavings = async () => {
    try {
      setLoading(true)
      const response = await adminSavingsData()
      console.log('Admin API Response:', response) // Debug log
      
      // Check if response exists and has data array
      if (response && response.data && Array.isArray(response.data)) {
        setAdminSavings(response.data)
      } else if (Array.isArray(response)) {
        // If response itself is an array
        setAdminSavings(response)
      } else {
        console.error('Invalid admin savings data format:', response)
        setAdminSavings([])
      }
    } catch (error) {
      console.error('Error fetching admin savings:', error)
      setAdminSavings([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch user savings
  const fetchUserSavings = async () => {
    try {
      setLoading(true)
      const response = await getUserSavings()
      console.log('User API Response:', response) // Debug log
      
      // Check if response exists and has data array
      if (response && response.data && Array.isArray(response.data)) {
        setUserSavings(response.data)
      } else if (Array.isArray(response)) {
        // If response itself is an array
        setUserSavings(response)
      } else {
        console.error('Invalid user savings data format:', response)
        setUserSavings([])
      }
    } catch (error) {
      console.error('Error fetching user savings:', error)
      setUserSavings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminSavings()
  }, [])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'user' && userSavings.length === 0) {
      fetchUserSavings()
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0'
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (error) {
      console.error('Error formatting date:', dateString, error)
      return 'Invalid Date'
    }
  }

  // Get status badge color
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate progress percentage
  const calculateProgress = (savings) => {
    if (!savings || !savings.contributionDetails || !savings.savingsDetails) return 0
    
    const current = savings.contributionDetails.currentAmountSaved || 0
    const target = savings.savingsDetails.maturityAmount || 1 // Avoid division by zero
    
    if (target === 0) return 0
    return Math.min((current / target) * 100, 100)
  }

  // Stats calculations - SAFE VERSION
  const calculateStats = (savingsList) => {
    // Ensure savingsList is an array
    if (!Array.isArray(savingsList)) {
      console.error('calculateStats received non-array:', savingsList)
      return { totalSavings: 0, totalTarget: 0, activeSavings: 0 }
    }
    
    const totalSavings = savingsList.reduce(
      (sum, item) => {
        // Check if item exists and has the expected structure
        if (item && item.contributionDetails && typeof item.contributionDetails.currentAmountSaved === 'number') {
          return sum + item.contributionDetails.currentAmountSaved
        }
        return sum
      },
      0
    )
    
    const totalTarget = savingsList.reduce(
      (sum, item) => {
        // Check if item exists and has the expected structure
        if (item && item.savingsDetails && typeof item.savingsDetails.maturityAmount === 'number') {
          return sum + item.savingsDetails.maturityAmount
        }
        return sum
      },
      0
    )
    
    const activeSavings = savingsList.filter(
      item => item && item.savingsDetails && item.savingsDetails.status === 'ACTIVE'
    ).length

    return { totalSavings, totalTarget, activeSavings }
  }

  // Ensure currentSavings is always an array
  const currentSavings = Array.isArray(activeTab === 'admin' ? adminSavings : userSavings) 
    ? (activeTab === 'admin' ? adminSavings : userSavings) 
    : []

  const stats = calculateStats(currentSavings)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Sidebar />
        <div className="ml-64 pt-16 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="flex">
        <Sidebar />
      
      <main className=" flex-1 p-4 md:p-6 lg:p-8 mt-20">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Savings Management</h1>
          <p className="text-gray-600 mt-2">Monitor and manage your savings activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(stats.totalSavings)}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Target Amount</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(stats.totalTarget)}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Savings</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.activeSavings}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => handleTabChange('admin')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'admin'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Admin Savings
              </button>
              <button
                onClick={() => handleTabChange('user')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'user'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                User Savings
              </button>
            </nav>
          </div>

          {/* Savings List */}
          <div className="p-6">
            {!currentSavings || currentSavings.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-4 text-gray-500">No savings data available</p>
                <button
                  onClick={activeTab === 'admin' ? fetchAdminSavings : fetchUserSavings}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Retry Loading Data
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {currentSavings.map((item, index) => {
                  // Ensure item exists before accessing properties
                  if (!item) return null
                  
                  const savingsDetails = item.savingsDetails || {}
                  const contributionDetails = item.contributionDetails || {}
                  
                  return (
                    <div
                      key={`${savingsDetails._id || index}-${index}`}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-green-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                        
                            
                            {savingsDetails?.user?.firstName}
                            {savingsDetails?.user?.lastName || "Admin savings"}

                          </h3>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(savingsDetails.status)}`}>
                              {savingsDetails.status || 'UNKNOWN'}
                            </span>
                            <span className="text-sm text-gray-500">
                              Duration: {savingsDetails.duration || 0} days
                            </span>
                            <span className="text-sm text-gray-500">
                        Email: {savingsDetails?.user?.email || "Vsave"} 
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(savingsDetails.maturityAmount)}
                          </p>
                          <p className="text-sm text-gray-500">Target Amount</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Current: {formatCurrency(contributionDetails.currentAmountSaved)}</span>
                          <span>Progress: {calculateProgress(item).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${calculateProgress(item)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Start Date</p>
                          <p className="font-medium text-gray-900">
                            {formatDate(savingsDetails.startDate)}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-sm text-gray-500">End Date</p>
                          <p className="font-medium text-gray-900">
                            {formatDate(savingsDetails.endDate)}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Current Saved</p>
                          <p className="font-medium text-green-600">
                            {formatCurrency(contributionDetails.currentAmountSaved)}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Auto Restart</p>
                          <p className="font-medium text-gray-900">
                            {savingsDetails.autoRestartEnabled ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Total Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">All Savings</span>
                    <span className="text-sm font-bold text-green-600">
                      {((stats.totalSavings / (stats.totalTarget || 1)) * 100 || 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${(stats.totalSavings / (stats.totalTarget || 1)) * 100 || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Plans</span>
                  <span className="font-medium">{currentSavings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paused Plans</span>
                  <span className="font-medium">
                    {currentSavings.filter(item => item && item.savingsDetails && item.savingsDetails.status === 'PAUSED').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining Balance</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(stats.totalTarget - stats.totalSavings)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  )
}

export default SavingsManagement
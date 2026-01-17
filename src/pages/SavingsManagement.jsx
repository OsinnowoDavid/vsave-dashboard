import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from '../component/NavBar';
import Sidebar from '../component/SideBar';
import { getUserSavings, adminSavingsData } from '../api/savings';
import { 
  Search,
  Filter,
  Calendar,
  X,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Sub-components for better organization
const StatsCards = ({ stats, formatCurrency }) => (
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
          <p className="text-sm font-medium text-gray-600">Total Plans</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {stats.totalPlans}
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
          <p className="text-sm font-medium text-gray-600">Active Plans</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {stats.activePlans}
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
);

const FilterSection = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate,
  activeTab,
  handleClearFilters,
  filteredSavings,
  allSavings
}) => {
  // Function to format today's date as YYYY-MM-DD for max attribute
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to handle start date change
  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    setStartDate(selectedDate);
    
    // If end date is before start date, reset end date
    if (endDate && selectedDate > endDate) {
      setEndDate('');
    }
  };

  // Function to handle end date change
  const handleEndDateChange = (e) => {
    const selectedDate = e.target.value;
    setEndDate(selectedDate);
  };

  return (
    <div className="bg-white rounded-xl shadow-md mb-6 p-6">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'admin' ? 'admin' : 'user'} savings by title, frequency, or status...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-label="Search savings"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Start Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                max={getTodayDate()}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent [color-scheme:light]"
                aria-label="Filter by start date"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Select a start date</p>
          </div>

          {/* End Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                min={startDate}
                max={getTodayDate()}
                disabled={!startDate}
                className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent [color-scheme:light] ${!startDate ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                aria-label="Filter by end date"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {!startDate ? 'Select start date first' : 'Select an end date'}
            </p>
          </div>
        </div>

        {/* Filter Status and Clear Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            {(searchTerm || statusFilter !== 'all' || startDate || endDate) && (
              <button
                onClick={handleClearFilters}
                className="flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="Clear all filters"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </button>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {searchTerm || statusFilter !== 'all' || startDate || endDate ? (
              <div className="flex flex-col items-end">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs mb-1">
                  Filters Active
                </span>
                <span className="text-xs text-gray-500">
                  Showing {filteredSavings.length} of {allSavings.length} savings
                </span>
                {(startDate || endDate) && (
                  <span className="text-xs text-green-600 mt-1">
                    Date Range: {startDate || 'Any'} to {endDate || 'Any'}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-gray-500">No filters applied</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminSavingsCard = ({ 
  item, 
  index, 
  formatCurrency, 
  formatDate
}) => {
  if (!item) return null;
  
  return (
    <div
      key={`${item._id || index}-${index}`}
      className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-green-300 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {item.savingsTitle || "Untitled Savings Plan"}
          </h3>
          <div className="flex items-center space-x-4 mt-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {item.status || 'ACTIVE'}
            </span>
            <span className="text-sm text-gray-500">
              Duration: {item.duration || 0} {item.frequency === 'DAILY' ? 'days' : 'weeks'}
            </span>
            <span className="text-sm text-gray-500">
              Frequency: {item.frequency || 'DAILY'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(item.targetAmount || 0)}
          </p>
          <p className="text-sm text-gray-500">Target Amount</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg">
          <p className="text-sm text-gray-500">Created Date</p>
          <p className="font-medium text-gray-900">
            {formatDate(item.createdAt)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <p className="text-sm text-gray-500">Frequency</p>
          <p className="font-medium text-gray-900">
            {item.frequency || 'DAILY'}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <p className="text-sm text-gray-500">Current Members</p>
          <p className="font-medium text-green-600">
            {item.currentMembers || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <p className="text-sm text-gray-500">Max Members</p>
          <p className="font-medium text-gray-900">
            {item.maxMembers || 'Unlimited'}
          </p>
        </div>
      </div>

      {/* Additional Details */}
      {item.description && (
        <div className="mt-4 bg-white p-4 rounded-lg">
          <p className="text-sm text-gray-500">Description</p>
          <p className="font-medium text-gray-900 mt-1">
            {item.description}
          </p>
        </div>
      )}
    </div>
  );
};

const UserSavingsCard = ({ 
  item, 
  index, 
  formatCurrency, 
  formatDate, 
  getStatusColor, 
  calculateProgress
}) => {
  if (!item) return null;
  
  const savingsDetails = item.savingsDetails || {};
  const contributionDetails = item.contributionDetails || {};
  
  return (
    <div
      key={`${savingsDetails._id || index}-${index}`}
      className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-green-300 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {savingsDetails?.user?.firstName} {savingsDetails?.user?.lastName || "User"}
          </h3>
          <div className="flex items-center space-x-4 mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(savingsDetails.status)}`}>
              {savingsDetails.status || 'UNKNOWN'}
            </span>
            <span className="text-sm text-gray-500">
              Duration: {savingsDetails.duration || 0} days
            </span>
            <span className="text-sm text-gray-500">
              Email: {savingsDetails?.user?.email || "N/A"} 
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
  );
};

const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  onItemsPerPageChange,
  totalItems 
}) => (
  <div className="flex items-center justify-between mt-6">
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-700">
        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
      </span>
      <select
        value={itemsPerPage}
        onChange={onItemsPerPageChange}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        aria-label="Items per page"
      >
        <option value={10}>10 per page</option>
        <option value={25}>25 per page</option>
        <option value={50}>50 per page</option>
        <option value={100}>100 per page</option>
      </select>
    </div>
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>
      <span className="px-3 py-2 text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

function SavingsManagement() {
  const [adminSavings, setAdminSavings] = useState([]);
  const [userSavings, setUserSavings] = useState([]);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [loadingUser, setLoadingUser] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('admin');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Data validation function - UPDATED FOR ADMIN SAVINGS STRUCTURE
  const validateSavingsData = useCallback((data, type = 'admin') => {
    if (!data) return [];
    
    // Extract the array from the response
    let dataArray = [];
    
    if (Array.isArray(data)) {
      dataArray = data;
    } else if (data.data && Array.isArray(data.data)) {
      dataArray = data.data;
    } else if (data.data && Array.isArray(data.data.data)) {
      dataArray = data.data.data;
    } else {
      console.warn('Invalid data format:', data);
      return [];
    }
    
    if (type === 'admin') {
      // Admin savings are flat objects
      return dataArray.filter(item => 
        item && 
        typeof item === 'object' &&
        item._id // At least should have an ID
      );
    } else {
      // User savings might have nested structure
      return dataArray.filter(item => 
        item && 
        typeof item === 'object' &&
        (item.savingsDetails || item._id)
      );
    }
  }, []);

  // Fetch admin savings
  const fetchAdminSavings = async () => {
    try {
      setLoadingAdmin(true);
      setError(null);
      const response = await adminSavingsData();
      console.log('Admin savings response:', response);
      
      const validatedData = validateSavingsData(response, 'admin');
      setAdminSavings(validatedData);
      
      if (validatedData.length === 0) {
        console.warn('No valid admin savings data found');
      }
    } catch (error) {
      console.error('Error fetching admin savings:', error);
      setError('Failed to load admin savings data');
      setAdminSavings([]);
    } finally {
      setLoadingAdmin(false);
    }
  };

  // Fetch user savings
  const fetchUserSavings = async () => {
    try {
      setLoadingUser(true);
      setError(null);
      const response = await getUserSavings();
      console.log('User savings response:', response);
      
      const validatedData = validateSavingsData(response, 'user');
      setUserSavings(validatedData);
      
      if (validatedData.length === 0) {
        console.warn('No valid user savings data found');
      }
    } catch (error) {
      console.error('Error fetching user savings:', error);
      setError('Failed to load user savings data');
      setUserSavings([]);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchAdminSavings();
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
    if (tab === 'user' && userSavings.length === 0) {
      fetchUserSavings();
    }
  }, [userSavings.length]);

  const handleTabKeyPress = useCallback((e, tab) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTabChange(tab);
    }
  }, [handleTabChange]);

  // Format currency
  const formatCurrency = useCallback((amount) => {
    if (!amount && amount !== 0) return '₦0';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Format date
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  }, []);

  // Get status badge color
  const getStatusColor = useCallback((status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // Calculate progress percentage for user savings
  const calculateProgress = useCallback((savings) => {
    if (!savings || !savings.contributionDetails || !savings.savingsDetails) return 0;
    
    const current = savings.contributionDetails.currentAmountSaved || 0;
    const target = savings.savingsDetails.maturityAmount || 1;
    
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  }, []);

  // Stats calculations - UPDATED FOR DIFFERENT DATA STRUCTURES
  const calculateStats = useCallback((savingsList, type = 'admin') => {
    if (!Array.isArray(savingsList)) {
      console.error('calculateStats received non-array:', savingsList);
      return { 
        totalSavings: 0, 
        totalTarget: 0, 
        totalPlans: 0,
        activePlans: 0 
      };
    }
    
    if (type === 'admin') {
      // Admin savings stats
      const totalPlans = savingsList.length;
      
      const totalTarget = savingsList.reduce(
        (sum, item) => {
          if (item && typeof item.targetAmount === 'number') {
            return sum + item.targetAmount;
          }
          return sum;
        },
        0
      );
      
      const activePlans = savingsList.filter(
        item => item && (item.status === 'ACTIVE' || !item.status)
      ).length;

      return { 
        totalSavings: 0, // Admin savings don't have current amount
        totalTarget, 
        totalPlans,
        activePlans 
      };
    } else {
      // User savings stats
      const totalSavings = savingsList.reduce(
        (sum, item) => {
          if (item && item.contributionDetails && typeof item.contributionDetails.currentAmountSaved === 'number') {
            return sum + item.contributionDetails.currentAmountSaved;
          }
          return sum;
        },
        0
      );
      
      const totalTarget = savingsList.reduce(
        (sum, item) => {
          if (item && item.savingsDetails && typeof item.savingsDetails.maturityAmount === 'number') {
            return sum + item.savingsDetails.maturityAmount;
          }
          return sum;
        },
        0
      );
      
      const activePlans = savingsList.filter(
        item => item && item.savingsDetails && item.savingsDetails.status === 'ACTIVE'
      ).length;

      return { 
        totalSavings, 
        totalTarget, 
        totalPlans: savingsList.length,
        activePlans 
      };
    }
  }, []);

  // Function to check if a date is within the range
  const isDateInRange = useCallback((dateString, start, end) => {
    if (!dateString) return true;
    
    try {
      const date = new Date(dateString);
      const startDate = start ? new Date(start) : null;
      const endDate = end ? new Date(end) : null;
      
      if (startDate && endDate) {
        return date >= startDate && date <= endDate;
      } else if (startDate) {
        return date >= startDate;
      } else if (endDate) {
        return date <= endDate;
      }
      return true;
    } catch (error) {
      console.error('Error checking date range:', error);
      return true;
    }
  }, []);

  // Get current savings based on active tab
  const allSavings = useMemo(() => {
    const savings = activeTab === 'admin' ? adminSavings : userSavings;
    return Array.isArray(savings) ? savings : [];
  }, [activeTab, adminSavings, userSavings]);

  // Filter savings based on search term, status, and date range
  const filteredSavings = useMemo(() => {
    return allSavings.filter(item => {
      if (!item) return false;

      // Handle different data structures
      if (activeTab === 'admin') {
        // Admin savings filtering
        const matchesSearch = 
          !searchTerm || 
          (item.savingsTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (item.frequency?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (item.status?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || (item.status || 'ACTIVE') === statusFilter;
        
        // For admin savings, check created date
        const matchesDateRange = isDateInRange(item.createdAt, startDate, endDate);
        
        return matchesSearch && matchesStatus && matchesDateRange;
      } else {
        // User savings filtering
        const savingsDetails = item.savingsDetails || {};
        const contributionDetails = item.contributionDetails || {};
        
        const matchesSearch = 
          !searchTerm || 
          (savingsDetails.user?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (savingsDetails.user?.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (savingsDetails.user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (savingsDetails.status?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || savingsDetails.status === statusFilter;
        
        // For user savings, check start date
        const matchesDateRange = isDateInRange(savingsDetails.startDate, startDate, endDate);
        
        return matchesSearch && matchesStatus && matchesDateRange;
      }
    });
  }, [allSavings, searchTerm, statusFilter, startDate, endDate, isDateInRange, activeTab]);

  // Calculate paginated savings
  const paginatedSavings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSavings.slice(startIndex, endIndex);
  }, [filteredSavings, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredSavings.length / itemsPerPage);
  }, [filteredSavings.length, itemsPerPage]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    if (activeTab === 'admin') {
      fetchAdminSavings();
    } else {
      fetchUserSavings();
    }
    setCurrentPage(1);
  }, [activeTab]);

  const handleExportCSV = useCallback(() => {
    try {
      let headers, csvData;
      
      if (activeTab === 'admin') {
        headers = ['Title', 'Frequency', 'Duration', 'Target Amount', 'Status', 'Created Date', 'Current Members', 'Max Members'];
        csvData = filteredSavings.map(item => {
          return [
            `"${item.savingsTitle || ''}"`,
            `"${item.frequency || ''}"`,
            item.duration || 0,
            item.targetAmount || 0,
            `"${item.status || 'ACTIVE'}"`,
            `"${formatDate(item.createdAt)}"`,
            item.currentMembers || 0,
            item.maxMembers || 'Unlimited'
          ];
        });
      } else {
        headers = ['Name', 'Email', 'Status', 'Start Date', 'End Date', 'Current Amount', 'Target Amount', 'Progress (%)'];
        csvData = filteredSavings.map(item => {
          const savingsDetails = item.savingsDetails || {};
          const contributionDetails = item.contributionDetails || {};
          
          return [
            `"${savingsDetails.user?.firstName || ''} ${savingsDetails.user?.lastName || ''}"`,
            `"${savingsDetails.user?.email || ''}"`,
            `"${savingsDetails.status || ''}"`,
            `"${formatDate(savingsDetails.startDate)}"`,
            `"${formatDate(savingsDetails.endDate)}"`,
            contributionDetails.currentAmountSaved || 0,
            savingsDetails.maturityAmount || 0,
            calculateProgress(item).toFixed(1)
          ];
        });
      }
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeTab}_savings_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setError('Failed to export data');
    }
  }, [filteredSavings, activeTab, formatDate, calculateProgress]);

  const handleItemsPerPageChange = useCallback((e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);

  const stats = useMemo(() => calculateStats(filteredSavings, activeTab), [filteredSavings, activeTab, calculateStats]);

  const isLoading = activeTab === 'admin' ? loadingAdmin : loadingUser;

  if (isLoading) {
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="flex">
        <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 mt-20">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
                aria-label="Dismiss error"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Savings Management</h1>
            <p className="text-gray-600 mt-2">Monitor and manage your savings activities</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Export to CSV"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              aria-label="Refresh data"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} formatCurrency={formatCurrency} />

        {/* Filter Section */}
        <FilterSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          activeTab={activeTab}
          handleClearFilters={handleClearFilters}
          filteredSavings={filteredSavings}
          allSavings={allSavings}
        />

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => handleTabChange('admin')}
                onKeyPress={(e) => handleTabKeyPress(e, 'admin')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'admin'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                aria-label="View admin savings"
                aria-selected={activeTab === 'admin'}
              >
                Admin Savings Plans
              </button>
              <button
                onClick={() => handleTabChange('user')}
                onKeyPress={(e) => handleTabKeyPress(e, 'user')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'user'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                aria-label="View user savings"
                aria-selected={activeTab === 'user'}
              >
                User Savings
              </button>
            </nav>
          </div>

          {/* Savings List */}
          <div className="p-6">
            {!filteredSavings || filteredSavings.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-4 text-gray-500">No savings data found</p>
                <p className="text-sm text-gray-400 mt-2">
                  {searchTerm || statusFilter !== 'all' || startDate || endDate 
                    ? 'Try adjusting your filters' 
                    : 'No savings data available for this tab'}
                </p>
                {(searchTerm || statusFilter !== 'all' || startDate || endDate) && (
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {paginatedSavings.map((item, index) => (
                    activeTab === 'admin' ? (
                      <AdminSavingsCard
                        key={`${item?._id || index}-${index}`}
                        item={item}
                        index={index}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                      />
                    ) : (
                      <UserSavingsCard
                        key={`${item?.savingsDetails?._id || index}-${index}`}
                        item={item}
                        index={index}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                        getStatusColor={getStatusColor}
                        calculateProgress={calculateProgress}
                      />
                    )
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {filteredSavings.length > itemsPerPage && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    totalItems={filteredSavings.length}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                {activeTab === 'admin' ? 'Total Target Progress' : 'Total Progress'}
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {activeTab === 'admin' ? 'Total Target Amount' : 'Total Savings'}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {activeTab === 'admin' 
                        ? formatCurrency(stats.totalTarget)
                        : `${((stats.totalSavings / (stats.totalTarget || 1)) * 100 || 0).toFixed(1)}%`
                      }
                    </span>
                  </div>
                  {activeTab === 'user' && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${(stats.totalSavings / (stats.totalTarget || 1)) * 100 || 0}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Filtered Plans</span>
                  <span className="font-medium">{filteredSavings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {activeTab === 'admin' ? 'Inactive Plans' : 'Paused Plans'}
                  </span>
                  <span className="font-medium">
                    {activeTab === 'admin'
                      ? filteredSavings.filter(item => item && item.status === 'INACTIVE').length
                      : filteredSavings.filter(item => item && item.savingsDetails && item.savingsDetails.status === 'PAUSED').length
                    }
                  </span>
                </div>
                {activeTab === 'user' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining Balance</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(stats.totalTarget - stats.totalSavings)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

export default SavingsManagement;
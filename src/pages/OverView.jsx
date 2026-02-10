import React, { useState, useEffect, useMemo } from 'react';
import { Wallet, ArrowDownToLine, Smartphone, Receipt, TrendingUp, CreditCard, Search, ChevronDown, Eye, Loader2, AlertCircle, Users, Calendar, FileDown } from 'lucide-react';
import NavBar from "../component/NavBar";
import Sidebar from '../component/SideBar';
import { getData, GetUsers } from '../api/admin';
import { Mail, Phone, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';


const StatCard = ({ icon: Icon, iconBg, iconColor, label, value, details }) => (
  <article
    className="w-full bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md px-4 sm:px-5 py-4 sm:py-5 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    tabIndex="0"
    aria-label={`${label}: ${value}`}
  >
    <div className="flex items-start gap-3 sm:gap-4">
      {/* Icon Container */}
      <div
        className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: iconBg }}
        aria-hidden="true"
      >
        <Icon
          size={20}
          className="sm:w-6 sm:h-6"
          style={{ color: iconColor }}
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 leading-tight line-clamp-2">
          {label}
        </h3>
        <p className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight truncate">
          {value}
        </p>

        {/* Details */}
        {details?.length > 0 && (
          <div className="flex flex-col gap-1 mt-1">
            {details.map((detail, index) => (
              <div key={index} className="text-xs font-light text-gray-500 leading-tight">
                <span className="font-medium">{detail.label}</span> {detail.value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </article>
);

const OverView = () => {
  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [exporting, setExporting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch dashboard stats data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getData();
      console.log("dashboard", response)

      // Check for backend error response
      if (response && response.data && response.data.status === 'Failed') {
        throw new Error(response.data.message || 'Backend returned failed status');
      }

      if (response && response.data && response.data.data) {
        const apiStats = response.data.data;
        setApiData(apiStats);

        // Format the stats for display
        const formattedStats = [
          {
            id: 1,
            icon: Wallet,
            iconBg: 'rgba(93, 135, 239, 0.17)',
            iconColor: '#5D87EF',
            label: 'Total Wallet Funding',
            value: `₦${formatNumber(apiStats.totalWalletFund || 0)}`,
            details: []
          },
          {
            id: 2,
            icon: ArrowDownToLine,
            iconBg: 'rgba(93, 135, 239, 0.17)',
            iconColor: '#5D87EF',
            label: 'Total Withdrawal',
            value: `₦${formatNumber(apiStats.totalWithdrawal || 0)}`,
            details: []
          },
          {
            id: 3,
            icon: Smartphone,
            iconBg: 'rgba(93, 135, 239, 0.17)',
            iconColor: '#5D87EF',
            label: 'Airtime & Data Volume',
            value: `₦${formatNumber(apiStats.totalAirtimeAndData || 0)}`,
            details: []
          },
        ];

        setStats(formattedStats);
      } else {
        throw new Error('Invalid API response structure');
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');

      // Fallback to default stats if API fails
      const defaultStats = [
        {
          id: 1,
          icon: Wallet,
          iconBg: 'rgba(93, 135, 239, 0.17)',
          iconColor: '#5D87EF',
          label: 'Total Wallet Funding',
          value: '₦0',
          details: []
        },
        {
          id: 2,
          icon: ArrowDownToLine,
          iconBg: 'rgba(93, 135, 239, 0.17)',
          iconColor: '#5D87EF',
          label: 'Total Withdrawal',
          value: '₦0',
          details: []
        },
        {
          id: 3,
          icon: Smartphone,
          iconBg: 'rgba(93, 135, 239, 0.17)',
          iconColor: '#5D87EF',
          label: 'Airtime & Data Volume',
          value: '₦0',
          details: []
        },
      ];
      setStats(defaultStats);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await GetUsers();
      // console.log("user", response)

      // Check for backend error response
      if (response && response.status === 'Failed') {
        const errorMessage = response.message || 'Failed to load users';
        console.error('Backend reported error:', errorMessage);
        toast.error(errorMessage);
        setUsers([]);
        return;
      }

      // Check different possible response structures
      let usersData = [];

      if (response && response.data && Array.isArray(response.data)) {
        // If response has data property with array
        usersData = response.data;
      } else if (Array.isArray(response)) {
        // If response is already an array
        usersData = response;
      } else if (response && response.data && Array.isArray(response.data.data)) {
        // If response has data.data structure
        usersData = response.data.data;

      }

      // Transform API data to match our table structure
      const transformedUsers = usersData.map((user, index) => ({
        id: user._id || index + 1,
        userId: user._id ? user._id.substring(0, 8) + '...' : `USER${index + 1}`,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || 'No email',
        phoneNumber: user.phoneNumber || 'No phone',
        dateJoined: user.createdAt ? formatDate(user.createdAt) : 'N/A',
        status: 'active', // Default status - you might have this in your API
        balance: user.availableBalance || 0
      }));

      setUsers(transformedUsers);

    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.message || 'Failed to fetch users');
      // Don't set error state for users to not block the whole dashboard
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, []);

  // Helper function to format numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      return (
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber.includes(searchTerm) ||
        user.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }).reverse(); // Reverse to show latest first
  }, [users, searchTerm]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers for pagination controls
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // In the middle
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Export users to CSV
  const exportToCSV = (data, filename = 'users_export.csv') => {
    setExporting(true);

    try {
      // Prepare CSV headers
      const headers = ['ID', 'User ID', 'Full Name', 'Email', 'Phone Number', 'Date Joined', 'Balance'];

      // Prepare CSV rows
      const csvRows = [
        headers.join(','),
        ...data.map(user => [
          user.id,
          `"${user.userId}"`,
          `"${user.fullName}"`,
          `"${user.email}"`,
          `"${user.phoneNumber}"`,
          `"${user.dateJoined}"`,
          user.balance
        ].join(','))
      ];

      // Create CSV content
      const csvContent = csvRows.join('\n');

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Export filtered users
  const handleExportFiltered = () => {
    if (filteredUsers.length === 0) {
      alert('No users to export. Please check your search filters.');
      return;
    }
    exportToCSV(filteredUsers, `filtered_users_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Export all users
  const handleExportAll = () => {
    if (users.length === 0) {
      alert('No users to export.');
      return;
    }
    exportToCSV(users, `all_users_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Reset search and pagination
  const handleResetSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex pt-16">
          <div className="fixed left-0 top-5 h-[calc(100vh-4rem)] z-30">
            <Sidebar />
          </div>
          <main className="flex-1 ml-72 min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Main layout container */}
      <div className="flex pt-16">
        {/* Sidebar with fixed positioning */}
        <div className="fixed left-0 top-5 h-[calc(100vh-4rem)] z-30">
          <Sidebar />
        </div>

        {/* Main content area with left margin for sidebar */}
        <main className="flex-1 ml-72 min-h-screen">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 lg:pb-12">
            {/* Page Title */}
            <div className="mb-6 sm:mb-8 lg:mb-10 mt-10 ml-5">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Dashboard Overview
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Welcome to your admin dashboard
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 ml-5 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-red-700">{error}</span>
                <button
                  onClick={fetchData}
                  className="ml-auto text-sm text-red-600 hover:text-red-800"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Stats Grid */}
            <div className="flex flex-col gap-6 lg:gap-8 mb-8 lg:mb-12">
              {/* First Row - Financial Stats */}
              <section aria-labelledby="financial-stats">
                <h2 id="financial-stats" className="sr-only">Financial Statistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {stats.map((stat) => (
                    <StatCard key={stat.id} {...stat} />
                  ))}
                </div>
              </section>

              {/* Second Row - User Stats */}
              <section aria-labelledby="user-stats">
                <h2 id="user-stats" className="sr-only">User Statistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                  <StatCard
                    icon={Users}
                    iconBg="rgba(16, 185, 129, 0.17)"
                    iconColor="#10B981"
                    label="Total Users"
                    value={users.length}
                    details={[]}
                  />
                  {/* Additional stat cards can be added here */}
                </div>
              </section>
            </div>

            {/* Users Section */}
            <div className="mb-8 lg:mb-12">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h2>
                  <p className="text-gray-600 mt-2">Manage and monitor all user accounts</p>
                </div>
                <div className="text-sm text-gray-500">
                  {usersLoading ? 'Loading users...' : `${users.length} total users`}
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-xl shadow mb-6 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex-1 sm:max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search users by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1); // Reset to first page on search
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Reset Search Button */}
                    {searchTerm && (
                      <button
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                        onClick={handleResetSearch}
                      >
                        <span>Clear Search</span>
                      </button>
                    )}

                    {/* Export Buttons */}
                    <div className="relative group">
                      <button
                        className="border border-emerald-500 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleExportFiltered}
                        disabled={exporting || filteredUsers.length === 0}
                      >
                        {exporting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileDown className="w-4 h-4" />
                        )}
                        <span>Export Filtered ({filteredUsers.length})</span>
                      </button>
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        Export current search results
                      </div>
                    </div>

                    <div className="relative group">
                      <button
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleExportAll}
                        disabled={exporting || users.length === 0}
                      >
                        <FileDown className="w-4 h-4" />
                        <span>Export All</span>
                      </button>
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        Export all {users.length} users
                      </div>
                    </div>

                    <button
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                      onClick={() => {
                        fetchUsers();
                        setCurrentPage(1);
                      }}
                      disabled={usersLoading}
                    >
                      {usersLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      <span>Refresh Users</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-xl shadow overflow-hidden">
                {usersLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-8 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-500">
                      {searchTerm
                        ? 'No users match your search criteria'
                        : 'No user accounts have been created yet'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Full Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email Address
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Phone Number
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Balance
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {user.fullName.charAt(0)}
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.fullName}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 flex items-center">
                                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                  {user.email}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 flex items-center">
                                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                  {user.phoneNumber}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 flex items-center">
                                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                  {user.dateJoined}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div>
                                  ₦{formatNumber(user.balance)}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Table Footer with Pagination */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        {/* Items per page selector */}
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Show:</span>
                          <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                          <span className="text-sm text-gray-600">per page</span>
                        </div>

                        {/* Results info */}
                        <span className="text-sm text-gray-600">
                          Showing {startIndex + 1} to {endIndex} of {filteredUsers.length} users
                          {searchTerm && ' (filtered)'}
                        </span>

                        {/* Pagination Controls */}
                        <div className="flex items-center space-x-2">
                          {/* Previous Button */}
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          {/* Page Numbers */}
                          <div className="flex items-center space-x-1">
                            {getPageNumbers().map((page, index) => (
                              page === '...' ? (
                                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
                              ) : (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`px-3 py-1 rounded text-sm font-medium ${currentPage === page
                                    ? 'bg-emerald-500 text-white'
                                    : 'border text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                  {page}
                                </button>
                              )
                            ))}
                          </div>

                          {/* Next Button */}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Page Info */}
                      <div className="mt-4 text-center sm:text-left">
                        <span className="text-sm text-gray-700">
                          Page {currentPage} of {totalPages}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default OverView;
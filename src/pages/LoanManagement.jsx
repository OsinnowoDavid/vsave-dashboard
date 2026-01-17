import React, { useState, useEffect, useMemo } from 'react';
import Header from '../component/NavBar';
import Sidebar from '../component/SideBar';
import { getLoan } from '../api/loan';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Download,
  Eye,
  Filter,
  Search,
  RefreshCw,
  FileText,
  CreditCard,
  Percent,
  X
} from 'lucide-react';

function LoanManagement() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    completedLoans: 0,
    totalAmount: 0,
    totalInterest: 0,
    pendingAmount: 0
  });

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getLoan();
      console.log("API Response:", response);
      
      if (response?.data?.status === "Success" && response.data.data) {
        const loanData = response.data.data;
        setLoans(loanData);
        calculateStats(loanData);
      } else {
        setError(response?.data?.message || 'No loan data found');
      }
      
    } catch (err) {
      console.error("Error fetching loans:", err);
      setError(err.message || 'Failed to fetch loans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (loanData) => {
    const total = loanData.length;
    const active = loanData.filter(loan => loan.status === 'pending' || loan.status === 'active').length;
    const completed = loanData.filter(loan => loan.status === 'completed').length;
    const totalAmount = loanData.reduce((sum, loan) => sum + loan.amount, 0);
    const totalInterest = loanData.reduce((sum, loan) => sum + (loan.interest || 0), 0);
    const pendingAmount = loanData
      .filter(loan => loan.status === 'pending' || loan.status === 'active')
      .reduce((sum, loan) => sum + (loan.repaymentAmount || 0), 0);
    
    setStats({
      totalLoans: total,
      activeLoans: active,
      completedLoans: completed,
      totalAmount: totalAmount,
      totalInterest: totalInterest,
      pendingAmount: pendingAmount
    });
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // Helper function to parse date string to Date object
  const parseDate = (dateString) => {
    if (!dateString) return null;
    
    // Try to parse the date in various formats
    const date = new Date(dateString);
    
    // If the date is invalid, try parsing "Jan 17, 2026" format
    if (isNaN(date.getTime())) {
      // Try to parse month names
      const monthNames = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
      };
      
      const parts = dateString.toLowerCase().replace(',', '').split(' ');
      if (parts.length >= 3) {
        const month = monthNames[parts[0].substring(0, 3)];
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        
        if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
          return new Date(year, month, day);
        }
      }
    }
    
    return date;
  };

  const formatDate = (dateString) => {
    const date = parseDate(dateString);
    if (!date || isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = parseDate(dateString);
    if (!date || isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'pending':
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status || 'Unknown'}
          </span>
        );
    }
  };

  const getDaysRemaining = (dueDate) => {
    const date = parseDate(dueDate);
    if (!date || isNaN(date.getTime())) return 'N/A';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(date);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <span className="text-red-600">Overdue by {Math.abs(diffDays)} days</span>;
    } else if (diffDays === 0) {
      return <span className="text-yellow-600">Due today</span>;
    } else {
      return <span className="text-green-600">{diffDays} days remaining</span>;
    }
  };

  const getDaysRemainingText = (dueDate) => {
    const date = parseDate(dueDate);
    if (!date || isNaN(date.getTime())) return 'N/A';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(date);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} days`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else {
      return `${diffDays} days remaining`;
    }
  };

  // Function to normalize date for comparison
  const normalizeDate = (dateString) => {
    const date = parseDate(dateString);
    if (!date || isNaN(date.getTime())) return null;
    
    // Return date in YYYY-MM-DD format for easy comparison
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to check if a date is within the range
  const isDateInRange = (dateString, start, end) => {
    const normalizedDate = normalizeDate(dateString);
    if (!normalizedDate) return false;
    
    const startCondition = start ? normalizedDate >= start : true;
    const endCondition = end ? normalizedDate <= end : true;
    
    return startCondition && endCondition;
  };

  // Memoize filtered loans for performance
  const filteredLoans = useMemo(() => {
    return loans.filter(loan => {
      const matchesSearch = 
        (loan.loanTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (formatDate(loan.startDate?.toLowerCase()) || '').includes(searchTerm.toLowerCase()) ||
        (loan.dueDate?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (loan._id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (loan.user?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (loan.user?.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (loan.user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
      
      // Date range filtering - check if loan's startDate is within the selected range
      const matchesDateRange = isDateInRange(loan.startDate, startDate, endDate);
      
      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [loans, searchTerm, statusFilter, startDate, endDate]);

  const handleClearDateFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  // Function to format date input to YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    const date = parseDate(dateString);
    if (!date || isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // CSV Export Functionality
  const exportToCSV = (data, exportType = 'filtered') => {
    try {
      if (!data || data.length === 0) {
        setError('No loan data to export');
        return;
      }

      // Define CSV headers
      const headers = [
        'Loan ID',
        'Loan Title',
        'User Name',
        'Email',
        'Phone Number',
        'Principal Amount (₦)',
        'Interest Rate (%)',
        'Interest Amount (₦)',
        'Total Amount (₦)',
        'Status',
        'Start Date',
        'Due Date',
        'Days Status',
        'Repayments Count',
        'Repayment Amount (₦)',
        'Repayment Completed Date',
        'Created At',
        'Updated At',
        'Is Settled',
        'Remark'
      ];

      // Convert data to CSV rows
      const csvRows = data.map(loan => {
        const userFullName = `${loan.user?.firstName || ''} ${loan.user?.lastName || ''}`.trim();
        const totalAmount = loan.amount + (loan.interest || 0);
        const daysStatus = getDaysRemainingText(loan.dueDate);
        
        return [
          `"${loan._id || ''}"`,
          `"${loan.loanTitle || 'Untitled Loan'}"`,
          `"${userFullName || 'N/A'}"`,
          `"${loan.user?.email || 'N/A'}"`,
          `"${loan.user?.phoneNumber || 'N/A'}"`,
          loan.amount || 0,
          loan.interestPercentage || 0,
          loan.interest || 0,
          totalAmount,
          `"${loan.status || 'N/A'}"`,
          `"${formatDate(loan.startDate)}"`,
          `"${formatDate(loan.dueDate)}"`,
          `"${daysStatus}"`,
          loan.repayments?.length || 0,
          loan.repaymentAmount || 0,
          `"${formatDate(loan.repaymentCompletedDate)}"`,
          `"${formatDate(loan.createdAt)}"`,
          `"${formatDate(loan.updatedAt)}"`,
          loan.isSettled ? 'Yes' : 'No',
          `"${loan.remark || ''}"`
        ];
      });

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');

      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `${exportType}_loans_${timestamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw new Error('Failed to export data to CSV');
    }
  };

  // Handle export with options
  const handleExport = async () => {
    try {
      setExporting(true);
      
      // Ask user what to export
      const exportChoice = window.confirm(
        'What would you like to export?\n\n' +
        'Click "OK" to export filtered loans (current view)\n' +
        'Click "Cancel" to export all loans'
      );
      
      const dataToExport = exportChoice ? filteredLoans : loans;
      const exportType = exportChoice ? 'filtered' : 'all';
      
      if (dataToExport.length === 0) {
        setError(`No ${exportType} loan data to export`);
        return;
      }
      
      const success = exportToCSV(dataToExport, exportType);
      
      if (success) {
        // Show success message
        const successMessage = `Successfully exported ${dataToExport.length} ${exportType} loans to CSV`;
        console.log(successMessage);
        
        // You can show a toast notification here
        alert(successMessage);
      }
    } catch (error) {
      console.error('Export error:', error);
      setError(error.message || 'Failed to export loan data');
    } finally {
      setExporting(false);
    }
  };

  // Quick export function (exports current filtered view)
  const handleQuickExport = () => {
    if (filteredLoans.length === 0) {
      setError('No filtered loans to export');
      return;
    }
    
    try {
      const success = exportToCSV(filteredLoans, 'filtered');
      if (success) {
        console.log(`Exported ${filteredLoans.length} filtered loans to CSV`);
        alert(`Successfully exported ${filteredLoans.length} loans to CSV`);
      }
    } catch (error) {
      console.error('Quick export error:', error);
      setError('Failed to export filtered loans');
    }
  };

  const handleViewDetails = (loanId) => {
    console.log('View details for loan:', loanId);
    // You can implement modal or navigation here
    alert(`Viewing details for loan: ${loanId}`);
  };

  const handleRepay = (loan) => {
    console.log('Initiating repayment for loan:', loan._id);
    alert(`Initiating repayment for ${loan.loanTitle} - Amount: ${formatCurrency(loan.repaymentAmount || loan.amount)}`);
  };

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle date input changes
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 pt-16 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-green-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading loans...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && loans.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 pt-16 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchLoans}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 mt-20 pt-16 p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
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

          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Loan Management</h1>
                <p className="text-gray-600 mt-1">Manage and track all loan activities</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex items-center px-4 py-2 bg-white text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exporting ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {exporting ? 'Exporting...' : 'Export CSV'}
                </button>
                <button
                  onClick={fetchLoans}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Loans</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalLoans}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Loans</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stats.activeLoans}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pending Amount</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {formatCurrency(stats.pendingAmount)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Interest</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {formatCurrency(stats.totalInterest)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Percent className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow mb-6 p-6 border border-green-100">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search loans by title, ID, name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Section */}
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
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
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
                </div>
              </div>

              {/* Filter Status and Clear Button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  {(searchTerm || statusFilter !== 'all' || startDate || endDate) && (
                    <button
                      onClick={handleClearDateFilters}
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
                        Showing {filteredLoans.length} of {loans.length} loans
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

          {/* Loans Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden border border-green-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      Loan Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      Amount & Interest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      Timeline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      Repayments
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLoans.length > 0 ? (
                    filteredLoans.map((loan) => (
                      <tr key={loan._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                                loan.loanTitle?.toLowerCase().includes('school') 
                                  ? 'bg-blue-100' 
                                  : loan.loanTitle?.toLowerCase().includes('car')
                                  ? 'bg-purple-100'
                                  : 'bg-green-100'
                              }`}>
                                <DollarSign className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{loan.loanTitle || 'Untitled Loan'}</p>
                                <p className="text-sm text-gray-500">Name: {loan.user.firstName || 'N/A'} {loan.user.lastName || 'N/A'}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Created: {formatDate(loan.createdAt)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium text-gray-900">{loan.user.email || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Phone: {loan.user.phoneNumber || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div>
                              <p className="text-sm text-gray-500">Principal</p>
                              <p className="font-medium text-gray-900">{formatCurrency(loan.amount)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Interest ({loan.interestPercentage || 0}%)</p>
                              <p className="font-medium text-gray-900">{formatCurrency(loan.interest || 0)}</p>
                            </div>
                            <div className="pt-1 border-t border-gray-100">
                              <p className="text-sm text-gray-500">Total</p>
                              <p className="font-medium text-green-700">
                                {formatCurrency(loan.amount + (loan.interest || 0))}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {getStatusBadge(loan.status)}
                            {loan.isSettled && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Settled
                              </span>
                            )}
                            {loan.remark && (
                              <p className="text-xs text-gray-500 mt-1">{loan.remark}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-500">Start Date</p>
                              <p className="font-medium text-gray-900">{formatDate(loan.startDate)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Due Date</p>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                <span className={new Date(loan.dueDate) < new Date() && loan.status !== 'completed' 
                                  ? 'text-red-600 font-medium' 
                                  : 'text-gray-600'
                                }>
                                  {formatDate(loan.dueDate)}
                                </span>
                              </div>
                              <p className="text-xs mt-1">{getDaysRemaining(loan.dueDate)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-500">Repayments</p>
                              <p className="font-medium text-gray-900">
                                {loan.repayments?.length || 0} payment(s)
                              </p>
                            </div>
                            {loan.repaymentCompletedDate && (
                              <div>
                                <p className="text-sm text-gray-500">Completed On</p>
                                <p className="font-medium text-green-700">
                                  {formatDate(loan.repaymentCompletedDate)}
                                </p>
                              </div>
                            )}
                            {loan.repaymentAmount > 0 && (
                              <div>
                                <p className="text-sm text-gray-500">Due Amount</p>
                                <p className="font-medium text-red-600">
                                  {formatCurrency(loan.repaymentAmount)}
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg">No loans found</p>
                          <p className="text-sm mt-1">Try adjusting your search, filter, or date range</p>
                          <div className="mt-4 space-y-2">
                            {(searchTerm || statusFilter !== 'all' || startDate || endDate) && (
                              <button
                                onClick={handleClearDateFilters}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Clear Filters
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Summary Footer */}
            <div className="bg-green-50 px-6 py-4 border-t border-green-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="text-sm text-green-800 mb-2 md:mb-0">
                  Showing <span className="font-medium">{filteredLoans.length}</span> of{' '}
                  <span className="font-medium">{loans.length}</span> loans
                  {(startDate || endDate) && (
                    <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Date Filtered
                    </span>
                  )}
                </div>
                <div className="text-sm text-green-800">
                  Total filtered amount: <span className="font-medium">
                    {formatCurrency(
                      filteredLoans.reduce((sum, loan) => sum + loan.amount, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {loans.length > 0 && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Loan Analytics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Loan Portfolio</span>
                    <span className="font-medium text-green-700">{formatCurrency(stats.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Interest Rate</span>
                    <span className="font-medium text-green-700">
                      {loans.length > 0 
                        ? (loans.reduce((sum, loan) => sum + (loan.interestPercentage || 0), 0) / loans.length).toFixed(1) + '%'
                        : '0%'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-medium text-green-700">
                      {stats.totalLoans > 0 
                        ? Math.round((stats.completedLoans / stats.totalLoans) * 100) + '%'
                        : '0%'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-green-100 shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Updates</h3>
                  <button 
                    onClick={fetchLoans}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    <RefreshCw className="w-4 h-4 inline mr-1" />
                    Refresh
                  </button>
                </div>
                <div className="space-y-4">
                  {loans
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .slice(0, 3)
                    .map((loan) => (
                      <div key={loan._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{loan.loanTitle}</p>
                          <p className="text-xs text-gray-500">
                            Updated: {formatDateTime(loan.updatedAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800">{formatCurrency(loan.amount)}</p>
                          {getStatusBadge(loan.status)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoanManagement;
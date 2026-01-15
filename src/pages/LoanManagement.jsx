import React, { useState, useEffect } from 'react';
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
  Percent
} from 'lucide-react';

function LoanManagement() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
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
    if (!dueDate) return 'N/A';
    const today = new Date();
    const due = new Date(dueDate);
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

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      (loan.loanTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (loan._id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (loanId) => {
    console.log('View details for loan:', loanId);
    // Implement view details logic - could open a modal or navigate to details page
    alert(`Viewing details for loan: ${loanId}`);
  };

  const handleExport = () => {
    console.log('Exporting loan data...');
    // Implement export logic
    alert('Export functionality to be implemented');
  };

  const handleRepay = (loan) => {
    console.log('Initiating repayment for loan:', loan._id);
    // Implement repayment logic
    alert(`Initiating repayment for ${loan.loanTitle} - Amount: ${formatCurrency(loan.repaymentAmount || loan.amount)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1  pt-16 p-8">
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
          <div className="flex-1  pt-16 p-8">
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Loan Management</h1>
                <p className="text-gray-600 mt-1">Manage and track all loan activities</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleExport}
                  className="flex items-center px-4 py-2 bg-white text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
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
          <div className="bg-white rounded-xl shadow mb-6 p-4 border border-green-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search loans by title or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Filter className="w-5 h-5 text-gray-400 mr-2" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      Actions
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
                                <p className="text-sm text-gray-500">ID: {loan._id?.slice(-8) || 'N/A'}</p>
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
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => handleViewDetails(loan._id)}
                              className="flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </button>
                            {(loan.status === 'pending' || loan.status === 'active') && (
                              <button 
                                onClick={() => handleRepay(loan)}
                                className="flex items-center justify-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Make Payment
                              </button>
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
                          <p className="text-sm mt-1">Try adjusting your search or filter</p>
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
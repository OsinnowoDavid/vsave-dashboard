import React, { useState, useEffect } from 'react';
import { 
  Users, 
  User, 
  Mail, 
  Phone, 
  Target, 
  Clock,
  ChevronRight,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  CheckCircle,
  XCircle,
  Calendar,
  AlertCircle
} from 'lucide-react';
import Sidebar from '../component/SideBar';
import Header from '../component/NavBar';
import { GetWaitListDetails } from '../api/waitList';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function GetWaitList() {
  const [waitlistData, setWaitlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInterest, setFilterInterest] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      setLoading(true);
      const response = await GetWaitListDetails();
      console.log('API Response:', response);
      
      if (response.data?.data) {
        setWaitlistData(response.data.data);
        toast.success(response.data.message || 'Waitlist data loaded successfully');
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching waitlist:', error);
      setError('Failed to load waitlist data');
      toast.error('Failed to load waitlist data');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search functionality
  const filteredData = waitlistData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phoneNumber?.includes(searchTerm);
    
    const matchesInterest = filterInterest === 'all' || item.interest === filterInterest;
    
    return matchesSearch && matchesInterest;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(currentItems.map(item => item._id));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle individual selection
  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Get interest badge color
  const getInterestColor = (interest) => {
    switch (interest) {
      case 'savings':
        return 'bg-emerald-100 text-emerald-800';
      case 'loans':
        return 'bg-blue-100 text-blue-800';
      case 'all':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle export
  const handleExport = () => {
    // In a real app, this would generate and download CSV/Excel
    toast.info('Export feature coming soon!');
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      // In a real app, this would call delete API
      setWaitlistData(waitlistData.filter(item => item._id !== id));
      toast.success('Entry deleted successfully');
    }
  };

  // Get unique interests for filter
  const uniqueInterests = ['all', ...new Set(waitlistData.map(item => item.interest))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8 mt-20 ml-0 md:ml-64">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br w-80 from-gray-50 to-gray-100">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 mt-20 ml-0 md:ml">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Waitlist Management</h1>
                      <p className="text-gray-600 mt-1">Manage and monitor user waitlist entries</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* <button
                    onClick={handleExport}
                    className="px-4 py-2 border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition duration-200 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </button> */}
                  <button
                    onClick={getList}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition duration-200 flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Entries</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{waitlistData.length}</p>
                    </div>
                    <div className="p-3 bg-emerald-100 rounded-lg">
                      <Users className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Savings Interest</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {waitlistData.filter(item => item.interest === 'savings').length}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Loans Interest</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {waitlistData.filter(item => item.interest === 'loans').length}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">All Services</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {waitlistData.filter(item => item.interest === 'all').length}
                      </p>
                    </div>
                    <div className="p-3 bg-amber-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
                  />
                </div>
                
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={filterInterest}
                      onChange={(e) => setFilterInterest(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 appearance-none"
                    >
                      {uniqueInterests.map(interest => (
                        <option key={interest} value={interest}>
                          Interest: {interest.charAt(0).toUpperCase() + interest.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="20">20 per page</option>
                      <option value="50">50 per page</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {searchTerm && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-sm text-emerald-800">
                    Showing {filteredData.length} of {waitlistData.length} entries matching "{searchTerm}"
                  </p>
                </div>
              )}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-4 md:px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Waitlist Entries</h2>
                  <div className="text-emerald-100">
                    {filteredData.length} entries found
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                          className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Interest
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Date Added
                      </th>
                      {/* <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Actions
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 md:px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item._id)}
                              onChange={() => handleSelectItem(item._id)}
                              className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-emerald-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.fullName || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="text-sm text-gray-900 flex items-center">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              {item.email || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="text-sm text-gray-900 flex items-center">
                              <Phone className="h-4 w-4 text-gray-400 mr-2" />
                              {item.phoneNumber || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getInterestColor(item.interest)}`}>
                              {item.interest?.toUpperCase() || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 text-sm text-gray-500">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          {/* <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toast.info('View details coming soon!')}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => toast.info('Edit feature coming soon!')}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-4 md:px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No waitlist entries found</h3>
                            <p className="text-gray-500 mt-1">
                              {searchTerm || filterInterest !== 'all' 
                                ? 'Try adjusting your search or filter'
                                : 'No entries available in the waitlist'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredData.length > 0 && (
                <div className="px-4 md:px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredData.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredData.length}</span> results
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1.5 rounded-lg border ${
                          currentPage === 1
                            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = idx + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = idx + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + idx;
                        } else {
                          pageNumber = currentPage - 2 + idx;
                        }
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-1.5 rounded-lg border ${
                              currentPage === pageNumber
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1.5 rounded-lg border ${
                          currentPage === totalPages
                            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Items Actions */}
            {/* {selectedItems.length > 0 && (
              <div className="mt-6 bg-white rounded-xl shadow border border-emerald-200 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                      </p>
                      <p className="text-sm text-gray-600">
                        Apply actions to selected items
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        toast.info('Bulk edit feature coming soon!');
                      }}
                      className="px-4 py-2 border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition duration-200"
                    >
                      Edit Selected
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${selectedItems.length} selected items?`)) {
                          setWaitlistData(waitlistData.filter(item => !selectedItems.includes(item._id)));
                          setSelectedItems([]);
                          toast.success('Selected items deleted');
                        }
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200"
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              </div>
            )} */}

            {/* Quick Stats */}
            {/* <div className="mt-8 bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Waitlist Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Top Interests</h4>
                  <div className="space-y-2">
                    {['savings', 'loans', 'all'].map((interest) => {
                      const count = waitlistData.filter(item => item.interest === interest).length;
                      const percentage = waitlistData.length > 0 ? (count / waitlistData.length * 100).toFixed(1) : 0;
                      
                      return (
                        <div key={interest} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {interest.charAt(0).toUpperCase() + interest.slice(1)}
                          </span>
                          <div className="flex items-center space-x-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getInterestColor(interest).split(' ')[0]}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Recent Activity</h4>
                  <div className="space-y-3">
                    {waitlistData.slice(0, 3).map((item) => (
                      <div key={item._id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-emerald-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Joined for {item.interest}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Export Options</h4>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition duration-200 text-sm font-medium">
                      Export as CSV
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 text-sm font-medium">
                      Export as Excel
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 text-sm font-medium">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
}

// Add missing RefreshCw component
const RefreshCw = ({ className }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
    />
  </svg>
);

export default GetWaitList;
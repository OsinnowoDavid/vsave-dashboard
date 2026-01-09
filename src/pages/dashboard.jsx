import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownToLine, Smartphone, Receipt, TrendingUp, CreditCard, Search, ChevronDown, Eye, Loader2, AlertCircle } from 'lucide-react';
import NavBar from "../component/NavBar";
import Sidebar from '../component/SideBar';
import { getData } from '../api/admin';

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

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState(null);

  // Filter items data
  const filterItems = [
    { label: 'All', count: 2, active: false },
    { label: 'Active', count: 2, active: true },
    { label: 'Completed', count: 2, active: false },
    { label: 'Paused', count: 2, active: false },
    { label: 'Defaulted', count: 2, active: false }
  ];

  // Table data state
  const [tableData, setTableData] = useState([
    {
      id: 1,
      circleId: '1235q2353',
      user: 'David Ayodele',
      circleType: '30 days',
      dailyAmount: 'N100,000',
      totalSaved: 'N900,665,667,000',
      status: 'active'
    },
    {
      id: 2,
      circleId: '1235q2354',
      user: 'Sarah Johnson',
      circleType: '60 days',
      dailyAmount: 'N50,000',
      totalSaved: 'N450,332,833,500',
      status: 'completed'
    },
    {
      id: 3,
      circleId: '1235q2355',
      user: 'Michael Brown',
      circleType: '30 days',
      dailyAmount: 'N75,000',
      totalSaved: 'N675,499,250,250',
      status: 'paused'
    },
    {
      id: 4,
      circleId: '1235q2356',
      user: 'Emily Davis',
      circleType: '90 days',
      dailyAmount: 'N200,000',
      totalSaved: 'N1,800,000,000,000',
      status: 'active'
    },
    {
      id: 5,
      circleId: '1235q2357',
      user: 'James Wilson',
      circleType: '30 days',
      dailyAmount: 'N25,000',
      totalSaved: 'N225,166,416,750',
      status: 'defaulted'
    },
    {
      id: 6,
      circleId: '1235q2358',
      user: 'Lisa Anderson',
      circleType: '60 days',
      dailyAmount: 'N150,000',
      totalSaved: 'N1,350,998,500,500',
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getData();
      
      // Based on your API response structure
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
            details: [
              // { label: 'Online:', value: `₦${formatNumber(apiStats.onlineWalletFund || 0)}` },
              // { label: 'Offline:', value: `₦${formatNumber(apiStats.offlineWalletFund || 0)}` }
              // If API doesn't provide breakdown, we can show just the total
            ]
          },
          {
            id: 2,
            icon: ArrowDownToLine,
            iconBg: 'rgba(93, 135, 239, 0.17)',
            iconColor: '#5D87EF',
            label: 'Total Withdrawal',
            value: `₦${formatNumber(apiStats.totalWithdrawal || 0)}`,
            details: [
              // { label: 'Online:', value: `₦${formatNumber(apiStats.onlineWithdrawal || 0)}` },
              // { label: 'Offline:', value: `₦${formatNumber(apiStats.offlineWithdrawal || 0)}` }
            ]
          },
          {
            id: 3,
            icon: Smartphone,
            iconBg: 'rgba(93, 135, 239, 0.17)',
            iconColor: '#5D87EF',
            label: 'Airtime & Data Volume',
            value: `₦${formatNumber(apiStats.totalAirtimeAndData || 0)}`,
            details: [
              // { label: 'Airtime:', value: `₦${formatNumber(apiStats.airtimeVolume || 0)}` },
              // { label: 'Data:', value: `₦${formatNumber(apiStats.dataVolume || 0)}` }
            ]
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

  useEffect(() => {
    fetchData();
  }, []);

  // Helper function to format numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Filter logic for table
  const filteredData = tableData.filter(item => {
    const matchesSearch = item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.circleId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'All' || 
                         (activeFilter === 'Active' && item.status === 'active') ||
                         (activeFilter === 'Completed' && item.status === 'completed') ||
                         (activeFilter === 'Paused' && item.status === 'paused') ||
                         (activeFilter === 'Defaulted' && item.status === 'defaulted');
    
    return matchesSearch && matchesFilter;
  });

  // Handle view details
  const handleViewDetails = (item) => {
    console.log('Viewing details for:', item);
    alert(`Viewing details for ${item.user} (${item.circleId})`);
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
                Savings Dashboard 
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                
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
              {/* First Row */}
              <section aria-labelledby="financial-stats">
                <h2 id="financial-stats" className="sr-only">Financial Statistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {stats.map((stat) => (
                    <StatCard key={stat.id} {...stat} />
                  ))}
                </div>
              </section>

              {/* Additional Stats Row - You can add more stats here if needed */}
              {/* <section aria-labelledby="additional-stats">
                <h2 id="additional-stats" className="sr-only">Additional Statistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {[
                    {
                      id: 4,
                      icon: Receipt,
                      iconBg: 'rgba(16, 185, 129, 0.17)',
                      iconColor: '#10B981',
                      label: 'Total Transactions',
                      value: '1,234',
                      details: []
                    },
                    {
                      id: 5,
                      icon: TrendingUp,
                      iconBg: 'rgba(239, 68, 68, 0.17)',
                      iconColor: '#EF4444',
                      label: 'Active Users',
                      value: '567',
                      details: []
                    },
                    {
                      id: 6,
                      icon: CreditCard,
                      iconBg: 'rgba(245, 158, 11, 0.17)',
                      iconColor: '#F59E0B',
                      label: 'Total Revenue',
                      value: '₦8,456,789',
                      details: []
                    }
                  ].map((stat) => (
                    <StatCard key={stat.id} {...stat} />
                  ))}
                </div>
              </section> */}
            </div>

            {/* Filter and Search Section */}
            <div className="flex flex-col gap-6 w-full mb-8">
              {/* Filter Tabs */}
              <div className="flex flex-row items-center px-0 sm:px-8 gap-4 sm:gap-6 w-full h-14 border-y border-gray-200 overflow-x-auto">
                {filterItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFilter(item.label)}
                    className={`flex flex-row items-center gap-1 sm:gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                      activeFilter === item.label ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <span className={`text-sm sm:text-base font-normal leading-6 ${
                      activeFilter === item.label ? 'text-green-600 font-medium' : 'text-gray-400'
                    }`}>
                      {item.label}
                    </span>
                    <div className="relative w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                      <div className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-gray-50 rounded-full"></div>
                      <span className="relative text-[10px] sm:text-xs font-normal text-black leading-none">
                        {tableData.filter(dataItem => 
                          item.label === 'All' ? true : dataItem.status === item.label.toLowerCase()
                        ).length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center px-0 sm:px-8 gap-4 sm:gap-6 w-full">
                {/* Search Input */}
                <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-1 max-w-2xl">
                  <div className="flex flex-row items-center gap-3 px-3 w-full h-12 bg-gray-50 border border-gray-200 rounded-md">
                    <Search size={20} className="text-gray-600 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search by user or circle ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-full bg-transparent border-none outline-none text-sm sm:text-base text-gray-600 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
                  {/* First Filter Button */}
                  <button className="flex flex-row justify-center items-center px-5 py-3 w-full sm:w-40 h-12 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-normal text-gray-400 text-center">
                      Filter by
                    </span>
                    <ChevronDown size={16} className="text-gray-600 ml-2" />
                  </button>

                  {/* Second Filter Button */}
                  <button className="flex flex-row justify-center items-center px-5 py-3 w-full sm:w-40 h-12 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-normal text-gray-400 text-center">
                      Filter by
                    </span>
                    <ChevronDown size={16} className="text-gray-600 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Data Table Section */}
            <div className="flex flex-col gap-6 w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Table Header */}
              <div className="flex flex-row items-center gap-12 w-full h-8 border-b border-gray-200 pb-4 overflow-x-auto">
                <div className="w-24 min-w-24">
                  <span className="text-sm font-semibold text-black">Circle ID</span>
                </div>
                <div className="w-32 min-w-32">
                  <span className="text-sm font-semibold text-gray-900">User</span>
                </div>
                <div className="w-24 min-w-24">
                  <span className="text-sm font-semibold text-gray-900">Circle Type</span>
                </div>
                <div className="w-28 min-w-28">
                  <span className="text-sm font-semibold text-gray-900">Daily Amount</span>
                </div>
                <div className="w-32 min-w-32">
                  <span className="text-sm font-semibold text-gray-900">Total Saved</span>
                </div>
                <div className="w-24 min-w-24 text-right">
                  <span className="text-sm font-semibold text-gray-900">Action</span>
                </div>
              </div>

              {/* Table Body */}
              <div className="flex flex-col gap-4">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <div key={item.id} className="flex flex-row items-center gap-12 w-full h-6 py-4 border-b border-gray-100 last:border-b-0 overflow-x-auto">
                      <div className="w-24 min-w-24">
                        <span className="text-base font-normal text-gray-600">{item.circleId}</span>
                      </div>
                      <div className="w-32 min-w-32">
                        <span className="text-base font-normal text-gray-600">{item.user}</span>
                      </div>
                      <div className="w-24 min-w-24">
                        <span className="text-base font-normal text-gray-600">{item.circleType}</span>
                      </div>
                      <div className="w-28 min-w-28">
                        <span className="text-base font-normal text-gray-600">{item.dailyAmount}</span>
                      </div>
                      <div className="w-32 min-w-32">
                        <span className="text-base font-normal text-gray-600">{item.totalSaved}</span>
                      </div>
                      <div className="w-32 min-w-32 text-right">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="flex items-center justify-end gap-2 text-green-600 hover:text-green-700 transition-colors text-base font-normal"
                        >
                          <Eye size={16} />
                          View details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No records found matching your search criteria.
                  </div>
                )}
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  Showing {filteredData.length} of {tableData.length} records
                </span>
                {/* You can add pagination here if needed */}
              </div>
            </div>

            {/* Raw API Data Display (for debugging - optional) */}
            {/* {apiData && process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">API Data (Debug)</h3>
                <pre className="text-xs text-gray-600 overflow-auto">
                  {JSON.stringify(apiData, null, 2)}
                </pre>
              </div>
            )} */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
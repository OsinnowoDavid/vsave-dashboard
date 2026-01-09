import React, { useState, useEffect } from 'react';
import { 
  User, 
  PiggyBank, 
  Wallet, 
  Receipt, 
  BarChart3, 
  AlertTriangle, 
  FileText, 
  Building2, 
  Users, 
  Settings, 
  X,
  LogOut,
  ChevronRight,
  Shield,
  Home,
  Menu,
  Bell,
  HelpCircle,
  Moon,
  Sun,
  Clock,
  Calendar,
  
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const [activeItem, setActiveItem] = useState('savings');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  // console.log("USER", user)
  
  // State for real-time clock and date
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isAmPm, setIsAmPm] = useState(true);

  // Set active item based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('savings')) setActiveItem('savings');
    else if (path.includes('wallet')) setActiveItem('wallet');
    else if (path.includes('admin')) setActiveItem('account');
    // Add more routes as needed
  }, [location]);

  // Real-time clock and date effect
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format time
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      
      let timeString;
      if (isAmPm) {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        timeString = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
      } else {
        timeString = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
      }
      
      // Format date
      const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      const dateString = now.toLocaleDateString('en-US', options);
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };
    
    // Update immediately
    updateDateTime();
    
    // Update every second
    const intervalId = setInterval(updateDateTime, 1000);
    
    // Cleanup
    return () => clearInterval(intervalId);
  }, [isAmPm]);

  const toggleTimeFormat = () => {
    setIsAmPm(!isAmPm);
  };

  const navItems = [
    // { id: 'dashboard', icon: Home, title: 'Dashboard', subtitle: 'Overview', page: "/dashboard" },
    { id: 'savings', icon: Moon, title: 'Dashboard', subtitle: 'Overview ', page: "/over-view" },
    { id: 'savings', icon: PiggyBank, title: 'Savings Management', subtitle: 'Manage savings', page: "/manageSavings" },
    { id: 'wallet', icon: Wallet, title: 'Wallet Management', subtitle: 'Transactions & balance', page: "/WalletManagement" },
    { id: 'loan', icon: Receipt, title: 'Loan Management', subtitle: 'Loans & repayments', page: "/loans" },
    { id: 'analysis', icon: BarChart3, title: 'Wait list', subtitle: 'Insights & analytics', page: "/get-wait-list" },
    { id: 'branch', icon: Building2, title: 'Branch Management', subtitle: 'Manage branches', page: "/branches" },
    { id: 'account', icon: Users, title: 'Account Management', subtitle: 'User accounts', page: "/admin-details" },
    { id: 'settings', icon: Settings, title: 'Settings', subtitle: 'System settings', page: "/settings" },
  ];

  const handleItemClick = (id) => {
    setActiveItem(id);
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  const handleLogOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky left-0 top-0 h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black 
          border-r border-gray-800 flex flex-col z-50 lg:z-auto shadow-2xl shadow-black/30
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64 md:w-72'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header Section */}
        <div className="p-4 border-b border-gray-800">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">V-Save</h1>
                  <p className="text-xs text-gray-400">Admin Panel</p>
                </div>
              </div>
            )}
            
            {collapsed && (
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            )}

            {/* Collapse Toggle Button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`hidden lg:flex items-center justify-center w-8 h-8 rounded-lg 
                bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white 
                transition-all duration-200 ${collapsed ? 'rotate-180' : ''}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        {!collapsed && (
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white truncate">
                  {user?.user?.firstName || 'Admin'} {user?.user?.lastName || 'User'}
                </h3>
                <p className="text-xs text-gray-400 truncate">{user?.user?.role || 'Super Admin'}</p>
              </div>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Bell className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <Link
                  key={item.id}
                  to={item.page || '#'}
                  onClick={() => handleItemClick(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    flex items-center rounded-lg transition-all duration-200
                    ${collapsed ? 'justify-center px-2 py-3' : 'px-3 py-3 mx-2'}
                    ${isActive 
                      ? 'bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 border-l-4 border-emerald-500 shadow-lg shadow-emerald-900/20' 
                      : 'hover:bg-gray-800/50'
                    }
                  `}
                >
                  <div className="relative">
                    <Icon 
                      className={`
                        w-5 h-5 transition-colors duration-200
                        ${isActive ? 'text-emerald-400' : 'text-gray-400 group-hover:text-white'}
                      `}
                    />
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  
                  {!collapsed && (
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`
                          text-sm font-medium truncate transition-colors duration-200
                          ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                        `}>
                          {item.title}
                        </span>
                        {(isActive || hoveredItem === item.id) && (
                          <ChevronRight className="w-3 h-3 text-emerald-400" />
                        )}
                      </div>
                      <p className={`
                        text-xs truncate transition-colors duration-200
                        ${isActive ? 'text-emerald-300' : 'text-gray-500 group-hover:text-gray-300'}
                      `}>
                        {item.subtitle}
                      </p>
                    </div>
                  )}

                  {/* Tooltip for collapsed state */}
                  {collapsed && hoveredItem === item.id && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl border border-gray-700 z-50 min-w-max">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-gray-300">{item.subtitle}</div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Clock and Date Section - Only shown when not collapsed */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-gray-800">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-gray-400 font-medium">Live Time</span>
                </div>
                <button
                  onClick={toggleTimeFormat}
                  className="text-xs text-gray-500 hover:text-emerald-400 transition-colors px-2 py-1 rounded hover:bg-gray-800/50"
                  title={`Switch to ${isAmPm ? '24-hour' : '12-hour'} format`}
                >
                  {isAmPm ? '24H' : '12H'}
                </button>
              </div>
              
              <div className="text-center mb-3">
                <div className="text-2xl font-bold text-white font-mono tracking-wider">
                  {currentTime}
                </div>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-400">{currentDate}</span>
                </div>
              </div>
              
              {/* Timezone indicator */}
              <div className="text-center">
                <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-800/70 border border-gray-700">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-gray-400">GMT+1 • Nigeria</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed clock view */}
        {collapsed && (
          <div className="mt-auto p-2">
            <div className="relative group">
              <button
                onClick={toggleTimeFormat}
                className="w-full py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center hover:bg-gray-800 transition-colors"
                title="Click to toggle time format"
              >
                <Clock className="w-4 h-4 text-emerald-400" />
              </button>
              
              {/* Clock tooltip for collapsed state */}
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl border border-gray-700 z-50 min-w-max invisible group-hover:visible">
                <div className="font-medium mb-1">Current Time</div>
                <div className="text-emerald-300 font-mono">{currentTime}</div>
                <div className="text-xs text-gray-300 mt-1">{currentDate}</div>
                <div className="text-xs text-gray-500 mt-1">Click to toggle format</div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`
              flex items-center w-full rounded-lg transition-all duration-200
              ${collapsed ? 'justify-center px-2 py-3' : 'px-3 py-3 mx-2'}
              hover:bg-gray-800/50
            `}
          >
           
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleLogOut}
            className={`
              flex items-center w-full rounded-lg transition-all duration-200 mt-4
              ${collapsed ? 'justify-center px-2 py-3' : 'px-3 py-3 mx-2'}
              bg-gradient-to-r from-red-900/20 to-red-800/10 hover:from-red-800/30 hover:to-red-700/20
              border border-red-900/30 hover:border-red-700/50
            `}
          >
            <LogOut className="w-5 h-5 text-red-400" />
            {!collapsed && (
              <span className="ml-3 text-sm text-red-300 flex-1 text-left">Sign Out</span>
            )}
          </button>

          {!collapsed && (
            <div className="pt-4 px-3">
              <div className="text-xs text-gray-500 text-center">
                <p>  V-Save</p>
                <p className="mt-1">v1.0.0</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute -right-3 top-6 bg-gray-900 text-white p-2 rounded-full border border-gray-700 shadow-lg hover:bg-gray-800 transition-colors"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </aside>

      {/* Mobile Menu Toggle Button (for header) */}
      <button
        onClick={() => onClose && onClose(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
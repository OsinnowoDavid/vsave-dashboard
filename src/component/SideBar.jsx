import React, { useState } from 'react';
import { User, PiggyBank, Wallet, Receipt, BarChart3, AlertTriangle, FileText, Building2, Users, Settings, X } from 'lucide-react';
import { Link } from 'react-router-dom';
const Sidebar = ({ isOpen, onClose }) => {
  const [activeItem, setActiveItem] = useState('savings');

  const navItems = [
    { id: 'dashboard', icon: User, title: 'Dashboard', subtitle: 'Manage your account' ,page:"/dashboard" },
    { id: 'savings', icon: PiggyBank, title: 'Savings Management', subtitle: 'Manage your account', page:"/manageSavings" },
    { id: 'wallet', icon: Wallet, title: 'Wallet Management', subtitle: 'Manage your account',page:"/WalletManagement" },
    { id: 'loan', icon: Receipt, title: 'Loan Management', subtitle: 'Manage your account' },
    { id: 'analysis', icon: BarChart3, title: 'Analysis & Report', subtitle: 'Manage your account' },
    { id: 'risk', icon: AlertTriangle, title: 'Risk', subtitle: 'Manage your account' },
    { id: 'audit', icon: FileText, title: 'Audit Logs', subtitle: 'Manage your account' },
    { id: 'branch', icon: Building2, title: 'Branch Management', subtitle: 'Manage your account' },
    { id: 'account', icon: Users, title: 'Account Management', subtitle: 'Manage your account' },
    { id: 'settings', icon: Settings, title: 'Settings', subtitle: 'Manage your account' },
  ];

  const handleItemClick = (id) => {
    setActiveItem(id);
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:absolute mr-20 left-0 top-0 mt-16 bg-[#0A1A2F] flex flex-col z-50 lg:z-auto
          w-[280px] sm:w-[300px] lg:w-54
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute right-4 top-4 text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        {/* Navigation Items */}
        <div className="flex  flex-col items-center gap-2 pt-16 lg:pt-10 px-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <Link
              
                key={item.id}
                to={item.page}
                onClick={() => handleItemClick(item.id)}
                className={`w-full rounded px-4 py-2 flex items-start gap-2 transition-colors ${
                  isActive 
                    ? 'bg-white' 
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon 
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    isActive ? 'text-[#1B8A52]' : 'text-white'
                  }`}
                />
                <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                  <span className={`text-sm font-semibold leading-4 truncate w-full ${
                    isActive ? 'text-[#1B8A52]' : 'text-white'
                  }`}>
                    {item.title}
                  </span>
                  <span className={`text-[10px] leading-4 truncate w-full ${
                    isActive ? 'text-[#1B8A52]' : 'text-white'
                  }`}>
                    {item.subtitle}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Sign Out Footer */}
        <div className="h-[34px] bg-[#E4E7EC] flex items-center justify-center flex-shrink-0">
          <button className="text-sm text-white font-normal hover:text-gray-200 transition-colors">
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
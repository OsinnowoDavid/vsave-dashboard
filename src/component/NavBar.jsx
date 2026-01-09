import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Vsave from "../assets/vsave.png"
import { Link } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffff] shadow-[0px_1px_2px_rgba(0,0,0,0.3),0px_1px_3px_1px_rgba(0,0,0,0.15)]">
      <div className="mx-auto max-w-[1200px] h-[84px] px-4 sm:px-6 relative">
        {/* Logo */}
        <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-[70px] h-[46px] sm:w-[69px] sm:h-[56px]  rounded-lg flex items-center justify-center">
          <img className="text-white font-bold text-base sm:text-xl" src={Vsave}></img>
        </div>

        {/* Page Title */}
        <h1 className="absolute left-[80px] sm:left-[100px] md:left-[214px] top-1/2 -translate-y-1/2 md:top-[34px] md:translate-y-0 text-white text-lg sm:text-xl md:text-[28px] font-semibold leading-[125%] truncate max-w-[140px] sm:max-w-[200px] md:max-w-none">
          Savings Management
        </h1>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex absolute right-4 xl:right-0 top-1/2 bottom-1/2 translate-y-1 items-center gap-2">
          <Link  to={"/createSavings"} className="flex items-center justify-center px-3 xl:px-4 py-3 h-10 border-[1.5px] border-[#1B8A52] rounded-xl hover:bg-[#1B8A52]/10 transition-colors">
            <span className="text-sm font-semibold text-[#1B8A52] whitespace-nowrap">
              Create Savings
            </span>
          </Link >


          <Link to={"/create-admin"} className="flex items-center justify-center px-3 xl:px-4 py-3 h-10 border-[1.5px] border-[#1B8A52] rounded-xl hover:bg-[#1B8A52]/10 transition-colors">
            <span className="text-sm font-semibold text-[#1B8A52] whitespace-nowrap">
              Create admin

            </span>
          </Link>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A1A2F] border-t border-gray-700">
          <div className="px-4 py-4 space-y-2">
            <button className="w-full flex items-center justify-center px-4 py-3 h-10 border-[1.5px] border-[#1B8A52] rounded-xl hover:bg-[#1B8A52]/10 transition-colors">
              <span className="text-sm font-semibold text-[#1B8A52]">
                Create Savings
              </span>
            </button>

            <button className="w-full flex items-center justify-center px-4 py-3 h-10 border-[1.5px] border-[#1B8A52] rounded-xl hover:bg-[#1B8A52]/10 transition-colors">
              <span className="text-sm font-semibold text-[#1B8A52]">
                Manage Plans
              </span>
            </button>

            <button className="w-full flex items-center justify-center px-4 py-3 h-10 border-[1.5px] border-[#1B8A52] rounded-xl hover:bg-[#1B8A52]/10 transition-colors">
              <span className="text-sm font-semibold text-[#1B8A52]">
                Transaction History
              </span>
            </button>

            <button className="w-full flex items-center justify-center px-4 py-3 h-10 border-[1.5px] border-[#1B8A52] rounded-xl hover:bg-[#1B8A52]/10 transition-colors">
              <span className="text-sm font-semibold text-[#1B8A52]">
                Export Data
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
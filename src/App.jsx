import React, { useState } from 'react';
import Header from './components/layout/Header';
import DashboardHome from './components/sections/DashboardHome';

export default function MonetOrganizedDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#F7FBF7] flex flex-col font-sans text-[#191C1A] selection:bg-[#BCECE0] selection:text-[#00210E] overflow-hidden">

      {/* Top Navigation Bar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* --- Main Content Area --- */}
      <div className="flex-1 overflow-y-auto bg-[#F7FBF7] relative scroll-smooth no-scrollbar">
         <div className="max-w-7xl mx-auto p-6 md:p-8 pb-12 h-full">
            {activeTab === 'dashboard' && <DashboardHome />}

            {/* Placeholders for other tabs */}
            {activeTab === 'stats' && (
              <div className="flex items-center justify-center h-full text-[#404943] font-bold opacity-50">
                统计功能即将上线...
              </div>
            )}
            {activeTab === 'focus' && (
              <div className="flex items-center justify-center h-full text-[#404943] font-bold opacity-50">
                专注模式即将上线...
              </div>
            )}
         </div>
      </div>

    </div>
  );
}

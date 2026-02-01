import React from 'react';
import {
  Leaf,
  LayoutGrid,
  BarChart3,
  Zap,
  Sun,
  Bell,
  Settings
} from 'lucide-react';
import TabItem from '../common/TabItem';
import IconButton from '../common/IconButton';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="h-20 border-b border-[#727970]/5 bg-[#F7FBF7]/90 backdrop-blur-md z-20 shrink-0 sticky top-0 px-6 md:px-8 flex items-center justify-between">
       {/* Logo Section */}
       <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4C6656] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#4C6656]/20">
            <Leaf size={20} />
          </div>
          <div>
            <div className="font-bold text-lg text-[#191C1A] tracking-tight leading-none">Hiyori<span className="text-[#4C6656]">OS</span></div>
            <div className="text-[10px] text-[#404943] font-bold uppercase tracking-wider mt-0.5 opacity-60">纯净版</div>
          </div>
       </div>

       {/* Center Tabs (Desktop) */}
       <div className="hidden md:flex items-center bg-[#EFF5F1] p-1.5 rounded-full border border-[#E0E9E2]">
          <TabItem label="仪表盘" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutGrid size={16} />} />
          <TabItem label="统计" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<BarChart3 size={16} />} />
          <TabItem label="专注" active={activeTab === 'focus'} onClick={() => setActiveTab('focus')} icon={<Zap size={16} />} />
       </div>

       {/* User Profile */}
       <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#EFF5F1] rounded-full text-xs font-bold text-[#404943] border border-[#E0E9E2]">
            <Sun size={14} className="text-amber-500" />
            <span>欧尼酱</span>
          </div>
          <IconButton icon={<Bell size={20} />} active />
          <IconButton icon={<Settings size={20} />} />
       </div>
    </header>
  );
}

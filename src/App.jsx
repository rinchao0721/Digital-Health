import React, { useState } from 'react';
import {
  PieChart,
  BarChart2,
  Smartphone,
  Moon,
  Hourglass,
  MoreVertical,
  Monitor,
  Gamepad2,
  Globe,
  MessageSquare,
  LayoutGrid,
  Settings,
  X,
  Minus,
  Square,
  ChevronRight,
  User
} from 'lucide-react';

// --- 数据源 (保持不变，模拟你的生活习惯) ---
const DASHBOARD_DATA = {
  totalTime: "6小时19分钟",
  unlocks: 5,
  notifications: 83,
  segments: [
    { name: "哔哩哔哩", color: "#3B82F6", percent: 35, icon: <Gamepad2 size={18} /> }, // Blue
    { name: "Moonlight", color: "#EF4444", percent: 20, icon: <Monitor size={18} /> }, // Red
    { name: "百度贴吧", color: "#EAB308", percent: 15, icon: <MessageSquare size={18} /> }, // Yellow
    { name: "Chrome", color: "#A855F7", percent: 10, icon: <Globe size={18} /> }, // Purple
    { name: "其他", color: "#10B981", percent: 20, icon: <MoreVertical size={18} /> }, // Green
  ]
};

const WEEKLY_DATA = [
  { day: "周一", hours: 4.5, active: false },
  { day: "周二", hours: 3.8, active: false },
  { day: "周三", hours: 5.2, active: false },
  { day: "周四", hours: 5.5, active: false },
  { day: "周五", hours: 8.0, active: false },
  { day: "周六", hours: 6.3, active: true },
  { day: "周日", hours: 0, active: false },
];

const APP_USAGE_LIST = [
  { name: "哔哩哔哩 (UWP)", time: "2小时6分钟", icon: "B", color: "bg-pink-400", limitSet: true },
  { name: "Moonlight Game Streaming", time: "1小时11分钟", icon: "M", color: "bg-gray-700", limitSet: true },
  { name: "百度贴吧", time: "1小时10分钟", icon: "贴", color: "bg-blue-500", limitSet: true },
  { name: "Google Chrome", time: "32分钟", icon: "C", color: "bg-yellow-500", limitSet: false },
  { name: "Visual Studio Code", time: "15分钟", icon: "V", color: "bg-blue-600", limitSet: false },
];

export default function PCDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'details', 'limits'

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-8 font-sans text-gray-800 selection:bg-blue-100">

      {/* PC Window Container */}
      <div className="w-full max-w-5xl h-[700px] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden ring-1 ring-black/5 animate-in zoom-in-95 duration-300">

        {/* Title Bar (Windows Style) */}
        <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-4 select-none drag-region">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BarChart2 size={16} className="text-blue-500"/>
            <span className="font-medium">数字健康与家长控制 (PC版)</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600"><Minus size={16} /></button>
            <button className="text-gray-400 hover:text-gray-600"><Square size={14} /></button>
            <button className="text-gray-400 hover:bg-red-500 hover:text-white rounded px-1 transition-colors"><X size={16} /></button>
          </div>
        </div>

        {/* Main Content Area: Split Layout */}
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar Navigation */}
          <div className="w-64 bg-gray-50/50 border-r border-gray-200 flex flex-col p-4 space-y-2">

            <div className="mb-6 px-2">
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">我的活动</div>
               <NavItem
                 active={activeTab === 'overview'}
                 onClick={() => setActiveTab('overview')}
                 icon={<LayoutGrid size={18} />}
                 label="仪表盘概览"
               />
               <NavItem
                 active={activeTab === 'details'}
                 onClick={() => setActiveTab('details')}
                 icon={<BarChart2 size={18} />}
                 label="详细统计"
               />
            </div>

            <div className="mb-6 px-2">
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">工具</div>
               <NavItem active={false} icon={<Hourglass size={18} />} label="应用定时器" />
               <NavItem active={false} icon={<Moon size={18} />} label="睡眠模式" />
               <NavItem active={false} icon={<Smartphone size={18} />} label="专注模式" />
            </div>

            <div className="mt-auto px-2">
              <NavItem active={false} icon={<Settings size={18} />} label="设置" />
            </div>
          </div>

          {/* Right Content Panel */}
          <div className="flex-1 overflow-y-auto bg-white p-8">
            {activeTab === 'overview' ? <OverviewPanel onChangeTab={setActiveTab} /> : <DetailsPanel />}
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Navigation Item Component ---
function NavItem({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-blue-50 text-blue-600 shadow-sm'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// --- Content: Overview Panel ---
function OverviewPanel({ onChangeTab }) {
  // Construct conic gradient
  let gradientString = "";
  let currentAngle = 0;
  DASHBOARD_DATA.segments.forEach((seg) => {
    const endAngle = currentAngle + (seg.percent * 3.6);
    gradientString += `${seg.color} ${currentAngle}deg ${endAngle}deg, `;
    currentAngle = endAngle;
  });
  gradientString = gradientString.slice(0, -2);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

      <div className="flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">今天概览</h2>
          <p className="text-gray-500 text-sm mt-1">欧尼酱，今天你又对着电脑坐了很久呢...</p>
        </div>
        <div className="text-right">
           <div className="text-3xl font-bold text-gray-800 tabular-nums">6<span className="text-lg font-normal text-gray-500">小时</span> 19<span className="text-lg font-normal text-gray-500">分钟</span></div>
           <div className="text-sm text-green-500 font-medium flex items-center justify-end gap-1">
             ↓ 12% 相比昨日
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">

        {/* Left: The Chart */}
        <div className="col-span-5 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group cursor-pointer" onClick={() => onChangeTab('details')}>
          <div
            className="w-56 h-56 rounded-full relative transition-transform duration-500 group-hover:scale-105 shadow-xl shadow-blue-900/5"
            style={{ background: `conic-gradient(${gradientString})` }}
          >
            <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
               <span className="text-gray-400 text-xs uppercase tracking-wide">Screen Time</span>
               <div className="text-2xl font-bold text-gray-800 mt-1">6h 19m</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
             {DASHBOARD_DATA.segments.slice(0, 3).map((seg, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
                   <div className="w-2 h-2 rounded-full" style={{backgroundColor: seg.color}}></div>
                   {seg.name}
                </div>
             ))}
          </div>
        </div>

        {/* Right: Stats & Cards */}
        <div className="col-span-7 grid grid-cols-2 gap-4 content-start">

           {/* Stat Cards */}
           <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex flex-col justify-between h-32 hover:bg-blue-100 transition-colors cursor-default">
              <div className="flex justify-between items-start text-blue-600">
                 <Monitor size={20} />
                 <span className="text-xs font-semibold bg-white/60 px-2 py-0.5 rounded text-blue-800">PC端</span>
              </div>
              <div>
                 <div className="text-2xl font-bold text-gray-800">{DASHBOARD_DATA.unlocks}</div>
                 <div className="text-sm text-gray-600">次唤醒设备</div>
              </div>
           </div>

           <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 flex flex-col justify-between h-32 hover:bg-purple-100 transition-colors cursor-default">
              <div className="flex justify-between items-start text-purple-600">
                 <MessageSquare size={20} />
              </div>
              <div>
                 <div className="text-2xl font-bold text-gray-800">{DASHBOARD_DATA.notifications}</div>
                 <div className="text-sm text-gray-600">条系统通知</div>
              </div>
           </div>

           {/* Top Apps List (Mini) */}
           <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">最常用的应用</h3>
                <button onClick={() => onChangeTab('details')} className="text-xs text-blue-600 hover:underline">查看全部</button>
              </div>
              <div className="space-y-3">
                 {APP_USAGE_LIST.slice(0, 3).map((app, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-full ${app.color} flex items-center justify-center text-white text-xs font-bold`}>{app.icon}</div>
                       <div className="flex-1">
                          <div className="flex justify-between text-sm">
                             <span className="text-gray-800">{app.name}</span>
                             <span className="text-gray-500">{app.time}</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                             <div className="h-full bg-blue-500 rounded-full" style={{ width: idx === 0 ? '60%' : idx === 1 ? '30%' : '20%' }}></div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

// --- Content: Details Panel ---
function DetailsPanel() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">

       <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <span>仪表盘</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">活动详情</span>
       </div>

       {/* Weekly Chart */}
       <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-medium text-gray-700">过去一周</h3>
             <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-medium bg-gray-100 rounded hover:bg-gray-200 text-gray-600">日视图</button>
                <button className="px-3 py-1 text-xs font-medium bg-black text-white rounded">周视图</button>
             </div>
          </div>

          <div className="h-48 w-full flex items-end justify-between gap-4 px-4 relative">
             {/* Horizontal Grid Lines */}
             <div className="absolute inset-0 left-4 right-4 flex flex-col justify-between pointer-events-none">
                {[...Array(4)].map((_, i) => (
                   <div key={i} className="border-t border-dashed border-gray-100 w-full h-0"></div>
                ))}\
             </div>

             {WEEKLY_DATA.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-3 z-10 group">
                   <div
                      className={`w-full max-w-[40px] rounded-md transition-all duration-500 relative ${item.active ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-gray-100 hover:bg-gray-200'}`}
                      style={{ height: `${(item.hours / 10) * 100}%` }}
                   >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                         {item.hours}h
                      </div>
                   </div>
                   <span className={`text-xs ${item.active ? 'font-bold text-blue-600' : 'text-gray-400'}`}>{item.day}</span>
                </div>
             ))}
          </div>
       </div>

       {/* Full App List Table */}
       <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
             <h3 className="font-medium text-gray-700 text-sm">应用列表</h3>
             <button className="text-xs text-blue-600 font-medium hover:bg-blue-50 px-2 py-1 rounded">导出报告</button>
          </div>

          <div className="overflow-y-auto flex-1 p-2">
             <table className="w-full text-left border-collapse">
                <thead className="text-xs text-gray-400 font-medium uppercase tracking-wider sticky top-0 bg-white">
                   <tr>
                      <th className="px-4 py-3 font-medium">应用名称</th>
                      <th className="px-4 py-3 font-medium">分类</th>
                      <th className="px-4 py-3 font-medium">使用时长</th>
                      <th className="px-4 py-3 font-medium text-right">限制</th>
                   </tr>
                </thead>
                <tbody className="text-sm">
                   {APP_USAGE_LIST.map((app, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                         <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                               <div className={`w-8 h-8 rounded-lg ${app.color} flex items-center justify-center text-white text-xs shadow-sm`}>{app.icon}</div>
                               <span className="font-medium text-gray-700">{app.name}</span>
                            </div>
                         </td>
                         <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">效率/娱乐</span>
                         </td>
                         <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                               <span className="tabular-nums text-gray-600 w-16">{app.time}</span>
                               <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500" style={{ width: idx === 0 ? '80%' : '30%' }}></div>
                               </div>
                            </div>
                         </td>
                         <td className="px-4 py-3 text-right">
                            <button className={`p-1.5 rounded-md transition-colors ${app.limitSet ? 'bg-blue-50 text-blue-600' : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500'}`}>
                               <Hourglass size={16} />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>

    </div>
  );
}

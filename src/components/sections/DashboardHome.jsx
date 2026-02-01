import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Unlock,
  Bell,
  Sparkles,
  Bot,
  Calendar as CalendarIcon,
  Coffee,
  Moon,
  Loader2,
  RefreshCw
} from 'lucide-react';
import MetricCard from '../widgets/MetricCard';
import AiChatWidget from '../widgets/AiChatWidget';
import { fetchDashboardData, refreshStats } from '../../services/tauriApi';

export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatKey, setChatKey] = useState(0);
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    loadData();
    // Set up a refresh interval
    const interval = setInterval(loadData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      // First refresh backend stats
      await refreshStats();
      // Then fetch updated data
      const response = await fetchDashboardData();
      setData(response);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-[#4C6656]" />
      </div>
    );
  }

  const { dashboard, apps } = data;
  const mostUsedApp = apps?.[0];

  // Calendar Logic
  const today = new Date();
  const currentMonth = calendarDate.getMonth();
  const currentYear = calendarDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const prevMonth = () => {
    setCalendarDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const isToday = (day) => {
    return day === today.getDate() &&
           currentMonth === today.getMonth() &&
           currentYear === today.getFullYear();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">

      <div className="flex-[2] flex flex-col gap-6 min-w-0">

          <div className="bg-[#EFF5F1] rounded-[28px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-[#E0E9E2] min-h-[240px] sm:h-[280px] group transition-all duration-300 hover:shadow-md hover:border-[#D1DED6]">
             {/* Decorative Background Elements */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E0E9E2]/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#BCECE0]/20 to-transparent rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl pointer-events-none"></div>

             <div className="relative z-10 flex justify-between items-start">
                <div>
                   <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-[#BCECE0] text-[#00210E] text-[10px] font-bold rounded-full uppercase tracking-wide shadow-sm shadow-[#BCECE0]/30">今日</span>
                      <span className="text-xs text-[#404943] font-medium flex items-center gap-1.5 bg-white/60 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/50">
                         <TrendingUp size={12} className="text-green-600"/> 比昨天更好
                      </span>
                   </div>
                   <div className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#191C1A] tracking-tighter mb-2 font-numeric drop-shadow-sm">
                      {dashboard.totalTime}
                   </div>
                   <div className="text-[#404943] text-sm font-medium flex items-baseline gap-1">
                      主要用于
                      {mostUsedApp ? (
                          <span
                            className="font-bold text-[#191C1A] border-b-2 px-0.5 transition-colors cursor-default"
                            style={{
                                borderColor: mostUsedApp.color,
                                backgroundColor: `${mostUsedApp.color}10` // Very subtle background
                            }}
                          >
                            {mostUsedApp.name}
                          </span>
                      ) : (
                          <span className="font-bold text-[#404943] opacity-50">暂无数据</span>
                      )}
                   </div>
                </div>

                <div className="hidden sm:flex items-end gap-1.5 h-24 p-4 bg-white/40 rounded-2xl border border-white/60 backdrop-blur-sm shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                   {dashboard.trend.map((val, i) => (
                      <div key={i} className="w-2.5 bg-[#4C6656]/20 rounded-t-sm hover:bg-[#4C6656] transition-all duration-300 hover:scale-y-110 origin-bottom" style={{height: `${val * 10}%`}}></div>
                   ))}
                </div>
             </div>

             <div className="relative z-10 w-full mt-auto pt-4">
                <div className="flex justify-end text-[10px] text-[#404943] mb-2 font-bold tracking-wider uppercase opacity-70">
                   <span>每日限额: 8h</span>
                </div>
                <div className="h-3.5 w-full bg-[#E0E9E2] rounded-full overflow-hidden flex shadow-inner p-0.5 box-border gap-0.5">
                   {dashboard.segments.map((seg, i) => (
                      <div key={i} style={{width: `${seg.percent}%`, backgroundColor: seg.color}} className="h-full rounded-full transition-all duration-500 hover:brightness-110 relative group/seg" title={`${seg.name}: ${seg.percent}%`}>
                        <div className="absolute inset-0 bg-white/0 group-hover/seg:bg-white/10 transition-colors"></div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-h-[100px] shrink-0">
              <MetricCard icon={<Unlock size={20} />} value={dashboard.unlocks} label="解锁次数" bg="bg-blue-50" color="text-blue-600" />
              <MetricCard icon={<Bell size={20} />} value={dashboard.notifications} label="通知" bg="bg-amber-50" color="text-amber-600" />
              <MetricCard icon={<Sparkles size={20} />} value={dashboard.score} label="健康分" bg="bg-emerald-50" color="text-emerald-600" />
          </div>

          <div className="bg-white rounded-[28px] p-6 border border-[#E0E9E2] shadow-sm flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#191C1A] text-lg">常用应用</h3>
                <button className="text-xs font-bold text-[#404943] bg-[#F0F2F5] px-3 py-1.5 rounded-lg hover:bg-[#E0E9E2] transition-colors">查看全部</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 no-scrollbar">
                {apps.map((app, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-[#F7FBF7] rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-[#E0E9E2]">
                      <div className="flex items-center gap-4">
                        <div
                           className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden transition-colors"
                           style={{
                              backgroundColor: `${app.color}20`,
                              color: app.color
                           }}
                        >
                            {app.icon?.startsWith('data:image') ? (
                               <img src={app.icon} alt={app.name} className="w-full h-full object-contain p-1.5" />
                            ) : (
                               app.icon
                            )}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-[#191C1A]">{app.name}</div>
                            <div className="text-[10px] text-[#404943] font-medium uppercase tracking-wide opacity-70">{app.cat}</div>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-bold text-[#191C1A] tabular-nums">{app.time}</div>
                         <div className="w-20 h-1 bg-[#F0F2F5] rounded-full mt-1.5 overflow-hidden ml-auto">
                            <div
                               className="h-full rounded-full"
                               style={{
                                  width: `${80 - (i*10)}%`,
                                  backgroundColor: app.color
                               }}
                            ></div>
                         </div>
                      </div>
                  </div>
                ))}
            </div>
          </div>
      </div>

      <div className="flex-1 flex flex-col gap-6 min-w-[320px]">

          <div className="bg-[#BCECE0] rounded-[28px] flex flex-col relative overflow-hidden shadow-sm border border-[#4C6656]/5 group flex-[2]">
            <AiChatWidget key={chatKey} dashboard={dashboard} apps={apps} onReset={() => setChatKey(prev => prev + 1)} />
          </div>

          <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-[#E0E9E2] shadow-sm flex-1 min-h-[300px] flex flex-col">
             {/* Header */}
             <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                   <h4 className="font-bold text-[#191C1A] flex items-center gap-2 text-base">
                      <CalendarIcon size={18} className="text-[#4C6656]"/> 日历
                   </h4>
                   <span className="text-[10px] text-[#404943] font-medium mt-0.5 ml-0.5 opacity-60">{currentYear}年</span>
                </div>
                <div className="flex items-center gap-1 bg-[#F5F8F6] rounded-full p-1 pl-3 pr-1 border border-[#E0E9E2]/60">
                   <span className="text-sm font-bold text-[#191C1A] mr-1">{currentMonth + 1}月</span>
                   <div className="flex gap-0.5">
                       <button onClick={prevMonth} className="p-1 hover:bg-white hover:shadow-sm rounded-full text-[#404943] transition-all">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                       </button>
                       <button onClick={nextMonth} className="p-1 hover:bg-white hover:shadow-sm rounded-full text-[#404943] transition-all">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                       </button>
                   </div>
                </div>
             </div>

             {/* Calendar Grid Wrapper */}
             <div className="flex-1 w-full px-1 flex flex-col justify-center">
                 {/* Week Headers */}
                 <div className="grid grid-cols-7 mb-2">
                    {['日','一','二','三','四','五','六'].map((d,i) => (
                       <div key={i} className="flex items-center justify-center text-[10px] font-bold text-[#90A4AE]">{d}</div>
                    ))}
                 </div>

                 {/* Days */}
                 <div className="grid grid-cols-7 gap-y-1 justify-items-center">
                    {calendarDays.map((day, i) => {
                       const isCurrentDay = day && isToday(day);
                       return (
                       <div key={i} className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-all relative
                          ${!day ? 'invisible' : 'cursor-pointer'}
                          ${isCurrentDay
                             ? 'bg-[#4C6656] text-white shadow-lg shadow-[#4C6656]/30'
                             : 'text-[#191C1A] hover:bg-[#F0F2F5]'
                          }`}>
                          {day}
                       </div>
                       );
                    })}
                 </div>
             </div>
          </div>

          <div className="h-[80px] flex gap-4">
             <button className="flex-1 bg-[#4C6656] hover:bg-[#3E5245] text-white rounded-[24px] flex items-center justify-center gap-2 font-bold transition-colors shadow-sm">
                <Coffee size={18} /> 专注
             </button>
             <button className="flex-1 bg-white hover:bg-[#F0F2F5] text-[#191C1A] border border-[#E0E9E2] rounded-[24px] flex items-center justify-center gap-2 font-bold transition-colors shadow-sm">
                <Moon size={18} /> 睡眠
             </button>
          </div>

      </div>
    </div>
  );
}

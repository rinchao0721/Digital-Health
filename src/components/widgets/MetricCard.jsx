import React from 'react';

export default function MetricCard({ icon, value, label, bg, color }) {
  return (
    <div className="bg-white rounded-[24px] p-4 border border-[#E0E9E2] flex flex-col items-center justify-center text-center gap-1.5 hover:border-[#BCECE0] transition-colors group">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color} group-hover:scale-110 transition-transform mb-1`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-[#191C1A]">{value}</div>
      <div className="text-[10px] text-[#727970] font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}

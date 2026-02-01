import React from 'react';

export default function TabItem({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
        active
          ? 'bg-white text-[#191C1A] shadow-sm ring-1 ring-[#E0E9E2]'
          : 'text-[#404943] hover:text-[#191C1A] hover:bg-[#E0E9E2]/50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

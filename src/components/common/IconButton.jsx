import React from 'react';

export default function IconButton({ icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
        active
          ? 'bg-[#E0E9E2] text-[#191C1A]'
          : 'bg-[#F7FBF7] text-[#404943] hover:bg-[#E0E9E2] border border-[#E0E9E2]'
      }`}
    >
      {icon}
    </button>
  );
}

import React from 'react';

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string; // Tailwind class
  textColor: string; // Tailwind class
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, bgColor, textColor, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex items-center gap-5 flex-1 ${className}`}>
      <div className={`p-4 rounded-lg ${bgColor} ${textColor} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">{label}</p>
        <p className={`text-2xl font-bold leading-none ${textColor}`}>{value}</p>
      </div>
    </div>
  );
};
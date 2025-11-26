import React from 'react';

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string; // Tailwind class
  textColor: string; // Tailwind class
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, bgColor, textColor }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center gap-4 flex-1 min-w-[180px]">
      <div className={`p-3 rounded-lg ${bgColor} ${textColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-semibold uppercase">{label}</p>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      </div>
    </div>
  );
};
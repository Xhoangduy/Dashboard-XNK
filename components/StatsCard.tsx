import React, { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  iconBgColor: string; // Tailwind class, e.g., 'bg-blue-100'
  iconColor: string;   // Tailwind class, e.g., 'text-blue-600'
  valueColor?: string; // Tailwind class, e.g., 'text-blue-600'
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  icon,
  iconBgColor,
  iconColor,
  valueColor = 'text-gray-900',
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-4 p-4 h-full ${className}`}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${iconBgColor} ${iconColor}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="font-bold text-xs text-gray-500 uppercase leading-tight mb-1">
          {label}
        </h3>
        <p className={`text-2xl font-bold leading-none ${valueColor}`}>
          {value}
        </p>
      </div>
    </div>
  );
};
import React from 'react';

interface StatsCardProps {
  label: string;
  value: number;
  bgColor: string;      // Tailwind class for background
  borderColor?: string; // Tailwind class for left border color (e.g., border-green-500)
  titleColor: string;   // Tailwind class for label text color
  valueColor: string;   // Tailwind class for number text color
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  bgColor, 
  borderColor, 
  titleColor, 
  valueColor,
  className = '' 
}) => {
  return (
    <div className={`rounded-lg p-4 shadow-sm border border-gray-100 h-full flex flex-col justify-between transition-transform hover:scale-[1.02] ${bgColor} ${borderColor ? `border-l-[6px] ${borderColor}` : ''} ${className}`}>
      <h3 className={`font-bold text-xs uppercase leading-relaxed ${titleColor}`}>
        {label}
      </h3>
      <p className={`text-3xl font-bold mt-2 ${valueColor}`}>
        {value}
      </p>
    </div>
  );
};
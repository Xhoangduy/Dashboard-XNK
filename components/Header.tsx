import React from 'react';
import { Home, Search, Settings, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-[#006A65] text-white shadow-md">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm border-b border-teal-700/50">
        <div className="flex items-center gap-2">
          <div className="bg-white text-[#006A65] font-bold px-2 py-0.5 rounded text-xs">SLT</div>
          <div>
            <h1 className="font-bold uppercase leading-tight">Vietnam SmartHub Logistics</h1>
            <p className="text-[10px] opacity-90">TRUNG TÂM VẬN TẢI</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-teal-800/50 px-2 py-1 rounded cursor-pointer">
            <span>VN</span>
            <div className="w-4 h-4 bg-red-500 rounded-full border border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-yellow-400 text-[6px]">★</div>
            </div>
          </div>
          <span>MST: 280903KHK</span>
          <Settings className="w-4 h-4 cursor-pointer hover:opacity-80" />
        </div>
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm">
        <nav className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2 font-medium bg-teal-800/60 px-3 py-1.5 rounded-md">
            <Home className="w-4 h-4" />
            Tổng quan
          </a>
          <a href="#" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <Search className="w-4 h-4" />
            Tra cứu
          </a>
        </nav>
        <div className="flex items-center gap-2 opacity-80 hover:opacity-100 cursor-pointer">
           <span>Danh mục chung</span>
           <Settings className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
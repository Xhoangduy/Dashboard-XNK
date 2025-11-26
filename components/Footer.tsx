import React from 'react';
import { Box } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F2937] text-gray-300 py-8 mt-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#006A65] p-2 rounded">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
                <h3 className="font-bold text-white text-lg">SMARTHUB</h3>
                <p className="text-xs tracking-wider">LOGISTICS</p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-[#006A65] font-bold uppercase mb-4">Thông tin liên hệ</h4>
          <div className="flex items-start gap-2 text-sm">
            <span className="mt-1">📍</span>
            <p>Số 10, Đường 3/2, Quận 10, TP. Hồ Chí Minh</p>
          </div>
        </div>

        <div>
            <h4 className="text-[#006A65] font-bold uppercase mb-4">Liên kết nhanh</h4>
            <ul className="text-sm space-y-2">
                <li className="hover:text-white cursor-pointer">Trang chủ</li>
            </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-4 border-t border-gray-700 flex justify-between text-xs text-gray-500">
        <p>Giờ làm việc: Thứ 2 - Thứ 6: 08:00 - 17:30</p>
        <p>© 2025 SmartHub Logistics</p>
      </div>
    </footer>
  );
};
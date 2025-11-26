import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StatsCard } from './components/StatsCard';
import { Order, OrderStatus, RevenueData } from './types';
import { 
  Package, 
  CheckCircle, 
  Truck, 
  Clock, 
  XCircle, 
  User, 
  Mail, 
  Phone, 
  Edit,
  ArrowRight,
  Bell
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// --- MOCK DATA ---

const MOCK_ORDERS: Order[] = [
  { id: '1', orderCode: 'SLT25110114633-0', containerNo: 'CMAU3779435', size: '22G0', weight: 20, amount: 218160, pickupDate: '2025-11-01', origin: 'Cảng Cát Lái', destination: 'Cảng Container QT SP-ITC', status: OrderStatus.SUCCESS },
  { id: '2', orderCode: 'SLT25110493944-1', containerNo: 'GMLU6234978', size: '22G0', weight: 20, amount: 395280, pickupDate: '2025-11-04', origin: 'Cảng Tân Thuận', destination: 'Cảng Container QT SP-ITC', status: OrderStatus.SUCCESS },
  { id: '3', orderCode: 'SLT25110447277-2', containerNo: 'MSCU3849324', size: '22G0', weight: 20, amount: 490320, pickupDate: '2025-11-04', origin: 'Cảng Tổng Hợp Bình Dương', destination: 'Cảng Container QT SP-ITC', status: OrderStatus.SUCCESS },
  { id: '4', orderCode: 'SLT25110463664-3', containerNo: 'GMLU7282762', size: '22G0', weight: 24, amount: 218160, pickupDate: '2025-11-04', origin: 'Cảng Cát Lái', destination: 'Cảng Container QT SP-ITC', status: OrderStatus.SUCCESS },
  { id: '5', orderCode: 'SLT25110497675-4', containerNo: 'EMCU6238579', size: '22G0', weight: 23, amount: 419040, pickupDate: '2025-11-04', origin: 'Cảng Đồng Nai', destination: 'Cảng Container QT SP-ITC', status: OrderStatus.SUCCESS },
  { id: '6', orderCode: 'SLT25110456055-5', containerNo: 'EMCU7348697', size: '22G0', weight: 20, amount: 17331840, pickupDate: '2025-11-04', origin: 'Cảng Quốc tế Gemadept', destination: 'Cảng Container QT SP-ITC', status: OrderStatus.IN_TRANSIT },
  { id: '7', orderCode: 'SLT25110453817-6', containerNo: 'CMAU3724289', size: '22G0', weight: 20, amount: 12839040, pickupDate: '2025-11-04', origin: 'Cảng Quy Nhơn', destination: 'Cảng Container QT SP-ITC', status: OrderStatus.SUCCESS },
  { id: '8', orderCode: 'SLT25110417325-7', containerNo: 'NEGU0884627', size: '22G0', weight: 20, amount: 419040, pickupDate: '2025-11-04', origin: 'Cảng Sài Gòn', destination: 'Cảng Container QT SP-ITC', status: OrderStatus.SUCCESS },
  { id: '9', orderCode: 'SLT25110114633-8', containerNo: 'CMAU3779435', size: '22G0', weight: 20, amount: 218160, pickupDate: '2025-11-01', origin: 'Cảng Cát Lái', destination: 'Cảng Container QT SP-ITC', status: OrderStatus.IN_TRANSIT },
  { id: '10', orderCode: 'SLT25110599999-9', containerNo: 'TRLU1234567', size: '40HC', weight: 30, amount: 550000, pickupDate: '2025-11-05', origin: 'Cảng Cát Lái', destination: 'Kho Lạnh Hùng Vương', status: OrderStatus.PENDING },
  { id: '11', orderCode: 'SLT25110688888-0', containerNo: 'KLINE987654', size: '20DC', weight: 18, amount: 120000, pickupDate: '2025-11-02', origin: 'ICD Phước Long', destination: 'Cảng Cát Lái', status: OrderStatus.CANCELLED },
];

const REVENUE_DATA: RevenueData[] = [
  { id: 1, category: 'HẠ BÃI', count: 31, amount: 9618480 },
  { id: 2, category: 'NÂNG CONTAINER', count: 15, amount: 4200000 },
  { id: 3, category: 'VẬN CHUYỂN NỘI BỘ', count: 8, amount: 12500000 },
];

// --- HELPERS ---

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.SUCCESS:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
          Thành công
        </span>
      );
    case OrderStatus.IN_TRANSIT:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
          Đang vận chuyển
        </span>
      );
    case OrderStatus.PENDING:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
          Chờ vận chuyển
        </span>
      );
    case OrderStatus.CANCELLED:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800">
          Đã hủy
        </span>
      );
    default:
      return null;
  }
};

const STATUS_CONFIG = {
  [OrderStatus.SUCCESS]: { label: 'Thành công', color: '#22c55e', count: 23 },
  [OrderStatus.IN_TRANSIT]: { label: 'Đang vận chuyển', color: '#3b82f6', count: 2 },
  [OrderStatus.PENDING]: { label: 'Chờ vận chuyển', color: '#eab308', count: 5 },
  [OrderStatus.CANCELLED]: { label: 'Đã hủy', color: '#ef4444', count: 3 },
};

const TOTAL_ORDERS = 33; // Mock total

const ChartData = [
  { name: 'Thành công', value: 23, color: '#22c55e' }, // green-500
  { name: 'Đang vận chuyển', value: 2, color: '#3b82f6' }, // blue-500
  { name: 'Chờ vận chuyển', value: 5, color: '#eab308' }, // yellow-500
  { name: 'Đã hủy', value: 3, color: '#ef4444' }, // red-500
];

const App: React.FC = () => {
  const [orders] = useState<Order[]>(MOCK_ORDERS);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6 space-y-6">
        
        {/* Top Section: Stats Cards + User Profile - All in one row on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatsCard 
            label="Tổng đơn hàng" 
            value={TOTAL_ORDERS} 
            icon={<Package className="w-6 h-6" />}
            bgColor="bg-gray-100"
            textColor="text-gray-600"
          />
          <StatsCard 
            label="Thành công" 
            value={STATUS_CONFIG[OrderStatus.SUCCESS].count} 
            icon={<CheckCircle className="w-6 h-6" />}
            bgColor="bg-green-100"
            textColor="text-green-600"
          />
          <StatsCard 
            label="Đang vận chuyển" 
            value={STATUS_CONFIG[OrderStatus.IN_TRANSIT].count} 
            icon={<Truck className="w-6 h-6" />}
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
          <StatsCard 
            label="Chờ vận chuyển" 
            value={STATUS_CONFIG[OrderStatus.PENDING].count} 
            icon={<Clock className="w-6 h-6" />}
            bgColor="bg-yellow-100"
            textColor="text-yellow-600"
          />
          <StatsCard 
            label="Đã hủy" 
            value={STATUS_CONFIG[OrderStatus.CANCELLED].count} 
            icon={<XCircle className="w-6 h-6" />}
            bgColor="bg-red-100"
            textColor="text-red-600"
          />

          {/* User Profile Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-full flex-shrink-0 flex items-center justify-center text-green-700">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-800 truncate">Công ty TNHH XNK</h3>
                <div className="flex items-center gap-1 text-xs text-teal-600 cursor-pointer hover:underline">
                  <Edit className="w-3 h-3" />
                  <span>Cập nhật</span>
                </div>
              </div>
            </div>
            <div className="space-y-1 mt-1">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate" title="duynguyen2454@gmail.com">duynguyen2454@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>0942322454</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#006A65]" />
              <h2 className="font-bold text-gray-800">Danh sách đơn hàng cần vận chuyển</h2>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative">
                 <Bell className="w-5 h-5 text-red-500 cursor-pointer" />
                 <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-3.5 h-3.5 flex items-center justify-center rounded-full">36</span>
               </div>
               <button className="flex items-center gap-1 text-xs text-teal-600 font-medium hover:underline">
                 <ArrowRight className="w-4 h-4" />
                 Chi tiết
               </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                <tr>
                  <th className="px-4 py-3 text-center w-12">STT</th>
                  <th className="px-4 py-3">Mã đơn hàng</th>
                  <th className="px-4 py-3">Số Container</th>
                  <th className="px-4 py-3 text-center">Kích cỡ</th>
                  <th className="px-4 py-3 text-center">Trọng lượng</th>
                  <th className="px-4 py-3 text-right">Số tiền</th>
                  {/* REMOVED: Tên chủ hàng, ĐT chủ hàng */}
                  <th className="px-4 py-3">Ngày lấy hàng</th>
                  <th className="px-4 py-3">Điểm đi</th>
                  <th className="px-4 py-3">Điểm đến</th>
                  <th className="px-4 py-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-center text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-700">{order.orderCode}</td>
                    <td className="px-4 py-3 text-gray-600">{order.containerNo}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{order.size}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{order.weight}</td>
                    <td className="px-4 py-3 text-right text-[#006A65] font-medium">{formatCurrency(order.amount)}</td>
                    <td className="px-4 py-3 text-gray-600">{order.pickupDate}</td>
                    <td className="px-4 py-3 text-gray-600">{order.origin}</td>
                    <td className="px-4 py-3 text-gray-600">{order.destination}</td>
                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-2 bg-gray-50 text-right text-xs text-gray-500 border-t border-gray-100 italic">
             Tổng số: {orders.length} đơn hàng
          </div>
        </div>

        {/* Bottom Section: Revenue & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left: Revenue Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">Doanh thu theo tháng</h2>
            </div>
            <div className="flex-grow">
              <table className="w-full text-sm">
                <thead className="bg-[#0e7490] text-white text-xs uppercase">
                  <tr>
                    <th className="px-4 py-2 text-center w-16">STT</th>
                    <th className="px-4 py-2 text-left">Tác nghiệp</th>
                    <th className="px-4 py-2 text-center">Tổng</th>
                    <th className="px-4 py-2 text-right">Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {REVENUE_DATA.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-700 uppercase">{item.category}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{item.count}</td>
                      <td className="px-4 py-3 text-right text-[#006A65] font-bold">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                  {/* Empty rows filler similar to design */}
                  <tr><td className="px-4 py-3 text-center text-gray-400">-</td><td className="px-4 py-3"></td><td className="px-4 py-3"></td><td className="px-4 py-3"></td></tr>
                  <tr><td className="px-4 py-3 text-center text-gray-400">-</td><td className="px-4 py-3"></td><td className="px-4 py-3"></td><td className="px-4 py-3"></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Status Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
               <h2 className="font-bold text-gray-800">Tình trạng đơn hàng</h2>
               <span className="text-xs text-gray-500 italic">Tổng: {TOTAL_ORDERS} đơn</span>
            </div>
            
            <div className="flex-grow flex items-center justify-center relative">
               <div className="w-full h-[250px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {ChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value} đơn`, 'Số lượng']} />
                    </PieChart>
                 </ResponsiveContainer>
                 {/* Center Label for Donut */}
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <p className="text-2xl font-bold text-gray-700">74%</p>
                    <p className="text-[10px] text-gray-400 uppercase">Thành công</p>
                 </div>
               </div>
               
               {/* Custom Legend to match design on the right */}
               <div className="ml-4 space-y-3 text-xs min-w-[120px]">
                  {ChartData.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                         <span className="text-gray-600">{entry.name}:</span>
                       </div>
                       <span className="font-bold text-gray-800">{entry.value}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default App;
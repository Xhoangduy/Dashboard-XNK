import React, { useState, useMemo } from 'react';
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
  Edit,
  ArrowRight,
  Bell,
  Search,
  Filter,
  Calendar,
  X
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

// Helper function to remove accents for Vietnamese search
const removeAccents = (str: string) => {
  return str.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
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
  
  // Filter states
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterDate, setFilterDate] = useState('');

  // Derived filtered data using useMemo for performance and stability
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Search Text (Accent-insensitive)
      let matchesText = true;
      if (filterText) {
        const normalize = (text: string) => removeAccents(text).toLowerCase();
        const search = normalize(filterText);
        
        matchesText = 
          normalize(order.orderCode).includes(search) ||
          normalize(order.containerNo).includes(search) ||
          normalize(order.origin).includes(search) ||
          normalize(order.destination).includes(search);
      }
      
      // 2. Status Filter
      const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
      
      // 3. Date Filter (Exact string match yyyy-mm-dd)
      const matchesDate = !filterDate || order.pickupDate === filterDate;

      return matchesText && matchesStatus && matchesDate;
    });
  }, [orders, filterText, filterStatus, filterDate]);

  const clearFilters = () => {
    setFilterText('');
    setFilterStatus('ALL');
    setFilterDate('');
  };

  const hasActiveFilters = filterText !== '' || filterStatus !== 'ALL' || filterDate !== '';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6 space-y-6">
        
        {/* Top Section: Split Stats and Company Profile for better spacing and control */}
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Left: Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4 flex-grow">
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
          </div>

          {/* Right: User Profile Card */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-between w-full xl:w-96 flex-shrink-0">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-gray-800">Administrator</h3>
                  <Edit className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
                </div>
              </div>
              <button className="bg-[#00bfa5] hover:bg-teal-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition-colors shadow-sm">
                Đặt xe
              </button>
            </div>
            
            <div className="space-y-4 pl-1">
              <div className="flex items-baseline gap-2 text-sm">
                <span className="italic text-gray-600 min-w-[85px]">Mã số thuế:</span>
                <span className="text-gray-800 font-medium"></span>
              </div>
              <div className="flex items-baseline gap-2 text-sm">
                <span className="italic text-gray-600 min-w-[85px]">Địa chỉ:</span>
                <span className="text-gray-800 font-medium uppercase">CTY TNHH DV TIN HỌC CEH</span>
              </div>
              <div className="flex items-baseline gap-2 text-sm">
                <span className="italic text-gray-600 min-w-[85px]">Email:</span>
                <span className="text-gray-800 font-medium">doanvanhieu.info@gmail.com</span>
              </div>
              <div className="flex items-baseline gap-2 text-sm">
                <span className="italic text-gray-600 min-w-[85px]">Điện thoại:</span>
                <span className="text-gray-800 font-medium">4324234332</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col gap-4">
            {/* Header Title & Actions */}
            <div className="flex justify-between items-center">
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

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 bg-gray-50 p-3 rounded-md border border-gray-100">
               {/* Search */}
               <div className="relative flex-grow w-full md:w-auto">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Search className="w-4 h-4 text-gray-400" />
                 </div>
                 <input 
                   type="text" 
                   placeholder="Tìm kiếm mã đơn, container, địa điểm..." 
                   className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white text-gray-900 placeholder-gray-500"
                   value={filterText}
                   onChange={(e) => setFilterText(e.target.value)}
                 />
               </div>

               {/* Status Filter */}
               <div className="relative w-full md:w-48">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Filter className="h-4 w-4 text-gray-400" />
                 </div>
                 <select
                   className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none bg-white text-gray-900"
                   value={filterStatus}
                   onChange={(e) => setFilterStatus(e.target.value)}
                 >
                   <option value="ALL" className="bg-white text-gray-900">Tất cả trạng thái</option>
                   <option value={OrderStatus.SUCCESS} className="bg-white text-gray-900">Thành công</option>
                   <option value={OrderStatus.IN_TRANSIT} className="bg-white text-gray-900">Đang vận chuyển</option>
                   <option value={OrderStatus.PENDING} className="bg-white text-gray-900">Chờ vận chuyển</option>
                   <option value={OrderStatus.CANCELLED} className="bg-white text-gray-900">Đã hủy</option>
                 </select>
               </div>

               {/* Date Filter */}
               <div className="relative w-full md:w-40">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Calendar className="h-4 w-4 text-gray-400" />
                 </div>
                 <input 
                   type="date" 
                   className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white text-gray-900 placeholder-gray-500"
                   value={filterDate}
                   onChange={(e) => setFilterDate(e.target.value)}
                 />
               </div>

               {/* Clear Filter */}
               {hasActiveFilters && (
                 <button 
                   onClick={clearFilters}
                   className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium px-2 py-1 whitespace-nowrap"
                 >
                   <X className="w-4 h-4" />
                   Xóa lọc
                 </button>
               )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">STT</th>
                  <th className="px-4 py-3">Mã đơn hàng</th>
                  <th className="px-4 py-3">Số xe / Cont</th>
                  <th className="px-4 py-3 text-right">Cước phí (VNĐ)</th>
                  <th className="px-4 py-3">Ngày lấy hàng</th>
                  <th className="px-4 py-3">Nơi lấy hàng</th>
                  <th className="px-4 py-3">Nơi giao hàng</th>
                  <th className="px-4 py-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-teal-700">{order.orderCode}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{order.containerNo}</div>
                      <div className="text-xs text-gray-500">{order.size} • {order.weight} tấn</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(order.amount)}</td>
                    <td className="px-4 py-3 text-gray-600">{order.pickupDate}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate" title={order.origin}>{order.origin}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate" title={order.destination}>{order.destination}</td>
                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                  </tr>
                ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Status Distribution */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-gray-700">Tỷ lệ trạng thái đơn hàng</h3>
             </div>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value} đơn`, 'Số lượng']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Revenue Analysis */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-gray-700">Doanh thu theo nghiệp vụ</h3>
               <button className="text-xs text-teal-600 font-medium hover:underline">Xem tất cả</button>
             </div>
             <div className="space-y-4">
                {REVENUE_DATA.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.category}</p>
                        <p className="text-xs text-gray-500">{item.count} đơn hàng</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-teal-700">{formatCurrency(item.amount)} ₫</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default App;
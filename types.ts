export enum OrderStatus {
  SUCCESS = 'SUCCESS',
  IN_TRANSIT = 'IN_TRANSIT',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  orderCode: string;
  containerNo: string;
  size: string;
  weight: number; // tons
  amount: number; // VND
  pickupDate: string;
  origin: string;
  destination: string;
  status: OrderStatus;
}

export interface RevenueData {
  id: number;
  category: string;
  count: number;
  amount: number;
}

export interface StatusSummary {
  status: OrderStatus;
  count: number;
  label: string;
  color: string;
  iconBg: string;
  iconColor: string;
}

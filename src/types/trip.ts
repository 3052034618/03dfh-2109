export type ChecklistCategory = 'beforeDeparture' | 'beforeArrival' | 'afterReturn';

export interface ChecklistItem {
  id: string;
  title: string;
  category: ChecklistCategory;
  isCompleted: boolean;
  note?: string;
  dueDate?: string;
  assigneeId?: string;
  assigneeName?: string;
}

export interface Trip {
  id: string;
  title: string;
  city: string;
  scriptName: string;
  date: string;
  time: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  transportBooking?: {
    type: 'train' | 'plane' | 'car';
    bookingNo: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
  };
  accommodationBooking?: {
    hotelName: string;
    address: string;
    checkInDate: string;
    checkOutDate: string;
    price: number;
    bookingNo: string;
  };
  depositPaid: number;
  totalBudget: number;
  checklist: ChecklistItem[];
  status: 'upcoming' | 'ongoing' | 'completed';
  companions: { id: string; nickname: string; avatar: string; intention: string; wechatId?: string; phone?: string }[];
  sourceCardId?: string;
  acceptShareRoom?: boolean;
  acceptShareCar?: boolean;
}

export const categoryLabels: Record<ChecklistCategory, string> = {
  beforeDeparture: '出发前',
  beforeArrival: '到店前',
  afterReturn: '返程后'
};

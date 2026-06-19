export type ChecklistCategory = 'beforeDeparture' | 'beforeArrival' | 'afterReturn';
export type ExpenseCategory = 'transport' | 'accommodation' | 'deposit' | 'food' | 'ticket' | 'other';

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

export interface TripMessage {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  category: 'booking' | 'hotel' | 'store' | 'other';
  createdAt: string;
}

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  paidBy: string;
  paidByName: string;
  splitAmong: string[];
  paidMembers: string[];
  createdAt: string;
  note?: string;
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
  messages: TripMessage[];
  expenses: Expense[];
}

export const categoryLabels: Record<ChecklistCategory, string> = {
  beforeDeparture: '出发前',
  beforeArrival: '到店前',
  afterReturn: '返程后'
};

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  transport: '交通',
  accommodation: '住宿',
  deposit: '定金',
  food: '餐饮',
  ticket: '门票',
  other: '其他'
};

export const messageCategoryLabels: Record<string, string> = {
  booking: '订票',
  hotel: '订房',
  store: '店家',
  other: '其他'
};

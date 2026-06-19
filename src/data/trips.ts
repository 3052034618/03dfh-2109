import type { Trip } from '../types/trip';

export const mockTrips: Trip[] = [
  {
    id: 't1',
    title: '上海《惊华》之旅',
    city: '上海',
    scriptName: '惊华',
    date: '2026-06-22',
    time: '14:00',
    storeName: '上海剧本杀旗舰店',
    storeAddress: '上海市黄浦区南京东路100号',
    storePhone: '021-12345678',
    transportBooking: {
      type: 'plane',
      bookingNo: 'CA1234',
      departureTime: '2026-06-22 08:00',
      arrivalTime: '2026-06-22 10:30',
      price: 580
    },
    accommodationBooking: {
      hotelName: '上海如家酒店',
      address: '上海市黄浦区南京东路80号',
      checkInDate: '2026-06-22',
      checkOutDate: '2026-06-23',
      price: 458,
      bookingNo: 'HOTEL5678'
    },
    depositPaid: 100,
    totalBudget: 1500,
    checklist: [
      { id: 'item1', title: '订机票', category: 'beforeDeparture', isCompleted: true, dueDate: '2026-06-20', assigneeId: 'u1', assigneeName: '小明' },
      { id: 'item2', title: '订酒店', category: 'beforeDeparture', isCompleted: true, dueDate: '2026-06-20', assigneeId: 'u1', assigneeName: '小明' },
      { id: 'item3', title: '支付定金100元', category: 'beforeDeparture', isCompleted: true, dueDate: '2026-06-21' },
      { id: 'item4', title: '查看店家地址', category: 'beforeArrival', isCompleted: false, note: '南京东路站2号口出，步行5分钟' },
      { id: 'item5', title: '确认开本时间14:00', category: 'beforeArrival', isCompleted: false },
      { id: 'item6', title: '联系同行小伙伴', category: 'beforeArrival', isCompleted: false },
      { id: 'item7', title: '返程订票', category: 'afterReturn', isCompleted: false },
      { id: 'item8', title: 'AA算账', category: 'afterReturn', isCompleted: false }
    ],
    status: 'upcoming',
    companions: [
      { id: 'u1', nickname: '小明', avatar: 'https://picsum.photos/id/64/200/200', intention: 'all', wechatId: 'xiaoming_jbs', phone: '138****1234' },
      { id: 'u2', nickname: '小红', avatar: 'https://picsum.photos/id/91/200/200', intention: 'all', wechatId: 'xiaohong_jbs', phone: '139****5678' }
    ],
    sourceCardId: 'c1',
    acceptShareRoom: true,
    acceptShareCar: true
  },
  {
    id: 't2',
    title: '杭州《雾起云浮》情感之旅',
    city: '杭州',
    scriptName: '雾起云浮',
    date: '2026-06-22',
    time: '13:30',
    storeName: '杭州西湖推理社',
    storeAddress: '杭州市西湖区文三路200号',
    storePhone: '0571-87654321',
    transportBooking: {
      type: 'train',
      bookingNo: 'G1234',
      departureTime: '2026-06-22 09:00',
      arrivalTime: '2026-06-22 10:30',
      price: 220
    },
    depositPaid: 100,
    totalBudget: 800,
    checklist: [
      { id: 'item9', title: '订高铁票', category: 'beforeDeparture', isCompleted: true, dueDate: '2026-06-20', assigneeId: 'u4', assigneeName: '情感本玩家' },
      { id: 'item10', title: '支付定金100元', category: 'beforeDeparture', isCompleted: false, dueDate: '2026-06-21' },
      { id: 'item11', title: '查看店家地址', category: 'beforeArrival', isCompleted: false },
      { id: 'item12', title: '确认开本时间', category: 'beforeArrival', isCompleted: false }
    ],
    status: 'upcoming',
    companions: [
      { id: 'u4', nickname: '情感本玩家', avatar: 'https://picsum.photos/id/338/200/200', intention: 'all', wechatId: 'qinggan_wan', phone: '137****9999' },
      { id: 'u5', nickname: '小琳', avatar: 'https://picsum.photos/id/1027/200/200', intention: 'table', wechatId: 'xiaolin_jbs', phone: '136****1111' }
    ],
    sourceCardId: 'c2',
    acceptShareRoom: true,
    acceptShareCar: false
  },
  {
    id: 't3',
    title: '成都欢乐行',
    city: '成都',
    scriptName: '第二十二条校规',
    date: '2026-06-15',
    time: '19:00',
    storeName: '成都迷雾剧场',
    storeAddress: '成都市锦江区春熙路150号',
    storePhone: '028-55556666',
    transportBooking: {
      type: 'train',
      bookingNo: 'G5678',
      departureTime: '2026-06-15 14:00',
      arrivalTime: '2026-06-15 15:30',
      price: 180
    },
    accommodationBooking: {
      hotelName: '成都春熙路酒店',
      address: '成都市锦江区春熙路100号',
      checkInDate: '2026-06-15',
      checkOutDate: '2026-06-16',
      price: 388,
      bookingNo: 'HOTEL1234'
    },
    depositPaid: 120,
    totalBudget: 1000,
    checklist: [
      { id: 'item13', title: '订高铁票', category: 'beforeDeparture', isCompleted: true },
      { id: 'item14', title: '订酒店', category: 'beforeDeparture', isCompleted: true },
      { id: 'item15', title: '支付定金', category: 'beforeDeparture', isCompleted: true },
      { id: 'item16', title: '查看店家地址', category: 'beforeArrival', isCompleted: true },
      { id: 'item17', title: '确认开本时间', category: 'beforeArrival', isCompleted: true },
      { id: 'item18', title: '返程订票', category: 'afterReturn', isCompleted: true },
      { id: 'item19', title: 'AA算账', category: 'afterReturn', isCompleted: true }
    ],
    status: 'completed',
    companions: [
      { id: 'u7', nickname: '欢乐喜剧人', avatar: 'https://picsum.photos/id/659/200/200', intention: 'all', wechatId: 'huanle_xiju', phone: '134****3333' },
      { id: 'u8', nickname: '小花', avatar: 'https://picsum.photos/id/718/200/200', intention: 'all', wechatId: 'xiaohua_cd', phone: '133****4444' },
      { id: 'u9', nickname: '阿强', avatar: 'https://picsum.photos/id/783/200/200', intention: 'room', wechatId: 'aqiang_cd', phone: '132****5555' },
      { id: 'u10', nickname: '小美', avatar: 'https://picsum.photos/id/1025/200/200', intention: 'table', wechatId: 'xiaomei_cd', phone: '131****6666' }
    ],
    sourceCardId: 'c4',
    acceptShareRoom: true,
    acceptShareCar: true
  }
];

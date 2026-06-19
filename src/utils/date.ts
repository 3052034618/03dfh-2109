export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[date.getDay()];
  return `${month}月${day}日 ${weekday}`;
};

export const formatDateTime = (dateTimeStr: string): string => {
  const date = new Date(dateTimeStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${month}月${day}日 ${hour}:${minute}`;
};

export const isThisWeekend = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const today = new Date();
  const dayOfWeek = date.getDay();
  const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return dayOfWeek === 0 || dayOfWeek === 6 && diffDays <= 7;
};

export const getWeekendLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return '已过期';
  if (diffDays <= 7) return '本周末';
  if (diffDays <= 14) return '下周末';
  if (diffDays <= 21) return '两周后';
  return formatDate(dateStr);
};

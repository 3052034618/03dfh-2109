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

const getNextWeekendStart = (fromDate: Date, weeksAhead: number): Date => {
  const d = new Date(fromDate);
  d.setHours(0, 0, 0, 0);
  const dayOfWeek = d.getDay();
  let daysUntilSaturday: number;
  if (dayOfWeek === 0) {
    daysUntilSaturday = 6;
  } else {
    daysUntilSaturday = 6 - dayOfWeek;
  }
  d.setDate(d.getDate() + daysUntilSaturday + weeksAhead * 7);
  return d;
};

const getNextWeekendEnd = (fromDate: Date, weeksAhead: number): Date => {
  const saturday = getNextWeekendStart(fromDate, weeksAhead);
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  sunday.setHours(23, 59, 59, 999);
  return sunday;
};

export const isDateInRange = (dateStr: string, rangeLabel: string): boolean => {
  if (rangeLabel === '全部日期') return true;

  const date = new Date(dateStr);
  date.setHours(12, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (rangeLabel === '本周末') {
    const thisSat = getNextWeekendStart(now, 0);
    const thisSunEnd = getNextWeekendEnd(now, 0);
    if (now.getDay() === 0) {
      const prevSat = new Date(now);
      prevSat.setDate(prevSat.getDate() - 1);
      return date >= prevSat && date <= now;
    }
    return date >= thisSat && date <= thisSunEnd;
  }

  if (rangeLabel === '下周末') {
    const nextSat = getNextWeekendStart(now, 1);
    const nextSunEnd = getNextWeekendEnd(now, 1);
    return date >= nextSat && date <= nextSunEnd;
  }

  if (rangeLabel === '两周后') {
    const week2Sat = getNextWeekendStart(now, 2);
    const week2SunEnd = getNextWeekendEnd(now, 2);
    return date >= week2Sat && date <= week2SunEnd;
  }

  return true;
};

export const getWeekendLabel = (dateStr: string): string => {
  const ranges = ['本周末', '下周末', '两周后'];
  for (const range of ranges) {
    if (isDateInRange(dateStr, range)) return range;
  }
  return formatDate(dateStr);
};

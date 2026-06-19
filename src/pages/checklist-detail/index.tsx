import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '../../store/useAppStore';
import type { ChecklistCategory } from '../../types/trip';
import { categoryLabels } from '../../types/trip';
import { formatDate, formatDateTime } from '../../utils/date';

const categoryOrder: ChecklistCategory[] = ['beforeDeparture', 'beforeArrival', 'afterReturn'];
const categoryIcons: Record<ChecklistCategory, string> = {
  beforeDeparture: '🚀',
  beforeArrival: '🏪',
  afterReturn: '🏠'
};

const ChecklistDetailPage: React.FC = () => {
  const { trips, toggleChecklistItem } = useAppStore();

  const params = Taro.getCurrentInstance().router?.params;
  const tripId = params?.id || '';

  const trip = useMemo(() => {
    return trips.find(t => t.id === tripId);
  }, [trips, tripId]);

  if (!trip) {
    return (
      <View className={styles.page}>
        <View className="pageContainer">
          <Text className={styles.notFound}>行程不存在</Text>
        </View>
      </View>
    );
  }

  const completedCount = trip.checklist.filter(i => i.isCompleted).length;
  const totalCount = trip.checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const pendingCount = totalCount - completedCount;

  const groupedItems = categoryOrder.map(category => ({
    category,
    label: categoryLabels[category],
    icon: categoryIcons[category],
    items: trip.checklist.filter(item => item.category === category),
    completedInGroup: trip.checklist.filter(item => item.category === category && item.isCompleted).length
  }));

  const handleToggle = (itemId: string) => {
    toggleChecklistItem(trip.id, itemId);
    const item = trip.checklist.find(i => i.id === itemId);
    console.log('[ChecklistDetailPage] 切换清单项:', itemId, item?.isCompleted ? '取消完成' : '标记完成');
  };

  return (
    <View className={styles.page}>
      <View className="pageContainer">
        <View className={styles.tripHeader}>
          <Text className={styles.tripTitle}>{trip.title}</Text>
          <View className={styles.tripMeta}>
            <Text className={styles.tripMetaText}>{trip.city} · {formatDate(trip.date)} · {trip.time}</Text>
          </View>
          <View className={styles.storeInfo}>
            <Text className={styles.storeName}>{trip.storeName}</Text>
            <Text className={styles.storeAddress}>{trip.storeAddress}</Text>
          </View>
        </View>

        <View className={styles.progressCard}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressTitle}>行前准备进度</Text>
            <Text className={styles.progressCount}>{completedCount}/{totalCount}</Text>
          </View>
          <View className={styles.progressBar}>
            <View className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </View>
          <View className={styles.progressStats}>
            <Text className={styles.statText}>已完成 {completedCount} 项</Text>
            <Text className={classnames(styles.statText, styles.statPending)}>待办 {pendingCount} 项</Text>
          </View>
        </View>

        {trip.transportBooking && (
          <View className={styles.bookingCard}>
            <Text className={styles.bookingTitle}>交通信息</Text>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>{trip.transportBooking.type === 'plane' ? '航班号' : '车次'}</Text>
              <Text className={styles.bookingValue}>{trip.transportBooking.bookingNo}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>出发</Text>
              <Text className={styles.bookingValue}>{formatDateTime(trip.transportBooking.departureTime)}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>到达</Text>
              <Text className={styles.bookingValue}>{formatDateTime(trip.transportBooking.arrivalTime)}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>价格</Text>
              <Text className={styles.bookingValue}>¥{trip.transportBooking.price}</Text>
            </View>
          </View>
        )}

        {trip.accommodationBooking && (
          <View className={styles.bookingCard}>
            <Text className={styles.bookingTitle}>住宿信息</Text>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>酒店</Text>
              <Text className={styles.bookingValue}>{trip.accommodationBooking.hotelName}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>地址</Text>
              <Text className={styles.bookingValue}>{trip.accommodationBooking.address}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>入住</Text>
              <Text className={styles.bookingValue}>{formatDate(trip.accommodationBooking.checkInDate)}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>退房</Text>
              <Text className={styles.bookingValue}>{formatDate(trip.accommodationBooking.checkOutDate)}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>订单号</Text>
              <Text className={styles.bookingValue}>{trip.accommodationBooking.bookingNo}</Text>
            </View>
          </View>
        )}

        {groupedItems.map(({ category, label, icon, items, completedInGroup }) => (
          <View key={category} className={styles.categorySection}>
            <View className={styles.categoryHeader}>
              <Text className={styles.categoryIcon}>{icon}</Text>
              <Text className={styles.categoryLabel}>{label}</Text>
              <Text className={styles.categoryCount}>{completedInGroup}/{items.length}</Text>
            </View>
            {items.map((item) => (
              <View
                key={item.id}
                className={classnames(styles.checkItem, item.isCompleted && styles.checkItemDone)}
                onClick={() => handleToggle(item.id)}
              >
                <View className={classnames(styles.checkbox, item.isCompleted && styles.checkboxChecked)}>
                  {item.isCompleted && <Text className={styles.checkmark}>✓</Text>}
                </View>
                <View className={styles.checkContent}>
                  <Text className={classnames(styles.checkTitle, item.isCompleted && styles.checkTitleDone)}>
                    {item.title}
                  </Text>
                  {item.note && (
                    <Text className={styles.checkNote}>{item.note}</Text>
                  )}
                  {item.dueDate && (
                    <Text className={styles.checkDue}>截止 {formatDate(item.dueDate)}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ChecklistDetailPage;

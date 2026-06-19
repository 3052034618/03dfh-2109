import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { Trip } from '../../types/trip';
import { formatDate } from '../../utils/date';

interface TripCardProps {
  trip: Trip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const handleClick = () => {
    console.log('[TripCard] 点击行程详情:', trip.id, trip.title);
    Taro.navigateTo({
      url: `/pages/checklist-detail/index?id=${trip.id}`
    });
  };

  const completedItems = trip.checklist.filter(item => item.isCompleted).length;
  const totalItems = trip.checklist.length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <View className={styles.titleSection}>
          <Text className={styles.title}>{trip.title}</Text>
          <View className={classnames(styles.statusBadge, styles[`status${trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}]}>
            <Text className={styles.statusText}>
              {trip.status === 'upcoming' ? '即将出发' : trip.status === 'ongoing' ? '进行中' : '已完成'}
            </Text>
          </View>
        </View>
        <Text className={styles.date}>{formatDate(trip.date)} {trip.time}</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.infoRow}>
          <Text className={styles.storeName}>{trip.storeName}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>店家地址</Text>
          <Text className={styles.infoValue}>{trip.storeAddress}</Text>
        </View>
      </View>

      <View className={styles.progressSection}>
        <View className={styles.progressHeader}>
          <Text className={styles.progressLabel}>行前清单</Text>
          <Text className={styles.progressCount}>{completedItems}/{totalItems} 项已完成</Text>
        </View>
        <View className={styles.progressBar}>
          <View
            className={classnames(styles.progressFill, styles[trip.status === 'completed' && 'progressFillCompleted']}
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      <View className={styles.footer}>
        <View className={styles.budgetInfo}>
          <Text className={styles.budgetLabel}>预算</Text>
          <Text className={styles.budget}>¥{trip.totalBudget}</Text>
        </View>
        <View className={styles.companions}>
          <Text className={styles.companionsLabel}>同行</Text>
          <Text className={styles.companionsText}>{trip.companions.join('、')}</Text>
        </View>
      </View>
    </View>
  );
};

export default TripCard;

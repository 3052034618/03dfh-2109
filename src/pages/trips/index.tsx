import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockTrips } from '../../data/trips';
import type { Trip } from '../../types/trip';
import TripCard from '../../components/TripCard';

type TabType = 'upcoming' | 'ongoing' | 'completed';

const TripsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[TripsPage] 页面加载，获取行程数据');
    loadTrips();
  }, []);

  const loadTrips = () => {
    setLoading(true);
    setTimeout(() => {
      console.log('[TripsPage] 行程数据加载完成，共', mockTrips.length, '条');
      setTrips(mockTrips);
      setLoading(false);
    }, 500);
  };

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => trip.status === activeTab);
  }, [trips, activeTab]);

  const stats = useMemo(() => {
    return {
      upcoming: trips.filter(t => t.status === 'upcoming').length,
      ongoing: trips.filter(t => t.status === 'ongoing').length,
      completed: trips.filter(t => t.status === 'completed').length,
      total: trips.length
    };
  }, [trips]);

  const upcomingItems = useMemo(() => {
    return trips.filter(t => t.status === 'upcoming');
  }, [trips]);

  const pendingTasks = useMemo(() => {
    return upcomingItems.reduce((count, trip) => {
      return count + trip.checklist.filter(item => !item.isCompleted).length;
    }, 0);
  }, [upcomingItems]);

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'upcoming', label: '即将出发', count: stats.upcoming },
    { key: 'ongoing', label: '进行中', count: stats.ongoing },
    { key: 'completed', label: '已完成', count: stats.completed }
  ];

  return (
    <ScrollView scrollY className={styles.tripsPage}>
      <View className="pageContainer">
        <View className={styles.pageHeader}>
          <Text className={styles.pageTitle}>我的行程</Text>
          <Text className={styles.pageSubtitle}>管理你的跨城打本之旅</Text>
        </View>

        <View className={styles.summaryCard}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryNumber}>{stats.total}</Text>
            <Text className={styles.summaryLabel}>总行程</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryNumber}>{pendingTasks}</Text>
            <Text className={styles.summaryLabel}>待办事项</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryNumber}>{stats.completed}</Text>
            <Text className={styles.summaryLabel}>已完成</Text>
          </View>
        </View>

        <View className={styles.tabBar}>
          {tabs.map((tab) => (
            <View
              key={tab.key}
              className={classnames(styles.tabItem, activeTab === tab.key && styles.tabItemActive)}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text className={styles.tabText}>{tab.label}</Text>
              {tab.count > 0 && tab.key === 'upcoming' && pendingTasks > 0 && (
                <View className={styles.tabCount}>
                  <Text className={styles.tabCountText}>{pendingTasks}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <Text className={styles.sectionTitle}>
          {activeTab === 'upcoming' ? '即将出发' : activeTab === 'ongoing' ? '进行中' : '已完成'}
        </Text>

        {loading ? (
          <Text className={styles.loadingText}>加载中...</Text>
        ) : filteredTrips.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>✈️</Text>
            <Text className={styles.emptyText}>
              {activeTab === 'upcoming'
                ? '暂无即将出发的行程\n去首页看看有没有感兴趣的限定本吧'
                : activeTab === 'ongoing'
                ? '暂无进行中的行程'
                : '暂无已完成的行程'}
            </Text>
          </View>
        ) : (
          <View className={styles.tripList}>
            {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default TripsPage;

import React, { useState, useMemo } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '../../store/useAppStore';
import { useUserStore } from '../../store/useUserStore';
import { cities } from '../../data/games';
import { scriptTypeLabels, type ScriptType } from '../../types/user';
import type { CompanionCard } from '../../types/companion';
import CompanionCardComponent from '../../components/CompanionCard';

type TabType = 'all' | 'published' | 'joined';
type JoinedFilter = 'all' | 'pending' | 'confirmed' | 'ended';
type SortMode = 'date' | 'city';

const CompanionPage: React.FC = () => {
  const { companionCards } = useAppStore();
  const { profile } = useUserStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [joinedFilter, setJoinedFilter] = useState<JoinedFilter>('all');
  const [publishedFilter, setPublishedFilter] = useState<JoinedFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('date');
  const [selectedCity, setSelectedCity] = useState('全部');
  const [selectedType, setSelectedType] = useState<ScriptType | 'all'>('all');

  const pendingIntentions = useMemo(() => {
    return companionCards.filter(c => c.publisherId === profile.id).reduce((count, card) => {
      return count + card.companions.filter(comp => !comp.isConfirmed).length;
    }, 0);
  }, [companionCards, profile.id]);

  const myJoinedPendingCount = useMemo(() => {
    return companionCards.filter(card => {
      const myCompanion = card.companions.find(c => c.userId === profile.id);
      return myCompanion && !myCompanion.isConfirmed;
    }).length;
  }, [companionCards, profile.id]);

  const joinedCards = useMemo(() => {
    return companionCards.filter(card =>
      card.companions.some(c => c.userId === profile.id)
    );
  }, [companionCards, profile.id]);

  const filteredJoinedCards = useMemo(() => {
    return joinedCards.filter(card => {
      if (joinedFilter === 'pending') {
        const myComp = card.companions.find(c => c.userId === profile.id);
        return myComp && !myComp.isConfirmed;
      }
      if (joinedFilter === 'confirmed') {
        const myComp = card.companions.find(c => c.userId === profile.id);
        return myComp && myComp.isConfirmed;
      }
      if (joinedFilter === 'ended') {
        return card.status === 'completed';
      }
      return true;
    });
  }, [joinedCards, joinedFilter, profile.id]);

  const publishedCards = useMemo(() => {
    return companionCards.filter(c => c.publisherId === profile.id).filter(card => {
      if (publishedFilter === 'pending') {
        return card.companions.some(c => !c.isConfirmed);
      }
      if (publishedFilter === 'confirmed') {
        return card.companions.length > 0 && card.companions.every(c => c.isConfirmed);
      }
      if (publishedFilter === 'ended') {
        return card.status === 'completed';
      }
      return true;
    });
  }, [companionCards, publishedFilter, profile.id]);

  const filteredCards = useMemo(() => {
    let baseCards = companionCards;

    if (activeTab === 'published') {
      baseCards = publishedCards;
    } else if (activeTab === 'joined') {
      baseCards = filteredJoinedCards;
    }

    const filtered = baseCards.filter((card) => {
      if (selectedCity !== '全部' && card.targetCity !== selectedCity) return false;
      if (selectedType !== 'all' && card.scriptType !== selectedType) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      const aIsEnded = a.status === 'completed';
      const bIsEnded = b.status === 'completed';
      if (aIsEnded !== bIsEnded) return aIsEnded ? 1 : -1;

      if (sortMode === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return a.targetCity.localeCompare(b.targetCity, 'zh');
      }
    });
  }, [companionCards, activeTab, selectedCity, selectedType, filteredJoinedCards, publishedCards, sortMode]);

  const handlePublish = () => {
    console.log('[CompanionPage] 点击发布约伴卡');
    Taro.navigateTo({
      url: '/pages/publish-card/index'
    });
  };

  const scriptTypes = [
    { key: 'all' as const, label: '全部类型' },
    ...Object.entries(scriptTypeLabels).map(([key, label]) => ({ key: key as ScriptType, label }))
  ];

  const filterCities = ['全部', ...cities.filter(c => c !== '全部')];

  const joinedFilters: { key: JoinedFilter; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待确认' },
    { key: 'confirmed', label: '已确认' },
    { key: 'ended', label: '已结束' }
  ];

  const getEmptyText = () => {
    if (activeTab === 'published') return '你还没有发布约伴卡';
    if (activeTab === 'joined') {
      if (joinedFilter === 'pending') return '暂无待确认的约伴';
      if (joinedFilter === 'confirmed') return '暂无已确认的约伴';
      if (joinedFilter === 'ended') return '暂无已结束的约伴';
      return '你还没有参与任何约伴';
    }
    return '暂无符合条件的约伴卡';
  };

  return (
    <ScrollView scrollY className={styles.companionPage}>
      <View className="pageContainer">
        <View className={styles.pageHeader}>
          <Text className={styles.pageTitle}>找搭子</Text>
          <Button className={styles.publishBtn} onClick={handlePublish}>
            <Text className={styles.publishBtnText}>+ 发布约伴</Text>
          </Button>
        </View>

        <View className={styles.tabBar}>
          <View
            className={classnames(styles.tabItem, activeTab === 'all' && styles.tabItemActive)}
            onClick={() => setActiveTab('all')}
          >
            <Text className={styles.tabText}>全部约伴</Text>
          </View>
          <View
            className={classnames(styles.tabItem, activeTab === 'published' && styles.tabItemActive)}
            onClick={() => setActiveTab('published')}
          >
            <Text className={styles.tabText}>我的发布</Text>
            {pendingIntentions > 0 && (
              <View className={styles.notificationDot}>
                <Text className={styles.notificationDotText}>{pendingIntentions}</Text>
              </View>
            )}
          </View>
          <View
            className={classnames(styles.tabItem, activeTab === 'joined' && styles.tabItemActive)}
            onClick={() => setActiveTab('joined')}
          >
            <Text className={styles.tabText}>我的参与</Text>
            {myJoinedPendingCount > 0 && (
              <View className={styles.notificationDot}>
                <Text className={styles.notificationDotText}>{myJoinedPendingCount}</Text>
              </View>
            )}
          </View>
        </View>

        {(activeTab === 'joined' || activeTab === 'published') && (
          <View className={styles.subFilterBar}>
            {joinedFilters.map((f) => (
              <View
                key={f.key}
                className={classnames(styles.subFilterItem, (activeTab === 'joined' ? joinedFilter : publishedFilter) === f.key && styles.subFilterItemActive)}
                onClick={() => {
                  if (activeTab === 'joined') setJoinedFilter(f.key);
                  else setPublishedFilter(f.key);
                }}
              >
                <Text className={(activeTab === 'joined' ? joinedFilter : publishedFilter) === f.key ? styles.subFilterTextActive : styles.subFilterText}>
                  {f.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        {(activeTab === 'joined' || activeTab === 'published') && (
          <View className={styles.sortBar}>
            <Text className={styles.sortLabel}>排序：</Text>
            <View
              className={classnames(styles.sortOption, sortMode === 'date' && styles.sortOptionActive)}
              onClick={() => setSortMode('date')}
            >
              <Text className={sortMode === 'date' ? styles.sortTextActive : styles.sortText}>📅 按日期</Text>
            </View>
            <View
              className={classnames(styles.sortOption, sortMode === 'city' && styles.sortOptionActive)}
              onClick={() => setSortMode('city')}
            >
              <Text className={sortMode === 'city' ? styles.sortTextActive : styles.sortText}>🏙️ 按城市</Text>
            </View>
          </View>
        )}

        <ScrollView scrollX className={styles.filterScroll}>
          {filterCities.map((city) => (
            <View
              key={city}
              className={classnames(styles.filterTag, selectedCity === city && styles.filterTagActive)}
              onClick={() => setSelectedCity(city)}
            >
              <Text className={styles.filterTagText}>{city}</Text>
            </View>
          ))}
        </ScrollView>

        <ScrollView scrollX className={styles.filterScroll}>
          {scriptTypes.map((type) => (
            <View
              key={type.key}
              className={classnames(styles.filterTag, selectedType === type.key && styles.filterTagActive)}
              onClick={() => setSelectedType(type.key)}
            >
              <Text className={styles.filterTagText}>{type.label}</Text>
            </View>
          ))}
        </ScrollView>

        {filteredCards.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyText}>{getEmptyText()}</Text>
            {(activeTab === 'published' || activeTab === 'all') && (
              <Button className={styles.emptyBtn} onClick={handlePublish}>
                <Text className={styles.emptyBtnText}>发布第一个约伴卡</Text>
              </Button>
            )}
          </View>
        ) : (
          <View className={styles.cardList}>
            {filteredCards.map((card) => (
              <CompanionCardComponent key={card.id} card={card} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CompanionPage;

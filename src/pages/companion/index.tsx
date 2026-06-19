import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockCompanionCards } from '../../data/companionCards';
import { cities } from '../../data/games';
import { scriptTypeLabels, type ScriptType } from '../../types/user';
import type { CompanionCard } from '../../types/companion';
import CompanionCardComponent from '../../components/CompanionCard';

const CompanionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [selectedCity, setSelectedCity] = useState('全部');
  const [selectedType, setSelectedType] = useState<ScriptType | 'all'>('all');
  const [cards, setCards] = useState<CompanionCard[]>([]);
  const [loading, setLoading] = useState(true);

  const pendingIntentions = 2;

  useEffect(() => {
    console.log('[CompanionPage] 页面加载，获取约伴卡数据');
    loadCards();
  }, []);

  const loadCards = () => {
    setLoading(true);
    setTimeout(() => {
      console.log('[CompanionPage] 约伴卡数据加载完成，共', mockCompanionCards.length, '条');
      setCards(mockCompanionCards);
      setLoading(false);
      Taro.stopPullDownRefresh();
    }, 500);
  };

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (activeTab === 'my' && card.publisherId !== 'me') return false;
      if (selectedCity !== '全部' && card.targetCity !== selectedCity) return false;
      if (selectedType !== 'all' && card.scriptType !== selectedType) return false;
      return true;
    });
  }, [cards, activeTab, selectedCity, selectedType]);

  const handlePublish = () => {
    console.log('[CompanionPage] 点击发布约伴卡');
    Taro.navigateTo({
      url: '/pages/publish-card/index'
    });
  };

  const handlePullDownRefresh = () => {
    console.log('[CompanionPage] 下拉刷新');
    loadCards();
  };

  useEffect(() => {
    Taro.onPullDownRefresh(handlePullDownRefresh);
    return () => {
      Taro.offPullDownRefresh(handlePullDownRefresh);
    };
  }, []);

  const scriptTypes = [
    { key: 'all' as const, label: '全部类型' },
    ...Object.entries(scriptTypeLabels).map(([key, label]) => ({ key: key as ScriptType, label }))
  ];

  const filterCities = ['全部', ...cities.filter(c => c !== '全部')];

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
            className={classnames(styles.tabItem, activeTab === 'my' && styles.tabItemActive)}
            onClick={() => setActiveTab('my')}
          >
            <Text className={styles.tabText}>我的约伴</Text>
            {pendingIntentions > 0 && (
              <View className={styles.notificationDot}>
                <Text className={styles.notificationDotText}>{pendingIntentions}</Text>
              </View>
            )}
          </View>
        </View>

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

        {loading ? (
          <Text className={styles.loadingText}>加载中...</Text>
        ) : filteredCards.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyText}>
              {activeTab === 'my' ? '你还没有发布约伴卡' : '暂无符合条件的约伴卡'}
            </Text>
            <Button className={styles.emptyBtn} onClick={handlePublish}>
              <Text className={styles.emptyBtnText}>发布第一个约伴卡</Text>
            </Button>
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

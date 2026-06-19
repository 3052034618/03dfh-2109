import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockGames } from '../../data/games';
import { useUserStore, calcMatchScore, type MatchReason } from '../../store/useUserStore';
import { scriptTypeLabels } from '../../types/user';
import type { ScriptType } from '../../types/user';
import type { TourGame } from '../../types/game';
import { isDateInRange } from '../../utils/date';
import GameCard from '../../components/GameCard';
import FilterBar from '../../components/FilterBar';

interface GameWithMatch extends TourGame {
  matchScore: number;
  matchReasons: MatchReason[];
}

const HomePage: React.FC = () => {
  const { profile } = useUserStore();
  const [games, setGames] = useState<TourGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '全部',
    date: '全部日期',
    scriptType: 'all' as ScriptType | 'all'
  });

  useEffect(() => {
    console.log('[HomePage] 页面加载，获取巡本局数据');
    loadGames();
  }, []);

  const loadGames = () => {
    setLoading(true);
    setTimeout(() => {
      console.log('[HomePage] 巡本局数据加载完成，共', mockGames.length, '条');
      setGames(mockGames);
      setLoading(false);
      Taro.stopPullDownRefresh();
    }, 500);
  };

  const filteredGames: GameWithMatch[] = useMemo(() => {
    return games
      .map((game) => {
        const { score, reasons } = calcMatchScore(
          game.city,
          game.scriptType as ScriptType,
          game.price,
          game.date,
          profile
        );
        return { ...game, matchScore: score, matchReasons: reasons };
      })
      .filter((game) => {
        if (filters.city !== '全部' && game.city !== filters.city) return false;
        if (filters.scriptType !== 'all' && game.scriptType !== filters.scriptType) return false;
        if (filters.date !== '全部日期' && !isDateInRange(game.date, filters.date)) return false;
        return true;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [games, filters, profile]);

  const handleFilterChange = (newFilters: typeof filters) => {
    console.log('[HomePage] 筛选条件变更:', newFilters);
    setFilters(newFilters);
  };

  const handlePublish = () => {
    console.log('[HomePage] 点击发布约伴卡');
    Taro.navigateTo({
      url: '/pages/publish-card/index'
    });
  };

  const handlePullDownRefresh = () => {
    console.log('[HomePage] 下拉刷新');
    loadGames();
  };

  useEffect(() => {
    Taro.onPullDownRefresh(handlePullDownRefresh);
    return () => {
      Taro.offPullDownRefresh(handlePullDownRefresh);
    };
  }, []);

  return (
    <ScrollView scrollY className={styles.homePage}>
      <View className="pageContainer">
        <View className={styles.welcomeSection}>
          <View className={styles.welcomeHeader}>
            <Image className={styles.avatar} src={profile.avatar} mode="aspectFill" />
            <View className={styles.welcomeText}>
              <Text className={styles.welcomeTitle}>嗨，{profile.nickname}</Text>
              <Text className={styles.welcomeSubtitle}>
                常驻 {profile.residentCity} · 本周末有空打本吗？
              </Text>
            </View>
          </View>
          <View className={styles.preferencesRow}>
            {profile.scriptPreferences.map((type) => (
              <View key={type} className={styles.prefTag}>
                <Text className={styles.prefTagText}>❤️ {scriptTypeLabels[type]}</Text>
              </View>
            ))}
            <View className={styles.prefTag}>
              <Text className={styles.prefTagText}>
                💰 车费¥{profile.budget.maxTransport} · 住宿¥{profile.budget.maxAccommodation}
              </Text>
            </View>
          </View>
        </View>

        <FilterBar onFilterChange={handleFilterChange} />

        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>为你推荐</Text>
          <Text className={styles.sectionCount}>{filteredGames.length} 个巡本局</Text>
        </View>

        {loading ? (
          <Text className={styles.loadingText}>加载中...</Text>
        ) : filteredGames.length === 0 ? (
          <Text className={styles.loadingText}>暂无匹配的巡本局，试试调整筛选条件</Text>
        ) : (
          <View className={styles.gameList}>
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </View>
        )}
      </View>

      <View className={styles.fab} onClick={handlePublish}>
        <Text className={styles.fabIcon}>+</Text>
        <Text className={styles.fabText}>发布约伴</Text>
      </View>
    </ScrollView>
  );
};

export default HomePage;

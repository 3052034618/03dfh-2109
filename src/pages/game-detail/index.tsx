import React, { useMemo } from 'react';
import { View, Text, Image, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockGames } from '../../data/games';
import { useUserStore, calcMatchScore, type MatchReason } from '../../store/useUserStore';
import { scriptTypeLabels } from '../../types/user';
import type { ScriptType } from '../../types/user';
import { formatDate } from '../../utils/date';
import Tag from '../../components/Tag';
import MatchBadge from '../../components/MatchBadge';

const GameDetailPage: React.FC = () => {
  const { profile } = useUserStore();

  const params = Taro.getCurrentInstance().router?.params;
  const gameId = params?.id || '';

  const game = useMemo(() => {
    return mockGames.find(g => g.id === gameId);
  }, [gameId]);

  const matchResult = useMemo(() => {
    if (!game) return { score: 0, reasons: [] as MatchReason[] };
    return calcMatchScore(
      game.city,
      game.scriptType as ScriptType,
      game.price,
      game.date,
      profile
    );
  }, [game, profile]);

  const handleJoin = () => {
    Taro.showToast({ title: '已加入兴趣列表', icon: 'success' });
  };

  const handlePublish = () => {
    if (!game) return;
    Taro.navigateTo({
      url: '/pages/publish-card/index'
    });
  };

  if (!game) {
    return (
      <View className={styles.page}>
        <View className="pageContainer">
          <Text className={styles.notFound}>局不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.coverWrap}>
        <Image className={styles.cover} src={game.coverImage} mode="aspectFill" />
        <View className={styles.matchBadgeWrap}>
          <MatchBadge score={matchResult.score} size="large" />
        </View>
        {game.isLimited && (
          <View className={styles.limitedTag}>
            <Text className={styles.limitedTagText}>限定本</Text>
          </View>
        )}
      </View>

      <View className="pageContainer">
        <View className={styles.infoSection}>
          <Text className={styles.title}>{game.title}</Text>
          <Text className={styles.scriptName}>《{game.scriptName}》</Text>

          <View className={styles.tagRow}>
            <Tag text={scriptTypeLabels[game.scriptType]} type="primary" size="small" />
            {game.tags.slice(0, 3).map((tag, idx) => (
              <Tag key={idx} text={tag} type="default" size="small" />
            ))}
          </View>

          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>城市</Text>
              <Text className={styles.infoValue}>{game.city}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>时间</Text>
              <Text className={styles.infoValue}>{formatDate(game.date)} {game.time}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>人数</Text>
              <Text className={styles.infoValue}>{game.currentPlayers}/{game.totalPlayers}人</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>票价</Text>
              <Text className={styles.priceText}>¥{game.price}</Text>
            </View>
          </View>
        </View>

        <View className={styles.storeSection}>
          <Text className={styles.sectionTitle}>店家信息</Text>
          <Text className={styles.storeName}>{game.storeName}</Text>
          <Text className={styles.storeAddress}>{game.storeAddress}</Text>
          <View className={styles.storeMeta}>
            <Tag text={game.difficulty} type="warning" size="small" />
            <Tag text={`时长${game.duration}小时`} type="default" size="small" />
          </View>
        </View>

        <View className={styles.matchSection}>
          <View className={styles.matchHeader}>
            <Text className={styles.sectionTitle}>匹配度分析</Text>
            <Text className={styles.matchScore}>
              <Text className={styles.matchScoreNum}>{matchResult.score}</Text>
              <Text className={styles.matchScoreUnit}>分</Text>
            </Text>
          </View>

          <View className={styles.matchList}>
            {matchResult.reasons.map((reason) => (
              <View key={reason.key} className={styles.matchItem}>
                <View
                  className={classnames(
                    styles.matchDot,
                    reason.match ? styles.matchDotMatch : styles.matchDotMismatch
                  )}
                />
                <View className={styles.matchContent}>
                  <Text
                    className={classnames(
                      styles.matchLabel,
                      reason.match && styles.matchLabelMatch
                    )}
                  >
                    {reason.label}
                  </Text>
                  <Text className={styles.matchScoreTag}>+{reason.score}分</Text>
                </View>
              </View>
            ))}
          </View>

          <View className={styles.matchTip}>
            <Text className={styles.matchTipText}>
              💡 匹配度基于你的常驻城市、剧本偏好、预算和可出行时间计算
            </Text>
          </View>
        </View>

        <View className={styles.descSection}>
          <Text className={styles.sectionTitle}>剧本简介</Text>
          <Text className={styles.descText}>{game.description}</Text>
        </View>

        <View className={styles.bottomBtns}>
          <Button className={styles.secondaryBtn} onClick={handleJoin}>
            <Text className={styles.secondaryBtnText}>感兴趣</Text>
          </Button>
          <Button className={styles.primaryBtn} onClick={handlePublish}>
            <Text className={styles.primaryBtnText}>发布约伴卡</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default GameDetailPage;

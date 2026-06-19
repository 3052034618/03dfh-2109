import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import type { TourGame } from '../../types/game';
import { scriptTypeLabels } from '../../types/user';
import { formatDate } from '../../utils/date';
import Tag from '../Tag';
import MatchBadge from '../MatchBadge';

interface GameCardProps {
  game: TourGame;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const handleClick = () => {
    console.log('[GameCard] 点击局详情:', game.id, game.title);
    Taro.navigateTo({
      url: `/pages/game-detail/index?id=${game.id}`
    });
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.coverWrapper}>
        <Image className={styles.cover} src={game.coverImage} mode="aspectFill" />
        {game.isLimited && (
          <View className={styles.limitedBadge}>
            <Text className={styles.limitedText}>限定</Text>
          </View>
        )}
        <View className={styles.matchBadgeWrapper}>
          <MatchBadge score={game.matchScore} />
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.title}>{game.title}</Text>
        </View>

        <View className={styles.metaRow}>
          <View className={styles.metaItem}>
            <Text className={styles.metaLabel}>剧本</Text>
            <Text className={styles.metaValue}>{game.scriptName}</Text>
          </View>
          <Tag text={scriptTypeLabels[game.scriptType]} type="primary" size="small" />
        </View>

        <View className={styles.metaRow}>
          <View className={styles.metaItem}>
            <Text className={styles.metaLabel}>城市</Text>
            <Text className={styles.metaValue}>{game.city}</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaLabel}>时间</Text>
            <Text className={styles.metaValue}>{formatDate(game.date)} {game.time}</Text>
          </View>
        </View>

        <View className={styles.tagsRow}>
          {game.tags.slice(0, 4).map((tag, index) => (
            <Tag key={index} text={tag} type="default" size="small" />
          ))}
        </View>

        <View className={styles.footer}>
          <View className={styles.priceInfo}>
            <Text className={styles.priceLabel}>票价</Text>
            <Text className={styles.price}>¥{game.price}</Text>
            <Text className={styles.deposit}>(定金¥{game.deposit})</Text>
          </View>
          <View className={styles.playerInfo}>
            <Text className={styles.playerCount}>
              {game.currentPlayers}/{game.totalPlayers}人
            </Text>
            <View className={styles.progressBar}>
              <View
                className={styles.progressFill}
                style={{ width: `${(game.currentPlayers / game.totalPlayers) * 100}%` }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default GameCard;

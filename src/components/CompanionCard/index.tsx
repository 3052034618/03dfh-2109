import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { CompanionCard as ICompanionCard, IntentionType } from '../../types/companion';
import { scriptTypeLabels } from '../../types/user';
import { formatDate } from '../../utils/date';
import Tag from '../Tag';

interface CompanionCardProps {
  card: ICompanionCard;
}

const intentionLabels: Record<IntentionType, string> = {
  travel: '仅同行',
  table: '同桌',
  room: '同住',
  all: '全部'
};

const CompanionCardComponent: React.FC<CompanionCardProps> = ({ card }) => {
  const handleClick = () => {
    console.log('[CompanionCard] 点击约伴卡详情:', card.id, card.scriptName);
    Taro.navigateTo({
      url: `/pages/card-detail/index?id=${card.id}`
    });
  };

  const confirmedCount = card.companions.filter(c => c.isConfirmed).length;
  const scriptType = card.scriptType as keyof typeof scriptTypeLabels;

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <View className={styles.publisher}>
          <Image className={styles.avatar} src={card.publisherAvatar} mode="aspectFill" />
          <View className={styles.publisherInfo}>
            <Text className={styles.publisherName}>{card.publisherName}</Text>
            <Text className={styles.publishTime}>发布于 {formatDate(card.createdAt)}</Text>
          </View>
        </View>
        <View className={classnames(styles.statusBadge, styles[`status${card.status.charAt(0).toUpperCase() + card.status.slice(1)}]}>
          <Text className={styles.statusText}>
            {card.status === 'open' ? '招募中' : card.status === 'full' ? '已满' : '已完成'}
          </Text>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.titleRow}>
          <Text className={styles.cityLabel}>{card.targetCity}</Text>
          <Text className={styles.scriptName}>《{card.scriptName}》</Text>
        </View>

        <View className={styles.metaRow}>
          <Tag text={scriptTypeLabels[scriptType] || card.scriptType} type="primary" size="small" />
          <Tag text={formatDate(card.date)} type="default" size="small" />
          <Tag text={`预算¥${card.budget}`} type="default" size="small" />
        </View>

        <View className={styles.optionRow}>
          {card.acceptShareRoom && <Tag text="接受拼房" type="success" size="small" />}
          {card.acceptShareCar && <Tag text="接受拼车" type="success" size="small" />}
        </View>

        <Text className={styles.description}>
          {card.description}
        </Text>
      </View>

      <View className={styles.footer}>
        <View className={styles.players}>
          <View className={styles.playerAvatars}>
            <View className={styles.avatarsRow}>
              {card.companions.slice(0, 4).map((comp, index) => (
                <Image
                  key={index}
                  className={styles.playerAvatar}
                  src={comp.avatar}
                  mode="aspectFill"
                />
              ))}
            </View>
          </View>
          <Text className={styles.playerCount}>
            已确认 {confirmedCount}/{card.totalRoles - card.missingRoles}/{card.totalRoles}人
          </Text>
        </View>
        <View className={styles.missing}>
          <Text className={styles.missingLabel}>缺</Text>
          <Text className={styles.missingCount}>{card.missingRoles}</Text>
          <Text className={styles.missingLabel}>人</Text>
        </View>
      </View>
    </View>
  );
};

export default CompanionCardComponent;

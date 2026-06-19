import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface MatchBadgeProps {
  score: number;
}

const MatchBadge: React.FC<MatchBadgeProps> = ({ score }) => {
  const getLevel = () => {
    if (score >= 85) return { type: 'high', text: '高度匹配', color: 'high' };
    if (score >= 70) return { type: 'medium', text: '较为匹配', color: 'medium' };
    return { type: 'low', text: '一般匹配', color: 'low' };
  };

  const level = getLevel();

  return (
    <View className={classnames(styles.badge, styles[`badge${level.color.charAt(0).toUpperCase() + level.color.slice(1)}`])}>
      <Text className={styles.score}>{score}</Text>
      <Text className={styles.label}>匹配度</Text>
    </View>
  );
};

export default MatchBadge;

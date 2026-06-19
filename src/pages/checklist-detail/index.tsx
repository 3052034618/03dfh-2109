import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const ChecklistDetailPage: React.FC = () => {
  return (
    <View className={styles.placeholderPage}>
      <Text className={styles.icon}>✅</Text>
      <Text className={styles.title}>行前清单</Text>
      <Text className={styles.message}>功能正在开发中...</Text>
    </View>
  );
};

export default ChecklistDetailPage;

import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const PublishCardPage: React.FC = () => {
  return (
    <View className={styles.placeholderPage}>
      <Text className={styles.icon}>📝</Text>
      <Text className={styles.title}>发布约伴卡</Text>
      <Text className={styles.message}>功能正在开发中...</Text>
    </View>
  );
};

export default PublishCardPage;

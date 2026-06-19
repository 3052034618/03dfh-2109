import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const EditProfilePage: React.FC = () => {
  return (
    <View className={styles.placeholderPage}>
      <Text className={styles.icon}>👤</Text>
      <Text className={styles.title}>编辑资料</Text>
      <Text className={styles.message}>功能正在开发中...</Text>
    </View>
  );
};

export default EditProfilePage;

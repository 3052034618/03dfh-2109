import React from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useUserStore } from '../../store/useUserStore';
import { scriptTypeLabels } from '../../types/user';
import { formatDate } from '../../utils/date';

const ProfilePage: React.FC = () => {
  const { profile } = useUserStore();

  const handleEditProfile = () => {
    console.log('[ProfilePage] 点击编辑资料');
    Taro.navigateTo({
      url: '/pages/edit-profile/index'
    });
  };

  const handleMenuClick = (menu: string) => {
    console.log('[ProfilePage] 点击菜单:', menu);
    Taro.showToast({
      title: `${menu}功能开发中`,
      icon: 'none'
    });
  };

  const menuItems = [
    { icon: '❤️', text: '我的收藏' },
    { icon: '📝', text: '打本记录' },
    { icon: '👥', text: '我的好友' },
    { icon: '⚙️', text: '设置' },
    { icon: '❓', text: '帮助与反馈' },
    { icon: 'ℹ️', text: '关于我们' }
  ];

  return (
    <ScrollView scrollY className={styles.profilePage}>
      <View className="pageContainer">
        <View className={styles.profileHeader}>
          <View className={styles.profileInfo}>
            <Image className={styles.avatar} src={profile.avatar} mode="aspectFill" />
            <View className={styles.infoContent}>
              <Text className={styles.nickname}>{profile.nickname}</Text>
              <Text className={styles.location}>
                📍 常驻 {profile.residentCity} · {profile.age}岁
              </Text>
              <Text className={styles.bio}>{profile.bio}</Text>
            </View>
            <Button className={styles.editBtn} onClick={handleEditProfile}>
              <Text className={styles.editBtnText}>编辑</Text>
            </Button>
          </View>
        </View>

        <View className={styles.statsCard}>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>12</Text>
            <Text className={styles.statLabel}>打本次数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>28</Text>
            <Text className={styles.statLabel}>同行人数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>6</Text>
            <Text className={styles.statLabel}>去过城市</Text>
          </View>
        </View>

        <View className={styles.preferencesSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>我的偏好</Text>
            <Text className={styles.sectionLink} onClick={handleEditProfile}>修改</Text>
          </View>

          <View className={styles.preferenceRow}>
            <Text className={styles.preferenceLabel}>喜欢的剧本类型</Text>
            <View className={styles.preferenceTags}>
              {profile.scriptPreferences.map((type) => (
                <View key={type} className={styles.preferenceTag}>
                  <Text className={styles.preferenceTagText}>
                    {scriptTypeLabels[type]}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.preferenceRow}>
            <Text className={styles.preferenceLabel}>可出行周末</Text>
            <View className={styles.preferenceTags}>
              {profile.availableWeekends.map((date) => (
                <View key={date} className={styles.preferenceTag}>
                  <Text className={styles.preferenceTagText}>
                    {formatDate(date)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.preferenceRow}>
            <Text className={styles.preferenceLabel}>预算设置</Text>
            <View className={styles.preferenceTags}>
              <View className={styles.preferenceTag}>
                <Text className={styles.preferenceTagText}>
                  车费 ¥{profile.budget.maxTransport}
                </Text>
              </View>
              <View className={styles.preferenceTag}>
                <Text className={styles.preferenceTagText}>
                  住宿 ¥{profile.budget.maxAccommodation}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.menuSection}>
          {menuItems.map((item, index) => (
            <View
              key={index}
              className={styles.menuItem}
              onClick={() => handleMenuClick(item.text)}
            >
              <View className={styles.menuLeft}>
                <Text className={styles.menuIcon}>{item.icon}</Text>
                <Text className={styles.menuText}>{item.text}</Text>
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;

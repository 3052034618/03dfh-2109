import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '../../store/useAppStore';
import { useUserStore } from '../../store/useUserStore';
import { scriptTypeLabels } from '../../types/user';
import type { IntentionType } from '../../types/companion';
import { formatDate } from '../../utils/date';
import Tag from '../../components/Tag';

const intentionOptions: { type: IntentionType; label: string; desc: string }[] = [
  { type: 'travel', label: '仅同行', desc: '一起出发，不拼房' },
  { type: 'table', label: '同桌', desc: '一起打本' },
  { type: 'room', label: '同住', desc: '可拼房住宿' },
  { type: 'all', label: '全部', desc: '同行+同桌+同住' }
];

const CardDetailPage: React.FC = () => {
  const { companionCards, addIntention, confirmIntention } = useAppStore();
  const { profile } = useUserStore();
  const [selectedIntention, setSelectedIntention] = useState<IntentionType | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const params = Taro.getCurrentInstance().router?.params;
  const cardId = params?.id || '';

  const card = useMemo(() => {
    return companionCards.find(c => c.id === cardId);
  }, [companionCards, cardId]);

  const myIntention = useMemo(() => {
    if (!card) return null;
    return card.companions.find(c => c.userId === profile.id);
  }, [card, profile.id]);

  const isPublisher = card?.publisherId === profile.id;
  const confirmedCompanions = card?.companions.filter(c => c.isConfirmed) || [];
  const pendingCompanions = card?.companions.filter(c => !c.isConfirmed) || [];

  const handleExpressIntention = () => {
    if (!selectedIntention || !card) return;

    const companion = {
      id: `comp_${Date.now()}`,
      userId: profile.id,
      nickname: profile.nickname,
      avatar: profile.avatar,
      intention: selectedIntention,
      isConfirmed: false,
      city: profile.residentCity,
      wechatId: profile.wechatId,
      phone: profile.phone
    };

    addIntention(card.id, companion);
    setHasSubmitted(true);
    console.log('[CardDetailPage] 表达意向:', selectedIntention, 'cardId:', card.id);
    Taro.showToast({ title: '意向已发送，等待确认', icon: 'none' });
  };

  const handleConfirm = (companionId: string) => {
    if (!card) return;
    confirmIntention(card.id, companionId);
    console.log('[CardDetailPage] 确认同伴:', companionId);
    Taro.showToast({ title: '已确认', icon: 'success' });
  };

  if (!card) {
    return (
      <View className={styles.page}>
        <View className="pageContainer">
          <Text className={styles.notFound}>约伴卡不存在</Text>
        </View>
      </View>
    );
  }

  const scriptType = card.scriptType as keyof typeof scriptTypeLabels;
  const showPublisherContact = isPublisher || (myIntention?.isConfirmed ?? false);
  const showCompanionContact = isPublisher;

  return (
    <View className={styles.page}>
      <View className="pageContainer">
        <View className={styles.publisherSection}>
          <Image className={styles.publisherAvatar} src={card.publisherAvatar} mode="aspectFill" />
          <View className={styles.publisherInfo}>
            <Text className={styles.publisherName}>{card.publisherName}</Text>
            <Text className={styles.publishTime}>发布于 {formatDate(card.createdAt)}</Text>
          </View>
          <View className={classnames(styles.statusBadge, styles[`status${card.status.charAt(0).toUpperCase() + card.status.slice(1)}`])}>
            <Text className={styles.statusText}>
              {card.status === 'open' ? '招募中' : card.status === 'full' ? '已满' : '已完成'}
            </Text>
          </View>
        </View>

        <View className={styles.infoCard}>
          <View className={styles.titleRow}>
            <Text className={styles.cityLabel}>{card.targetCity}</Text>
            <Text className={styles.scriptName}>《{card.scriptName}》</Text>
          </View>

          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>类型</Text>
              <Tag text={scriptTypeLabels[scriptType] || card.scriptType} type="primary" size="small" />
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>日期</Text>
              <Text className={styles.infoValue}>{formatDate(card.date)}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>缺人</Text>
              <Text className={styles.infoValue}>{card.missingRoles}/{card.totalRoles}人</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>预算</Text>
              <Text className={styles.infoValue}>¥{card.budget}</Text>
            </View>
          </View>

          <View className={styles.optionRow}>
            {card.acceptShareRoom && <Tag text="接受拼房" type="success" size="small" />}
            {card.acceptShareCar && <Tag text="接受拼车" type="success" size="small" />}
          </View>

          <Text className={styles.description}>{card.description}</Text>
        </View>

        {showPublisherContact && (
          <View className={styles.contactSection}>
            <Text className={styles.sectionTitle}>
              {isPublisher ? '我的联系方式' : '发布者联系方式'}
            </Text>
            <View className={styles.contactCard}>
              <View className={styles.contactItem}>
                <Text className={styles.contactLabel}>微信号</Text>
                <Text className={styles.contactValue}>{card.publisherWechat || '暂无'}</Text>
              </View>
              <View className={styles.contactItem}>
                <Text className={styles.contactLabel}>手机号</Text>
                <Text className={styles.contactValue}>{card.publisherPhone || '暂无'}</Text>
              </View>
            </View>
          </View>
        )}

        {!isPublisher && !myIntention && !hasSubmitted && card.status === 'open' && (
          <View className={styles.intentionSection}>
            <Text className={styles.sectionTitle}>选择同行意向</Text>
            <View className={styles.intentionOptions}>
              {intentionOptions.map((opt) => (
                <View
                  key={opt.type}
                  className={classnames(
                    styles.intentionOption,
                    selectedIntention === opt.type && styles.intentionOptionActive
                  )}
                  onClick={() => setSelectedIntention(opt.type)}
                >
                  <Text className={styles.intentionLabel}>{opt.label}</Text>
                  <Text className={styles.intentionDesc}>{opt.desc}</Text>
                </View>
              ))}
            </View>
            <Button
              className={classnames(styles.submitBtn, !selectedIntention && styles.submitBtnDisabled)}
              onClick={handleExpressIntention}
              disabled={!selectedIntention}
            >
              <Text className={styles.submitBtnText}>表达意向</Text>
            </Button>
          </View>
        )}

        {myIntention && !myIntention.isConfirmed && (
          <View className={styles.waitingSection}>
            <Text className={styles.waitingIcon}>⏳</Text>
            <Text className={styles.waitingText}>
              你已选择「{intentionOptions.find(o => o.type === myIntention.intention)?.label}」意向，等待对方确认
            </Text>
            <Text className={styles.waitingHint}>对方确认后将自动解锁联系方式</Text>
          </View>
        )}

        {myIntention && myIntention.isConfirmed && (
          <View className={styles.successSection}>
            <Text className={styles.successIcon}>✅</Text>
            <Text className={styles.successText}>已确认同行，上面已显示发布者联系方式</Text>
          </View>
        )}

        <View className={styles.companionsSection}>
          <Text className={styles.sectionTitle}>
            同行者（{confirmedCompanions.length + pendingCompanions.length}人）
          </Text>

          {confirmedCompanions.length > 0 && (
            <View className={styles.companionGroup}>
              <Text className={styles.groupLabel}>已确认</Text>
              {confirmedCompanions.map((comp) => (
                <View key={comp.id} className={styles.companionItem}>
                  <Image className={styles.companionAvatar} src={comp.avatar} mode="aspectFill" />
                  <View className={styles.companionInfo}>
                    <Text className={styles.companionName}>{comp.nickname}</Text>
                    <Text className={styles.companionCity}>{comp.city}</Text>
                  </View>
                  <Tag
                    text={intentionOptions.find(o => o.type === comp.intention)?.label || ''}
                    type="primary"
                    size="small"
                  />
                  {showCompanionContact && comp.wechatId && (
                    <View className={styles.compContact}>
                      <Text className={styles.compContactText}>微信: {comp.wechatId}</Text>
                      {comp.phone && <Text className={styles.compContactText}>手机: {comp.phone}</Text>}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {pendingCompanions.length > 0 && (
            <View className={styles.companionGroup}>
              <Text className={styles.groupLabel}>待确认</Text>
              {pendingCompanions.map((comp) => (
                <View key={comp.id} className={styles.companionItem}>
                  <Image className={styles.companionAvatar} src={comp.avatar} mode="aspectFill" />
                  <View className={styles.companionInfo}>
                    <Text className={styles.companionName}>{comp.nickname}</Text>
                    <Text className={styles.companionCity}>
                      {comp.city} · {intentionOptions.find(o => o.type === comp.intention)?.label}
                    </Text>
                  </View>
                  {isPublisher ? (
                    <Button className={styles.confirmBtn} onClick={() => handleConfirm(comp.id)}>
                      <Text className={styles.confirmBtnText}>确认</Text>
                    </Button>
                  ) : comp.userId === profile.id ? (
                    <Tag text="等待确认" type="warning" size="small" />
                  ) : (
                    <Tag text="待确认" type="warning" size="small" />
                  )}
                </View>
              ))}
            </View>
          )}

          {card.companions.length === 0 && (
            <Text className={styles.emptyText}>暂无同行者，成为第一个吧</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default CardDetailPage;

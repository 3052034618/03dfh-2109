import React, { useMemo, useState } from 'react';
import { View, Text, Image, Picker, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '../../store/useAppStore';
import { useUserStore } from '../../store/useUserStore';
import type { ChecklistCategory } from '../../types/trip';
import { categoryLabels, messageCategoryLabels } from '../../types/trip';
import { formatDate, formatDateTime, formatTime } from '../../utils/date';

const categoryOrder: ChecklistCategory[] = ['beforeDeparture', 'beforeArrival', 'afterReturn'];
const categoryIcons: Record<ChecklistCategory, string> = {
  beforeDeparture: '🚀',
  beforeArrival: '🏪',
  afterReturn: '🏠'
};

const msgCategories = ['all', 'booking', 'hotel', 'store', 'other'];

const ChecklistDetailPage: React.FC = () => {
  const { trips, toggleChecklistItem, setChecklistItemAssignee, companionCards, addTripMessage } = useAppStore();
  const { profile } = useUserStore();

  const params = Taro.getCurrentInstance().router?.params;
  const tripId = params?.id || '';
  const [assignTargetItemId, setAssignTargetItemId] = useState<string | null>(null);
  const [taskFilterAssignee, setTaskFilterAssignee] = useState<string>('all');
  const [msgCategory, setMsgCategory] = useState<string>('all');
  const [newMessage, setNewMessage] = useState('');

  const trip = useMemo(() => {
    return trips.find(t => t.id === tripId);
  }, [trips, tripId]);

  const linkedCard = useMemo(() => {
    if (!trip?.sourceCardId) return null;
    return companionCards.find(c => c.id === trip.sourceCardId);
  }, [trip, companionCards]);

  if (!trip) {
    return (
      <View className={styles.page}>
        <View className="pageContainer">
          <Text className={styles.notFound}>行程不存在</Text>
        </View>
      </View>
    );
  }

  const completedCount = trip.checklist.filter(i => i.isCompleted).length;
  const totalCount = trip.checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const pendingCount = totalCount - completedCount;

  const filteredChecklist = useMemo(() => {
    if (taskFilterAssignee === 'all') return trip.checklist;
    return trip.checklist.filter(item => item.assigneeId === taskFilterAssignee);
  }, [trip.checklist, taskFilterAssignee]);

  const groupedItems = categoryOrder.map(category => ({
    category,
    label: categoryLabels[category],
    icon: categoryIcons[category],
    items: filteredChecklist.filter(item => item.category === category),
    completedInGroup: filteredChecklist.filter(item => item.category === category && item.isCompleted).length
  }));

  const sortedMessages = useMemo(() => {
    let list = [...trip.messages];
    if (msgCategory !== 'all') {
      list = list.filter(m => m.category === msgCategory);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [trip.messages, msgCategory]);

  const handleToggle = (itemId: string) => {
    toggleChecklistItem(trip.id, itemId);
  };

  const handleAssign = (itemId: string) => {
    setAssignTargetItemId(itemId);
  };

  const handlePickAssignee = (e: any) => {
    if (!assignTargetItemId) return;
    const idx = parseInt(e.detail.value);
    const member = trip.companions[idx];
    if (member) {
      setChecklistItemAssignee(trip.id, assignTargetItemId, member.id, member.nickname);
    }
    setAssignTargetItemId(null);
  };

  const handleOpenCard = () => {
    if (linkedCard) {
      Taro.navigateTo({
        url: `/pages/card-detail/index?id=${linkedCard.id}`
      });
    }
  };

  const handleOpenExpense = () => {
    Taro.navigateTo({
      url: `/pages/expense-detail/index?id=${trip.id}`
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const category = msgCategory === 'all' ? 'other' : msgCategory;
    addTripMessage(trip.id, {
      userId: profile.id,
      userName: profile.nickname,
      userAvatar: profile.avatar,
      content: newMessage.trim(),
      category: category as any
    });
    setNewMessage('');
  };

  const handleMemberClick = (memberId: string) => {
    setTaskFilterAssignee(prev => prev === memberId ? 'all' : memberId);
  };

  const companionNames = trip.companions.map(c => c.nickname);
  const membersWithContacts = trip.companions.filter(c => (c.wechatId && c.wechatId.trim() !== '') || (c.phone && c.phone.trim() !== ''));

  const totalExpense = trip.expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPerson = trip.companions.length > 0 ? Math.round(totalExpense / trip.companions.length) : 0;

  return (
    <View className={styles.page}>
      <View className="pageContainer">
        <View className={styles.tripHeader}>
          <Text className={styles.tripTitle}>{trip.title}</Text>
          <View className={styles.tripMeta}>
            <Text className={styles.tripMetaText}>{trip.city} · {formatDate(trip.date)} · {trip.time}</Text>
          </View>
          <View className={styles.storeInfo}>
            <Text className={styles.storeName}>{trip.storeName}</Text>
            <Text className={styles.storeAddress}>{trip.storeAddress}</Text>
          </View>

          {linkedCard && (
            <View className={styles.cardLinkRow} onClick={handleOpenCard}>
              <Text className={styles.cardLinkIcon}>📋</Text>
              <Text className={styles.cardLinkText}>关联约伴卡</Text>
              <Text className={styles.cardLinkArrow}>→</Text>
            </View>
          )}

          {(trip.acceptShareRoom || trip.acceptShareCar) && (
            <View className={styles.shareRow}>
              {trip.acceptShareRoom && <Text className={styles.shareTag}>🏨 接受拼房</Text>}
              {trip.acceptShareCar && <Text className={styles.shareTag}>🚗 接受拼车</Text>}
            </View>
          )}
        </View>

        <View className={styles.progressCard}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressTitle}>行前准备进度</Text>
            <Text className={styles.progressCount}>{completedCount}/{totalCount}</Text>
          </View>
          <View className={styles.progressBar}>
            <View className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </View>
          <View className={styles.progressStats}>
            <Text className={styles.statText}>已完成 {completedCount} 项</Text>
            <Text className={classnames(styles.statText, styles.statPending)}>待办 {pendingCount} 项</Text>
          </View>
        </View>

        {trip.companions.length > 0 && (
          <View className={styles.teamSection}>
            <View className={styles.sectionHeaderRow}>
            <Text className={styles.sectionTitle}>同行协作（{trip.companions.length}人）</Text>
            {taskFilterAssignee !== 'all' && (
              <Text className={styles.filterReset} onClick={() => setTaskFilterAssignee('all')}>
                查看全部任务
              </Text>
            )}
          </View>
          <View className={styles.teamList}>
            {trip.companions.map((member) => {
              const itemsAssigned = trip.checklist.filter(i => i.assigneeId === member.id);
              const itemsCompleted = itemsAssigned.filter(i => i.isCompleted).length;
              const hasContact = (member.wechatId && member.wechatId.trim() !== '') || (member.phone && member.phone.trim() !== '');
              const isActive = taskFilterAssignee === member.id;
              return (
                <View
                  key={member.id}
                  className={classnames(styles.teamMember, isActive && styles.teamMemberActive)}
                  onClick={() => handleMemberClick(member.id)}
                >
                  <Image className={styles.memberAvatar} src={member.avatar} mode="aspectFill" />
                  <View className={styles.memberInfo}>
                    <Text className={styles.memberName}>{member.nickname}</Text>
                    <Text className={styles.memberTaskCount}>
                      负责 {itemsAssigned.length} 项 · 已完成 {itemsCompleted}
                    </Text>
                    {hasContact && (
                      <View className={styles.memberContactRow}>
                        {member.wechatId && member.wechatId.trim() !== '' && (
                          <Text className={styles.memberContactTag}>微信 {member.wechatId}</Text>
                        )}
                        {member.phone && member.phone.trim() !== '' && (
                          <Text className={styles.memberContactTag}>手机 {member.phone}</Text>
                        )}
                      </View>
                    )}
                  </View>
                  {itemsAssigned.length > 0 && (
                    <Text className={styles.memberArrow}>{isActive ? '▼' : '▶'}</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}

        {trip.expenses.length > 0 && (
          <View className={styles.expenseCard} onClick={handleOpenExpense}>
            <View className={styles.expenseHeader}>
              <Text className={styles.sectionTitle}>费用分摊</Text>
              <Text className={styles.expenseArrow}>→</Text>
            </View>
            <View className={styles.expenseSummary}>
              <View className={styles.expenseStat}>
                <Text className={styles.expenseAmount}>¥{totalExpense}</Text>
                <Text className={styles.expenseLabel}>总支出</Text>
              </View>
              <View className={styles.expenseStat}>
                <Text className={styles.expenseAmount}>¥{perPerson}</Text>
                <Text className={styles.expenseLabel}>人均</Text>
              </View>
              <View className={styles.expenseStat}>
                <Text className={styles.expenseAmount}>{trip.expenses.length}</Text>
                <Text className={styles.expenseLabel}>笔开销</Text>
              </View>
            </View>
          </View>
        )}

        {trip.transportBooking && (
          <View className={styles.bookingCard}>
            <Text className={styles.sectionTitle}>交通信息</Text>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>{trip.transportBooking.type === 'plane' ? '航班号' : '车次'}</Text>
              <Text className={styles.bookingValue}>{trip.transportBooking.bookingNo}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>出发</Text>
              <Text className={styles.bookingValue}>{formatDateTime(trip.transportBooking.departureTime)}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>到达</Text>
              <Text className={styles.bookingValue}>{formatDateTime(trip.transportBooking.arrivalTime)}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>价格</Text>
              <Text className={styles.bookingValue}>¥{trip.transportBooking.price}</Text>
            </View>
          </View>
        )}

        {trip.accommodationBooking && (
          <View className={styles.bookingCard}>
            <Text className={styles.sectionTitle}>住宿信息</Text>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>酒店</Text>
              <Text className={styles.bookingValue}>{trip.accommodationBooking.hotelName}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>地址</Text>
              <Text className={styles.bookingValue}>{trip.accommodationBooking.address}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>入住</Text>
              <Text className={styles.bookingValue}>{formatDate(trip.accommodationBooking.checkInDate)}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>退房</Text>
              <Text className={styles.bookingValue}>{formatDate(trip.accommodationBooking.checkOutDate)}</Text>
            </View>
            <View className={styles.bookingRow}>
              <Text className={styles.bookingLabel}>订单号</Text>
              <Text className={styles.bookingValue}>{trip.accommodationBooking.bookingNo}</Text>
            </View>
          </View>
        )}

        {groupedItems.map(({ category, label, icon, items, completedInGroup }) => (
          items.length > 0 && (
            <View key={category} className={styles.categorySection}>
              <View className={styles.categoryHeader}>
                <Text className={styles.categoryIcon}>{icon}</Text>
                <Text className={styles.categoryLabel}>{label}</Text>
                <Text className={styles.categoryCount}>{completedInGroup}/{items.length}</Text>
              </View>
              {items.map((item) => (
                <View key={item.id}>
                  <View
                    className={classnames(styles.checkItem, item.isCompleted && styles.checkItemDone)}
                    onClick={() => handleToggle(item.id)}
                  >
                    <View className={classnames(styles.checkbox, item.isCompleted && styles.checkboxChecked)}>
                      {item.isCompleted && <Text className={styles.checkmark}>✓</Text>}
                    </View>
                    <View className={styles.checkContent}>
                      <Text className={classnames(styles.checkTitle, item.isCompleted && styles.checkTitleDone)}>
                        {item.title}
                      </Text>
                      {item.note && (
                        <Text className={styles.checkNote}>{item.note}</Text>
                      )}
                      {item.dueDate && (
                        <Text className={styles.checkDue}>截止 {formatDate(item.dueDate)}</Text>
                      )}
                    </View>
                  </View>
                  <View className={styles.assigneeRow} onClick={(e) => { e.stopPropagation?.(); handleAssign(item.id); }}>
                    {assignTargetItemId === item.id ? (
                      <Picker
                        mode="selector"
                        range={companionNames}
                        onChange={handlePickAssignee}
                        onCancel={() => setAssignTargetItemId(null)}
                      >
                        <View className={styles.assigneePicker}>
                          <Text className={styles.assigneePickerText}>转交给...</Text>
                        </View>
                      </Picker>
                    ) : item.assigneeName ? (
                      <Text className={styles.assigneeTag}>
                      <Text className={styles.assigneeIcon}>👤</Text>
                      负责人: {item.assigneeName}
                      <Text className={styles.reassignHint}>（点击转交）</Text>
                    </Text>
                  ) : (
                    <Text className={styles.assigneeAssignBtn}>+ 指定负责人</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )
      ))}

        <View className={styles.messagesSection}>
          <View className={styles.sectionHeaderRow}>
            <Text className={styles.sectionTitle}>同行留言</Text>
            <Text className={styles.messageCount}>{trip.messages.length} 条</Text>
          </View>
          <View className={styles.msgCategoryBar}>
            {msgCategories.map((cat) => (
              <Text
                key={cat}
                className={classnames(styles.msgCategoryItem, msgCategory === cat && styles.msgCategoryActive)}
                onClick={() => setMsgCategory(cat)}
              >
                {cat === 'all' ? '全部' : messageCategoryLabels[cat]}
              </Text>
            ))}
          </View>
          <View className={styles.messageList}>
            {sortedMessages.length === 0 ? (
              <View className={styles.emptyMessages}>
                <Text className={styles.emptyText}>暂无留言，来说点什么吧</Text>
              </View>
            ) : (
              sortedMessages.map((msg) => (
                <View key={msg.id} className={styles.messageItem}>
                  <Image className={styles.msgAvatar} src={msg.userAvatar} mode="aspectFill" />
                  <View className={styles.msgContent}>
                    <View className={styles.msgHeader}>
                      <Text className={styles.msgName}>{msg.userName}</Text>
                      <Text className={styles.msgTime}>{formatTime(msg.createdAt)}</Text>
                    </View>
                    <Text className={styles.msgText}>{msg.content}</Text>
                    <View className={styles.msgCategoryTag}>{messageCategoryLabels[msg.category]}</View>
                  </View>
                </View>
              ))
            )}
          </View>
          <View className={styles.msgInputBar}>
            <Input
              className={styles.msgInput}
              placeholder="说点什么..."
              value={newMessage}
              onInput={(e) => setNewMessage(e.detail.value)}
              confirmType="send"
              onConfirm={handleSendMessage}
            />
            <View
              className={classnames(styles.sendBtn, !newMessage.trim() && styles.sendBtnDisabled)}
              onClick={handleSendMessage}
            >
              <Text className={styles.sendBtnText}>发送</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChecklistDetailPage;

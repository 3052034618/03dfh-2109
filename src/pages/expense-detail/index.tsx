import React, { useMemo, useState } from 'react';
import { View, Text, Image, Input, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '../../store/useAppStore';
import { useUserStore } from '../../store/useUserStore';
import { expenseCategoryLabels } from '../../types/trip';
import type { ExpenseCategory } from '../../types/trip';
import { formatDate } from '../../utils/date';

const categories: ExpenseCategory[] = ['transport', 'accommodation', 'deposit', 'food', 'ticket', 'other'];

const ExpenseDetailPage: React.FC = () => {
  const { trips, addExpense, toggleExpensePaid } = useAppStore();
  const { profile } = useUserStore();

  const params = Taro.getCurrentInstance().router?.params;
  const tripId = params?.id || '';

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('transport');
  const [paidByIdx, setPaidByIdx] = useState(0);
  const [categoryIdx, setCategoryIdx] = useState(0);

  const trip = useMemo(() => trips.find(t => t.id === tripId), [trips, tripId]);

  if (!trip) {
    return (
      <View className={styles.page}>
        <View className="pageContainer">
          <Text className={styles.notFound}>行程不存在</Text>
        </View>
      </View>
    );
  }

  const totalExpense = trip.expenses.reduce((sum, e) => sum + e.amount, 0);
  const companionCount = trip.companions.length;
  const perPerson = companionCount > 0 ? Math.round(totalExpense / companionCount) : 0;

  const getMemberById = (id: string) => trip.companions.find(c => c.id === id);

  const handleAddExpense = () => {
    if (!newTitle.trim() || !newAmount || isNaN(Number(newAmount))) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    const payer = trip.companions[paidByIdx];
    if (!payer) return;
    addExpense(trip.id, {
      title: newTitle.trim(),
      category: newCategory,
      amount: Number(newAmount),
      paidBy: payer.id,
      paidByName: payer.nickname,
      splitAmong: trip.companions.map(c => c.id),
      paidMembers: [payer.id]
    });
    setNewTitle('');
    setNewAmount('');
    setShowAddForm(false);
    Taro.showToast({ title: '已添加', icon: 'success' });
  };

  const handleTogglePaid = (expenseId: string, memberId: string) => {
    toggleExpensePaid(trip.id, expenseId, memberId);
  };

  const handlePickPayer = (e: any) => {
    const idx = parseInt(e.detail.value);
    setPaidByIdx(idx);
  };

  const handlePickCategory = (e: any) => {
    const idx = parseInt(e.detail.value);
    setCategoryIdx(idx);
    setNewCategory(categories[idx]);
  };

  const categoryNames = categories.map(c => expenseCategoryLabels[c]);
  const companionNames = trip.companions.map(c => c.nickname);

  return (
    <View className={styles.page}>
      <View className="pageContainer">
        <View className={styles.header}>
          <Text className={styles.headerTitle}>费用分摊</Text>
          <Text className={styles.headerSub}>{trip.city} · {trip.scriptName} · {formatDate(trip.date)}</Text>
        </View>

        <View className={styles.summaryCard}>
          <View className={styles.summaryRow}>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryAmount}>¥{totalExpense}</Text>
              <Text className={styles.summaryLabel}>总支出</Text>
            </View>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryAmount}>¥{perPerson}</Text>
              <Text className={styles.summaryLabel}>人均</Text>
            </View>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryAmount}>{trip.expenses.length}</Text>
              <Text className={styles.summaryLabel}>笔</Text>
            </View>
          </View>
          <View className={styles.peopleTag}>参与分摊：{companionCount}人</View>
        </View>

        <View className={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
          <Text className={styles.addBtnText}>{showAddForm ? '收起' : '+ 记一笔开销'}</Text>
        </View>

        {showAddForm && (
          <View className={styles.addForm}>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>项目名称</Text>
              <Input
                className={styles.formInput}
                placeholder="如：往返高铁票"
                value={newTitle}
                onInput={e => setNewTitle(e.detail.value)}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>金额（元）</Text>
              <Input
                className={styles.formInput}
                type="digit"
                placeholder="0"
                value={newAmount}
                onInput={e => setNewAmount(e.detail.value)}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>分类</Text>
              <Picker mode="selector" range={categoryNames} onChange={handlePickCategory}>
                <View className={styles.formPicker}>
                  <Text className={styles.formPickerText}>{expenseCategoryLabels[newCategory]}</Text>
                  <Text className={styles.formPickerArrow}>▼</Text>
                </View>
              </Picker>
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>谁付的钱</Text>
              <Picker mode="selector" range={companionNames} onChange={handlePickPayer}>
                <View className={styles.formPicker}>
                  <Text className={styles.formPickerText}>{trip.companions[paidByIdx]?.nickname || '选择'}</Text>
                  <Text className={styles.formPickerArrow}>▼</Text>
                </View>
              </Picker>
            </View>
            <View className={styles.formHint}>所有开销默认 {companionCount} 人平摊</View>
            <View className={styles.submitBtn} onClick={handleAddExpense}>
              <Text className={styles.submitBtnText}>添加</Text>
            </View>
          </View>
        )}

        <View className={styles.expenseList}>
          {trip.expenses.length === 0 ? (
            <View className={styles.empty}>
              <Text className={styles.emptyText}>还没有记录开销</Text>
            </View>
          ) : (
            trip.expenses.map((expense) => {
              const perShare = expense.splitAmong.length > 0 ? Math.round(expense.amount / expense.splitAmong.length) : 0;
              const allPaid = expense.paidMembers.length >= expense.splitAmong.length;
              const myPaid = expense.paidMembers.includes(profile.id);
              return (
                <View key={expense.id} className={styles.expenseCard}>
                  <View className={styles.expenseHeader}>
                    <View className={styles.expenseCat}>
                      <Text className={styles.expenseCatIcon}>
                        {expense.category === 'transport' && '🚄'}
                        {expense.category === 'accommodation' && '🏨'}
                        {expense.category === 'deposit' && '💰'}
                        {expense.category === 'food' && '🍜'}
                        {expense.category === 'ticket' && '🎫'}
                        {expense.category === 'other' && '📦'}
                      </Text>
                      <Text className={styles.expenseTitle}>{expense.title}</Text>
                    </View>
                    <Text className={styles.expenseAmount}>¥{expense.amount}</Text>
                  </View>
                  <View className={styles.expenseMeta}>
                    <Text className={styles.expensePayer}>付款：{expense.paidByName}</Text>
                    <Text className={styles.expensePerShare}>人均 ¥{perShare}</Text>
                  </View>
                  <View className={styles.memberList}>
                    {trip.companions.map((member) => {
                      const isPaid = expense.paidMembers.includes(member.id);
                      const isMe = member.id === profile.id;
                      return (
                        <View
                          key={member.id}
                          className={classnames(styles.memberItem, isPaid && styles.memberPaid)}
                          onClick={() => isMe && handleTogglePaid(expense.id, member.id)}
                        >
                          <Image className={styles.memberAvatar} src={member.avatar} mode="aspectFill" />
                          <Text className={classnames(styles.memberName, isPaid && styles.memberNamePaid)}>
                            {member.nickname}{isMe ? '（我）' : ''}
                          </Text>
                          {isPaid && <Text className={styles.paidTag}>已付</Text>}
                          {!isPaid && isMe && <Text className={styles.unpaidTag}>去支付</Text>}
                        </View>
                      );
                    })}
                  </View>
                  {allPaid && (
                    <View className={styles.allPaidRow}>
                      <Text className={styles.allPaidText}>✓ 已全部结清</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </View>
    </View>
  );
};

export default ExpenseDetailPage;

import React, { useState } from 'react';
import { View, Text, Input, Button, Picker, Switch } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useUserStore } from '../../store/useUserStore';
import { useAppStore } from '../../store/useAppStore';
import { cities } from '../../data/games';
import { scriptTypeLabels, type ScriptType } from '../../types/user';
import type { CompanionCard } from '../../types/companion';

const cityOptions = cities.filter(c => c !== '全部');
const scriptTypeOptions = Object.entries(scriptTypeLabels).map(([key, label]) => ({ key, label }));

const PublishCardPage: React.FC = () => {
  const { profile } = useUserStore();
  const { addCompanionCard } = useAppStore();

  const [targetCity, setTargetCity] = useState('');
  const [scriptName, setScriptName] = useState('');
  const [scriptType, setScriptType] = useState<ScriptType>('campaign');
  const [date, setDate] = useState('2026-06-22');
  const [missingRoles, setMissingRoles] = useState('3');
  const [totalRoles, setTotalRoles] = useState('7');
  const [acceptShareRoom, setAcceptShareRoom] = useState(true);
  const [acceptShareCar, setAcceptShareCar] = useState(true);
  const [budget, setBudget] = useState('800');
  const [description, setDescription] = useState('');

  const handlePublish = () => {
    if (!targetCity.trim()) {
      Taro.showToast({ title: '请填写目标城市', icon: 'none' });
      return;
    }
    if (!scriptName.trim()) {
      Taro.showToast({ title: '请填写剧本名', icon: 'none' });
      return;
    }
    if (!date) {
      Taro.showToast({ title: '请选择日期', icon: 'none' });
      return;
    }

    const missing = parseInt(missingRoles) || 1;
    const total = parseInt(totalRoles) || 6;

    const newCard: CompanionCard = {
      id: `c_${Date.now()}`,
      publisherId: profile.id,
      publisherName: profile.nickname,
      publisherAvatar: profile.avatar,
      targetCity: targetCity.trim(),
      scriptName: scriptName.trim(),
      scriptType,
      date,
      missingRoles: missing,
      totalRoles: total,
      acceptShareRoom,
      acceptShareCar,
      budget: parseInt(budget) || 800,
      description: description.trim() || `${profile.residentCity}出发去${targetCity.trim()}打《${scriptName.trim()}》，缺${missing}个角色`,
      companions: [],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'open'
    };

    addCompanionCard(newCard);
    console.log('[PublishCardPage] 发布约伴卡:', newCard.id);

    Taro.showToast({ title: '发布成功', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={styles.page}>
      <View className="pageContainer">
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>基本信息</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>目标城市</Text>
            <Picker mode="selector" range={cityOptions} onChange={(e) => setTargetCity(cityOptions[e.detail.value])}>
              <View className={styles.pickerValue}>
                <Text className={targetCity ? styles.pickerText : styles.pickerPlaceholder}>
                  {targetCity || '请选择目标城市'}
                </Text>
                <Text className={styles.pickerArrow}>▼</Text>
              </View>
            </Picker>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>剧本名</Text>
            <Input
              className={styles.input}
              placeholder="想打的剧本名称"
              value={scriptName}
              onInput={(e) => setScriptName(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>剧本类型</Text>
            <Picker mode="selector" range={scriptTypeOptions.map(s => s.label)} onChange={(e) => setScriptType(scriptTypeOptions[e.detail.value].key as ScriptType)}>
              <View className={styles.pickerValue}>
                <Text className={styles.pickerText}>{scriptTypeLabels[scriptType]}</Text>
                <Text className={styles.pickerArrow}>▼</Text>
              </View>
            </Picker>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>日期</Text>
            <Picker mode="date" value={date} onChange={(e) => setDate(e.detail.value)}>
              <View className={styles.pickerValue}>
                <Text className={styles.pickerText}>{date}</Text>
                <Text className={styles.pickerArrow}>▼</Text>
              </View>
            </Picker>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>角色与拼车</Text>

          <View className={styles.row}>
            <View className={styles.formItemHalf}>
              <Text className={styles.label}>总角色数</Text>
              <Input
                className={styles.input}
                type="number"
                placeholder="7"
                value={totalRoles}
                onInput={(e) => setTotalRoles(e.detail.value)}
              />
            </View>
            <View className={styles.formItemHalf}>
              <Text className={styles.label}>缺几人</Text>
              <Input
                className={styles.input}
                type="number"
                placeholder="3"
                value={missingRoles}
                onInput={(e) => setMissingRoles(e.detail.value)}
              />
            </View>
          </View>

          <View className={styles.switchRow}>
            <Text className={styles.label}>接受拼房</Text>
            <Switch checked={acceptShareRoom} color="#7C3AED" onChange={(e) => setAcceptShareRoom(e.detail.value)} />
          </View>

          <View className={styles.switchRow}>
            <Text className={styles.label}>接受拼车</Text>
            <Switch checked={acceptShareCar} color="#7C3AED" onChange={(e) => setAcceptShareCar(e.detail.value)} />
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>预算与备注</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>总预算（元）</Text>
            <Input
              className={styles.input}
              type="number"
              placeholder="800"
              value={budget}
              onInput={(e) => setBudget(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>备注说明</Text>
            <Input
              className={styles.textarea}
              placeholder="描述你的出行计划、对队友的要求等..."
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
            />
          </View>
        </View>

        <Button className={styles.submitBtn} onClick={handlePublish}>
          <Text className={styles.submitBtnText}>发布约伴卡</Text>
        </Button>
      </View>
    </View>
  );
};

export default PublishCardPage;

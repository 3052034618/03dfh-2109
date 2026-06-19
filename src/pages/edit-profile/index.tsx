import React, { useState } from 'react';
import { View, Text, Input, Button, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useUserStore } from '../../store/useUserStore';
import { cities } from '../../data/games';
import { scriptTypeLabels, type ScriptType } from '../../types/user';

const cityOptions = cities.filter(c => c !== '全部');
const scriptTypeEntries = Object.entries(scriptTypeLabels) as [ScriptType, string][];

const weekendOptions = [
  { value: '2026-06-22', label: '6月22日 周一' },
  { value: '2026-06-27', label: '6月27日 周六' },
  { value: '2026-06-28', label: '6月28日 周日' },
  { value: '2026-07-04', label: '7月4日 周六' },
  { value: '2026-07-05', label: '7月5日 周日' },
  { value: '2026-07-11', label: '7月11日 周六' },
  { value: '2026-07-12', label: '7月12日 周日' }
];

const EditProfilePage: React.FC = () => {
  const { profile, updatePreferences, setProfile } = useUserStore();

  const [nickname, setNickname] = useState(profile.nickname);
  const [residentCity, setResidentCity] = useState(profile.residentCity);
  const [selectedWeekends, setSelectedWeekends] = useState<string[]>(profile.availableWeekends);
  const [selectedTypes, setSelectedTypes] = useState<ScriptType[]>(profile.scriptPreferences);
  const [maxTransport, setMaxTransport] = useState(String(profile.budget.maxTransport));
  const [maxAccommodation, setMaxAccommodation] = useState(String(profile.budget.maxAccommodation));
  const [wechatId, setWechatId] = useState(profile.wechatId || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [bio, setBio] = useState(profile.bio || '');

  const toggleWeekend = (value: string) => {
    setSelectedWeekends(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleScriptType = (type: ScriptType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSave = () => {
    if (!nickname.trim()) {
      Taro.showToast({ title: '请填写昵称', icon: 'none' });
      return;
    }
    if (!residentCity) {
      Taro.showToast({ title: '请选择常驻城市', icon: 'none' });
      return;
    }
    if (selectedTypes.length === 0) {
      Taro.showToast({ title: '请至少选择一个剧本类型', icon: 'none' });
      return;
    }

    setProfile({ nickname: nickname.trim(), bio: bio.trim(), wechatId: wechatId.trim(), phone: phone.trim() });
    updatePreferences({
      residentCity,
      availableWeekends: selectedWeekends,
      scriptPreferences: selectedTypes,
      budget: {
        maxTransport: parseInt(maxTransport) || 500,
        maxAccommodation: parseInt(maxAccommodation) || 400
      }
    });

    console.log('[EditProfilePage] 保存资料');
    Taro.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const cityIndex = cityOptions.indexOf(residentCity);

  return (
    <View className={styles.page}>
      <View className="pageContainer">
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>基本信息</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>昵称</Text>
            <Input
              className={styles.input}
              placeholder="你的昵称"
              value={nickname}
              onInput={(e) => setNickname(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>常驻城市</Text>
            <Picker
              mode="selector"
              range={cityOptions}
              value={cityIndex >= 0 ? cityIndex : 0}
              onChange={(e) => setResidentCity(cityOptions[e.detail.value])}
            >
              <View className={styles.pickerValue}>
                <Text className={styles.pickerText}>{residentCity || '请选择常驻城市'}</Text>
                <Text className={styles.pickerArrow}>▼</Text>
              </View>
            </Picker>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>个人简介</Text>
            <Input
              className={styles.textarea}
              placeholder="介绍一下自己..."
              value={bio}
              onInput={(e) => setBio(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>联系方式（确认同行后展示给对方）</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>微信号</Text>
            <Input
              className={styles.input}
              placeholder="你的微信号"
              value={wechatId}
              onInput={(e) => setWechatId(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>手机号</Text>
            <Input
              className={styles.input}
              placeholder="你的手机号"
              value={phone}
              onInput={(e) => setPhone(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>偏好剧本类型</Text>
          <View className={styles.tagGrid}>
            {scriptTypeEntries.map(([key, label]) => (
              <View
                key={key}
                className={`${styles.tagItem} ${selectedTypes.includes(key) ? styles.tagItemActive : ''}`}
                onClick={() => toggleScriptType(key)}
              >
                <Text className={selectedTypes.includes(key) ? styles.tagTextActive : styles.tagText}>
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>可出行周末</Text>
          <View className={styles.tagGrid}>
            {weekendOptions.map((opt) => (
              <View
                key={opt.value}
                className={`${styles.tagItem} ${selectedWeekends.includes(opt.value) ? styles.tagItemActive : ''}`}
                onClick={() => toggleWeekend(opt.value)}
              >
                <Text className={selectedWeekends.includes(opt.value) ? styles.tagTextActive : styles.tagText}>
                  {opt.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>预算设置</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>车费预算（元）</Text>
            <Input
              className={styles.input}
              type="number"
              placeholder="500"
              value={maxTransport}
              onInput={(e) => setMaxTransport(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>住宿预算（元）</Text>
            <Input
              className={styles.input}
              type="number"
              placeholder="400"
              value={maxAccommodation}
              onInput={(e) => setMaxAccommodation(e.detail.value)}
            />
          </View>
        </View>

        <Button className={styles.submitBtn} onClick={handleSave}>
          <Text className={styles.submitBtnText}>保存</Text>
        </Button>
      </View>
    </View>
  );
};

export default EditProfilePage;

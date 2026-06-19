import Taro from '@tarojs/taro';

const STORAGE_KEYS = {
  USER_PROFILE: 'jubensha_user_profile',
  COMPANION_CARDS: 'jubensha_companion_cards',
  TRIPS: 'jubensha_trips'
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const value = Taro.getStorageSync(key);
    if (value === '' || value === null || value === undefined) {
      return defaultValue;
    }
    return JSON.parse(value) as T;
  } catch (e) {
    console.warn('[storage] 读取失败:', key, e);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    Taro.setStorageSync(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[storage] 写入失败:', key, e);
  }
};

export { STORAGE_KEYS };

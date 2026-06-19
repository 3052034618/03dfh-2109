import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { cities, dates } from '../../data/games';
import { scriptTypeLabels, type ScriptType } from '../../types/user';

interface FilterBarProps {
  onFilterChange: (filters: { city: string; date: string; scriptType: ScriptType | 'all' }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [selectedCity, setSelectedCity] = useState('全部');
  const [selectedDate, setSelectedDate] = useState('全部日期');
  const [selectedType, setSelectedType] = useState<ScriptType | 'all'>('all');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  const scriptTypes = [
    { key: 'all' as const, label: '全部类型' },
    ...Object.entries(scriptTypeLabels).map(([key, label]) => ({ key: key as ScriptType, label }))
  ];

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCityPicker(false);
    onFilterChange({ city, date: selectedDate, scriptType: selectedType });
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowDatePicker(false);
    onFilterChange({ city: selectedCity, date, scriptType: selectedType });
  };

  const handleTypeSelect = (type: ScriptType | 'all') => {
    setSelectedType(type);
    setShowTypePicker(false);
    onFilterChange({ city: selectedCity, date: selectedDate, scriptType: type });
  };

  const togglePicker = (picker: 'city' | 'date' | 'type') => {
    setShowCityPicker(picker === 'city' ? !showCityPicker : false);
    setShowDatePicker(picker === 'date' ? !showDatePicker : false);
    setShowTypePicker(picker === 'type' ? !showTypePicker : false);
  };

  return (
    <View className={styles.filterBar}>
      <View className={styles.filterRow}>
        <View
          className={classnames(styles.filterItem, showCityPicker && styles.filterItemActive)}
          onClick={() => togglePicker('city')}
        >
          <Text className={styles.filterText}>{selectedCity}</Text>
          <Text className={styles.filterArrow}>▼</Text>
        </View>
        <View
          className={classnames(styles.filterItem, showDatePicker && styles.filterItemActive)}
          onClick={() => togglePicker('date')}
        >
          <Text className={styles.filterText}>{selectedDate}</Text>
          <Text className={styles.filterArrow}>▼</Text>
        </View>
        <View
          className={classnames(styles.filterItem, showTypePicker && styles.filterItemActive)}
          onClick={() => togglePicker('type')}
        >
          <Text className={styles.filterText}>
            {selectedType === 'all' ? '全部类型' : scriptTypeLabels[selectedType]}
          </Text>
          <Text className={styles.filterArrow}>▼</Text>
        </View>
      </View>

      {showCityPicker && (
        <View className={styles.pickerDropdown}>
          <ScrollView scrollY className={styles.pickerScroll}>
            {cities.map((city) => (
              <View
                key={city}
                className={classnames(
                  styles.pickerItem,
                  selectedCity === city && styles.pickerItemActive
                )}
                onClick={() => handleCitySelect(city)}
              >
                <Text>{city}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {showDatePicker && (
        <View className={styles.pickerDropdown}>
          <ScrollView scrollY className={styles.pickerScroll}>
            {dates.map((date) => (
              <View
                key={date}
                className={classnames(
                  styles.pickerItem,
                  selectedDate === date && styles.pickerItemActive
                )}
                onClick={() => handleDateSelect(date)}
              >
                <Text>{date}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {showTypePicker && (
        <View className={styles.pickerDropdown}>
          <ScrollView scrollY className={styles.pickerScroll}>
            {scriptTypes.map((type) => (
              <View
                key={type.key}
                className={classnames(
                  styles.pickerItem,
                  selectedType === type.key && styles.pickerItemActive
                )}
                onClick={() => handleTypeSelect(type.key)}
              >
                <Text>{type.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default FilterBar;

import React, { useState } from 'react';
import { View, Text, Checkbox } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { ChecklistItem as IChecklistItem } from '../../types/trip';
import { categoryLabels } from '../../types/trip';

interface ChecklistItemProps {
  item: IChecklistItem;
  onToggle?: (id: string, checked: boolean) => void;
  showCategory?: boolean;
}

const ChecklistItemComponent: React.FC<ChecklistItemProps> = ({ item, onToggle, showCategory = false }) => {
  const [checked, setChecked] = useState(item.isCompleted);

  const handleToggle = (e) => {
    const newChecked = e.detail.value;
    setChecked(newChecked);
    onToggle?.(item.id, newChecked);
  };

  return (
    <View className={classnames(styles.item, checked && styles.itemCompleted)}>
      <View className={styles.checkboxWrapper}>
        <Checkbox
          className={styles.checkbox}
          checked={checked}
          color="#7C3AED"
          onChange={handleToggle}
        />
      </View>
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={classnames(styles.title, checked && styles.titleCompleted)}>
            {item.title}
          </Text>
          {showCategory && (
            <Text className={styles.category}>
              {categoryLabels[item.category]}
            </Text>
          )}
        </View>
        {item.note && (
          <Text className={styles.note}>{item.note}</Text>
        )}
        {item.dueDate && (
          <Text className={styles.dueDate}>截止: {item.dueDate}</Text>
        )}
      </View>
    </View>
  );
};

export default ChecklistItemComponent;

import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface TagProps {
  text: string;
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'default';
  size?: 'small' | 'medium';
  outline?: boolean;
}

const Tag: React.FC<TagProps> = ({ text, type = 'default', size = 'small', outline = false }) => {
  return (
    <View
      className={classnames(
        styles.tag,
        styles[`tag${type.charAt(0).toUpperCase() + type.slice(1)}`],
        styles[`tag${size.charAt(0).toUpperCase() + size.slice(1)}`],
        outline && styles.tagOutline
      )}
    >
      <Text className={styles.tagText}>{text}</Text>
    </View>
  );
};

export default Tag;

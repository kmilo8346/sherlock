import React from 'react';
import { Pressable, Text, View } from 'react-native';
import styles from './styles';
import colors from '../../styles/colors';

interface TabItemProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export const TabItem = (props: TabItemProps) => {
  const { label, selected, onPress } = props;

  const pressHandle = () => {
    onPress();
  };

  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.4 : 1,
        },
        styles.container,
      ]}
      onPress={pressHandle}
    >
      <Text
        style={[
          {
            color: selected ? colors.black : colors.gray,
          },
          styles.label,
        ]}
      >
        {label}
      </Text>

      {selected && <View style={styles.indicator} />}
    </Pressable>
  );
};

export default TabItem;

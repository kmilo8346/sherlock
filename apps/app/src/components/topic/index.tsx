import React from 'react';
import { Pressable, Text, View } from 'react-native';
import styles from './styles';

interface ITopicProps {
  label: string;
  selected?: boolean;
}

export const Topic = (props: ITopicProps) => {
  const { label, selected } = props;
  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.4 : 1,
        },
        styles.container,
      ]}
    >
      <Text
        style={[
          {
            color: selected ? '#14171A' : '#657786',
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

export default Topic;

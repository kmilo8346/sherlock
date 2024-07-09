import React from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Icon } from '@rneui/themed';
import styles from './styles';
import colors from '../../styles/colors';

export interface TweetItemProps {
  title: string;
  createdAt: string;
  text: string;
  stats: {
    totalTweets: number;
    totalRetweets: number;
    totalViews: number;
  };
}

export const TweetItem = (props: TweetItemProps) => {
  const { title, createdAt, text, stats } = props;

  return (
    <View style={styles.card}>
      <Avatar rounded title="T" size="medium" containerStyle={styles.avatar} />
      <View style={styles.textsContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}> • 5h</Text>
        </View>
        <Text>{text}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon
              type="feather"
              name="message-circle"
              size={16}
              color={colors.gray}
            />
            <Text style={styles.statText}>{stats.totalTweets}</Text>
          </View>

          <View style={styles.statItem}>
            <Icon
              type="feather"
              name="refresh-cw"
              size={16}
              color={colors.gray}
            />
            <Text style={styles.statText}>{stats.totalRetweets}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon
              type="feather"
              name="refresh-cw"
              size={16}
              color={colors.gray}
            />
            <Text style={styles.statText}>{stats.totalViews}</Text>
          </View>
          <View style={styles.space} />
          <Icon type="feather" name="bookmark" size={16} color={colors.gray} />
        </View>
      </View>
    </View>
  );
};

export default TweetItem;

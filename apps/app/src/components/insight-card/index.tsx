import React from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Icon } from '@rneui/themed';
import styles from './styles';
import colors from '../../styles/colors';

export interface InsightCardProps {}

export const InsightCard = (props: InsightCardProps) => {
  return (
    <View style={styles.card}>
      <Avatar rounded title="T" size="medium" containerStyle={styles.avatar} />
      <View style={styles.textsContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Tesla</Text>
          <Text style={styles.date}> • 5h</Text>
        </View>
        <Text>
          El sistema de conducción autónoma de Tesla presenta fallas al no
          detenerse en diversas situaciones, como luces de ferrocarril
          intermitentes, señales de alto y autobuses escolares detenidos con
          luces intermitentes, obligando al conductor a intervenir manualmente.
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon
              type="feather"
              name="message-circle"
              size={16}
              color={colors.gray}
            />
            <Text style={styles.statText}>5</Text>
          </View>
          <View style={styles.statItem}>
            <Icon
              type="feather"
              name="refresh-cw"
              size={16}
              color={colors.gray}
            />
            <Text style={styles.statText}>2</Text>
          </View>
          <View style={styles.space} />
          <Icon type="feather" name="bookmark" size={16} color={colors.gray} />
        </View>
      </View>
    </View>
  );
};

export default InsightCard;

import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Divider, InsightCard, Topic } from '../components';
import styles from './styles';
import colors from '../styles/colors';

export const App = () => {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView
          style={[styles.safeAreaView, { justifyContent: 'center' }]}
        >
          <ActivityIndicator id="cuco" size="small" color={colors.blue} />
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.topicsScrollView}
        >
          <Topic label="Todos" selected />
          <Topic label="Tesla" />
          <Topic label="Tesla FSD" />
          <Topic label="Tesla Megapack" />
          <Topic label="Tesla Model 3" />
          <Topic label="Tesla Model Y" />
        </ScrollView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.insightScrollView}
        >
          <Divider />
          <InsightCard />
          <Divider />
          <InsightCard />
          <Divider />
          <InsightCard />
          <Divider />
          <InsightCard />
          <Divider />
          <InsightCard />
          <Divider />
          <InsightCard />
          <Divider />
          <InsightCard />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;

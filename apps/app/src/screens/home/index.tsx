import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { Divider, TweetItem, TabItem } from '../../components';
import { subscriptionClient, insightClient } from '../../clients';
import styles from './styles';
import colors from '../../styles/colors';
import { authenticator } from '../../lib';
import { ICollection, Insight, Subscription } from '@sherlock/models';
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';

let abortController: AbortController = new AbortController();

interface ITab {
  id: string;
  label: string;
  source_ids: string[];
}

export const HomeScreen = () => {
  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tabs, setTabs] = useState<ITab[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>();
  const [insights, setInsights] = useState<ICollection<Insight>>();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>();

  const handleBoot = async () => {
    try {
      setBooting(true);

      const userInfo = authenticator.getUserInfo();

      // Busco todas las subscripciones de este usuario
      const subscriptions = await subscriptionClient.getAll<Subscription>({
        from: 0,
        size: 10,
        filter: {
          user_id: userInfo.sub,
        },
      });

      const tabs = subscriptions.data.map((s) => ({
        id: s._id,
        label: s.label,
        source_ids: [s.data_source_id],
      }));

      // Agrego el tab de "Todos" si son más de 1 tabs
      if (tabs.length > 1) {
        tabs.unshift({
          id: 'all',
          label: 'Todos',
          source_ids: subscriptions.data.map((s) => s.data_source_id),
        });
      }

      // Siempre selecciono el primer tab
      if (tabs.length > 0) {
        setSelectedTab(tabs[0].id);

        // Simulo el click en el primer tab
        // Solo la primera vez que se cargan los tabs
        setTimeout(() => {
          handleTabSelect(tabs[0]);
        });
      }

      // Guardo los tabs para pintarlos
      // en la UI cuando se seleccionen
      setTabs(tabs);
      setSubscriptions(subscriptions.data);
    } catch (error) {
      console.error('Failed to boot: ', error);
      // TODO: Mostrar mensaje de error
    } finally {
      setBooting(false);
    }
  };

  const handleTabSelect = async (tab: ITab) => {
    try {
      // Pinto el selector del tab seleccionado
      setSelectedTab(tab.id);

      // Borro los insights actuales
      setInsights(undefined);

      // Pinto el loading del tab seleccionado
      setLoading(true);

      // Si hay una petición en curso, la aborto
      if (abortController) {
        abortController.abort();
        abortController = new AbortController();
      }

      // Busco los 10 primeros insights
      // asociados a las subscripciones del usuario
      const insights = await insightClient.getAll<Insight>(
        {
          from: 0,
          size: 10,
          filter: {
            data_source_id: {
              $in: tab.source_ids,
            },
          },
          sort: {
            created_at: -1,
          },
        },
        {
          signal: abortController.signal,
        }
      );

      // Pinto los insights
      setInsights(insights);

      // Oculto el loading del tab seleccionado
      setLoading(false);
    } catch (error) {
      if (axios.isCancel(error)) {
        return;
      }

      console.error('Failed to select tab: ', error);
      // Oculto el loading del tab seleccionado
      setLoading(false);
      // TODO: Mostrar mensaje de error
    }
  };

  const handleRefresh = async () => {
    const tab = tabs.find((t) => t.id === selectedTab);
    if (!tab) {
      return;
    }

    try {
      // Pinto el indicador de pull to refresh
      setRefreshing(true);

      // Si hay una petición en curso, la aborto
      if (abortController) {
        abortController.abort();
        abortController = new AbortController();
      }

      // Busco los 10 primeros insights
      // asociados a las subscripciones del usuario
      const insights = await insightClient.getAll<Insight>(
        {
          from: 0,
          size: 10,
          filter: {
            data_source_id: {
              $in: tab.source_ids,
            },
          },
          sort: {
            created_at: -1,
          },
        },
        {
          signal: abortController.signal,
        }
      );

      // Pinto los insights
      setInsights(insights);
      // Oculto el indicador de pull to refresh
      setRefreshing(false);
    } catch (error) {
      if (!axios.isCancel(error)) {
        return;
      }

      console.error('Failed to refresh current tab: ', error);
      // Oculto el indicador de pull to refresh
      setRefreshing(false);
      // TODO: Mostrar mensaje de error
    }
  };

  useEffect(() => {
    handleBoot();
  }, []);

  if (booting) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView
          style={[styles.safeAreaView, { justifyContent: 'center' }]}
        >
          <ActivityIndicator size="small" color={colors.blue} />
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeAreaView} id="cuco">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.topicsScrollView}
        >
          {tabs.map((tab) => {
            return (
              <TabItem
                key={tab.id}
                label={tab.label}
                selected={tab.id === selectedTab}
                onPress={() => handleTabSelect(tab)}
              />
            );
          })}
        </ScrollView>
        <Divider />
        {loading && (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="small" color={colors.blue} />
          </View>
        )}
        {!loading && (
          <FlatList
            data={insights?.data}
            renderItem={({ item }) => {
              const currentTab = tabs.find((t) => t.id === selectedTab);
              // El título está en la subscripción
              // lo encuentro usando el data source id del insight
              const title = subscriptions?.find(
                (s) => s.data_source_id === item.data_source_id
              )?.label;
              return (
                <View>
                  <TweetItem
                    title={title || 'Sin título'}
                    text={item.content}
                    createdAt={item.created_at}
                    stats={{
                      totalTweets: item.stats.tweets,
                      totalRetweets: item.stats.retweets,
                      // TODO: Cambiar por el total de views
                      totalViews: 0,
                    }}
                  />
                  <Divider />
                </View>
              );
            }}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            // TODO: Cambiar por un componente de lista vacía
            ListEmptyComponent={<View />}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;

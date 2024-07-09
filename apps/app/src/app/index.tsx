import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import {
  BootScreen,
  LoginScreen,
  HomeScreen,
  BookmarksScreen,
} from '../screens';
import { authenticator, streamer } from '../lib';

const Drawer = createDrawerNavigator();

export const App = () => {
  const [booted, setBooted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handleBooted = () => {
    const isAuthenticated = authenticator.isAuthenticated();

    setAuthenticated(isAuthenticated);
    setBooted(true);
  };

  const handleLoggedIn = () => {
    setAuthenticated(true);
  };

  const handleLoggedOut = () => {
    setAuthenticated(false);
  };

  useEffect(() => {
    streamer.on('USER:LOGGED_OUT', handleLoggedOut);
    return () => {
      streamer.off('USER:LOGGED_OUT', handleLoggedOut);
    };
  }, []);

  if (!booted) {
    return <BootScreen onBooted={handleBooted} />;
  }

  if (!authenticated) {
    return <LoginScreen onLoggedIn={handleLoggedIn} />;
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Novedades">
        <Drawer.Screen name="Novedades" component={HomeScreen} />
        <Drawer.Screen name="Elementos Guardados" component={BookmarksScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;

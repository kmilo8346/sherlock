import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { LoginScreen, HomeScreen, BookmarksScreen } from '../screens';
import { streamer } from '../lib';

const Drawer = createDrawerNavigator();

export const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuthenticated = () => {
    setAuthenticated(true);
  };

  const handleUserLoggedIn = () => {};

  const handleUserLoggedOut = () => {};

  useEffect(() => {
    streamer.on('USER:LOGGED_IN', handleAuthenticated);
    streamer.on('USER:LOGGED_OUT', handleUserLoggedOut);
    return () => {
      streamer.off('USER:LOGGED_IN', handleAuthenticated);
      streamer.off('USER:LOGGED_OUT', handleUserLoggedOut);
    };
  }, []);

  if (!authenticated) {
    return <LoginScreen />;
  }
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Novedades" component={HomeScreen} />
        <Drawer.Screen name="Elementos Guardados" component={BookmarksScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;

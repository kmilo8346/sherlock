import React, { useState } from 'react';
import { SafeAreaView, StatusBar, Text, View, ScrollView } from 'react-native';
import styles from './styles';
import { Button, Input } from '@rneui/themed';
import { streamer } from '../../lib';
import colors from '../../styles/colors';

export const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const canSubmit = form.email && form.password;

  const handleInputChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      streamer.emit('USER:LOGGED_IN');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}
      >
        <ScrollView style={{ flex: 1, padding: 20 }}>
          <View style={{ height: '20%' }} />

          <Text style={{ fontSize: 32, fontWeight: 'bold' }}>
            Entérate lo que está pasando en el mundo sin morir en el intento
          </Text>

          <View style={{ height: '15%' }} />

          <Input
            label="Usuario"
            placeholder="Ingresa tu email"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(value) => handleInputChange('email', value)}
          />
          <Input
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            secureTextEntry={true}
            onChangeText={(value) => handleInputChange('password', value)}
          />

          <View style={{ height: '10%' }} />

          <Button
            title="Iniciar sesión"
            type="solid"
            onPress={handleLogin}
            loading={loading}
            disabled={!canSubmit}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default LoginScreen;

import React, { useState } from 'react';
import { SafeAreaView, StatusBar, Text, View, ScrollView } from 'react-native';
import styles from './styles';
import { Button, Input } from '@rneui/themed';
import { authClient } from '../../clients';
import { Credentials } from '@sherlock/models';
import { authenticator } from '../../lib';

export interface LoginScreenProps {
  onLoggedIn: () => void;
}

export const LoginScreen = (props: LoginScreenProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Credentials>({
    username: '',
    password: '',
  });

  const canSubmit = form.username && form.password;

  const handleInputChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const auth = await authClient.login(form);
      authenticator.signIn(auth);
      props.onLoggedIn();
    } catch (error) {
      console.error('Failed to login: ', error);
      // TODO: Mostrar mensaje de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView style={styles.scrollView}>
          <View style={{ height: '20%' }} />

          <Text style={styles.message}>
            Entérate lo que está pasando en el mundo sin morir en el intento
          </Text>

          <View style={{ height: '15%' }} />

          <Input
            autoFocus
            label="Usuario"
            placeholder="Ingresa tu email"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(value) => handleInputChange('username', value)}
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

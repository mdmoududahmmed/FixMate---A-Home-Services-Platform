import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import api from '../services/api'; 
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

    const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { phone, password });
      await SecureStore.setItemAsync('token', res.data.accessToken);
      Alert.alert('Success', 'Login successful!');
      console.log('Attempting to navigate to /home');
      router.replace('/home');
    } catch (err: any) {
      console.log('Full Error:', err);
      // for prevent array from backend, we will check if the message is an array and join it into a string
      let msg = err.response?.data?.message || err.message || 'Login failed';
      if (Array.isArray(msg)) {
        msg = msg.join(', '); // 
      }
      Alert.alert('Error Details', String(msg));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Register"
        onPress={() => router.push('/register')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
});
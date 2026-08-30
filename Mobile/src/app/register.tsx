import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import api from '../services/api';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

    const handleRegister = async () => {
    try {
      await api.post('/auth/register', { fullName, phone, password, role: 'CUSTOMER' });
      Alert.alert('Success', 'Registered successfully! Please login.');
      router.back();
    } catch (err: any) {
      let msg = err.response?.data?.message || err.message || 'Registration failed';
      if (Array.isArray(msg)) {
        msg = msg.join(', ');
      }
      Alert.alert('Error Details', String(msg));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
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
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
});
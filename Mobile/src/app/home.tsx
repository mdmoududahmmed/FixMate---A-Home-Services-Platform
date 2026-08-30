import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const decoded: any = jwtDecode(token);
        if (decoded.role === 'CUSTOMER') {
          router.replace('/customer');
        } else if (decoded.role === 'TECHNICIAN') {
          // router.replace('/technician'); // future technician dashboard
        } else if (decoded.role === 'ADMIN') {
          // router.replace('/admin'); // future admin dashboard
        }
      }
    };
    checkRole();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#f4511e" />
      <Text style={{ marginTop: 10 }}>Redirecting to your dashboard...</Text>
    </View>
  );
}
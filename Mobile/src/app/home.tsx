import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          router.replace('/'); // টোকেন না থাকলে লগইন পেজে
          return;
        }

        const decoded: any = jwtDecode(token);
        const role = decoded.role;

        if (role === 'CUSTOMER') {
          router.replace('/customer'); // কাস্টমার ড্যাশবোর্ডে
        } else if (role === 'TECHNICIAN') {
          router.replace('/customer'); // আপাতত টেকনিশিয়ানও একই ড্যাশবোর্ডে
        } else if (role === 'ADMIN') {
          router.replace('/customer');
        } else {
          router.replace('/');
        }
      } catch (error) {
        console.error('Token decode error:', error);
        router.replace('/');
      }
    };

    checkRole();
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#f4511e" />
      <Text style={{ marginTop: 10, fontSize: 16, color: '#666' }}>Loading your dashboard...</Text>
    </View>
  );
}
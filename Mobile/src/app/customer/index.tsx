import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function CustomerDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Dashboard</Text>
      
      <View style={styles.menuContainer}>
        {/* 1st feature: সার্ভিস রিকোয়েস্ট */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push('/customer/request')}
        >
          <Text style={styles.menuText}>📋 Request Service</Text>
        </TouchableOpacity>

        {/* 2nd feature: টেকনিশিয়ান খোঁজা */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push('/customer/search')}
        >
          <Text style={styles.menuText}>🔍 Find Technician</Text>
        </TouchableOpacity>

        {/* 3rd feature: অর্ডার ট্র্যাকিং */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push('/customer/orders')}
        >
          <Text style={styles.menuText}>📦 My Orders / Tracking</Text>
        </TouchableOpacity>

        {/* 4th feature: মেসেজিং */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push('/customer/chat')}
        >
          <Text style={styles.menuText}>💬 Messages</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutButton}>
        <Button title="LOGOUT" onPress={handleLogout} color="#f4511e" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, marginTop: 20 },
  menuContainer: { flex: 1, justifyContent: 'center' },
  menuItem: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    elevation: 3, 
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  menuText: { fontSize: 18, fontWeight: '500', color: '#333' },
  logoutButton: { marginTop: 20, marginBottom: 30 }
});
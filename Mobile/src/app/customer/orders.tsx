import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '../../services/api';

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ডাটা লোড করার function
  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get('/service-requests/my-orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // everytime Orders পেজে ঢুকলেই ডাটা রিফ্রেশ হবে
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchOrders();
    }, [fetchOrders])
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#ffcc00';
      case 'ACCEPTED': return '#2196F3';
      case 'IN_PROGRESS': return '#ff9800';
      case 'COMPLETED': return '#4CAF50';
      case 'CANCELLED': return '#f44336';
      default: return '#999';
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2ECC71" />
        <Text>Loading your orders...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>📦 My Orders</Text>
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't placed any requests yet.</Text>
          </View>
        ) : (
          orders.map((order: any) => (
            <View key={order.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.categoryName}>{order.category.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
              <Text style={styles.description}>{order.description}</Text>
              <Text style={styles.location}>📍 {order.location}</Text>
              <Text style={styles.date}>
                {new Date(order.createdAt).toLocaleDateString('en-GB')}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#64748b' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryName: { fontSize: 18, fontWeight: '600', color: '#1e293b' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  description: { fontSize: 14, color: '#334155', marginBottom: 6 },
  location: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  date: { fontSize: 12, color: '#999', textAlign: 'right', marginTop: 4 },
});
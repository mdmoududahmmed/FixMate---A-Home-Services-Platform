import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function FindTechnicianScreen() {
  const router = useRouter();
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const res = await api.get('/technicians');
        setTechnicians(res.data);
      } catch (error) {
        console.error('Failed to load technicians', error);
        Alert.alert('Error', 'Could not load technicians. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTechnicians();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2ECC71" />
        <Text style={styles.loadingText}>Loading technicians...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>🔍 Find Technician</Text>
        
        {technicians.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={50} color="#999" />
            <Text style={styles.emptyText}>No technicians available right now.</Text>
          </View>
        ) : (
          technicians.map((tech: any) => (
            <TouchableOpacity 
              key={tech.id} 
              style={styles.card}
              onPress={() => router.push(`/customer/chat?id=${tech.id}`)}
            >
              <View style={styles.iconBox}>
                <Ionicons name="person-circle-outline" size={40} color="#2ECC71" />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{tech.fullName}</Text>
                <Text style={styles.phone}>📞 {tech.phone}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={24} color="#2ECC71" />
            </TouchableOpacity>
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
  loadingText: { marginTop: 10, color: '#64748b' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { marginTop: 10, fontSize: 16, color: '#64748b' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  iconBox: { marginRight: 15 },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: '600', color: '#1e293b' },
  phone: { fontSize: 14, color: '#64748b', marginTop: 4 },
});
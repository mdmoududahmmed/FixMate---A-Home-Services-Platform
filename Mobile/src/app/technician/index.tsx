import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import api from '../../services/api';

export default function TechnicianDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/technicians/jobs/pending');
      setJobs(res.data);
    } catch (error) {
      Alert.alert('Error', 'Could not load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true; // red flag remove

    const loadJobs = async () => {
      try {
        const res = await api.get('/technicians/jobs/pending');
        if (isMounted) setJobs(res.data);
      } catch (error) {
        Alert.alert('Error', 'Could not load jobs');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAction = async (jobId: number, action: 'accept' | 'reject') => {
    try {
      await api.post(`/technicians/jobs/${jobId}/${action}`);
      Alert.alert('Success', action === 'accept' ? 'Job accepted!' : 'Job rejected.');
      setLoading(true);
      fetchJobs();
    } catch (error) {
      Alert.alert('Error', 'Action failed');
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#2ECC71" style={{ marginTop: 50 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>🔧 Technician Dashboard</Text>
        {jobs.length === 0 ? (
          <Text style={styles.empty}>No pending jobs right now.</Text>
        ) : (
          jobs.map((job: any) => (
            <View key={job.id} style={styles.card}>
              <Text style={styles.category}>{job.category.name}</Text>
              <Text style={styles.desc}>{job.description}</Text>
              <Text style={styles.loc}>📍 {job.location}</Text>
              <Text style={styles.customer}>👤 {job.customer.fullName} ({job.customer.phone})</Text>
              <View style={styles.btnRow}>
                <TouchableOpacity style={[styles.btn, styles.accept]} onPress={() => handleAction(job.id, 'accept')}>
                  <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.reject]} onPress={() => handleAction(job.id, 'reject')}>
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9' },
  scrollContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 20 },
  empty: { textAlign: 'center', marginTop: 50, color: '#64748b' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 15, elevation: 3 },
  category: { fontSize: 18, fontWeight: 'bold', color: '#2ECC71' },
  desc: { fontSize: 14, color: '#333', marginVertical: 8 },
  loc: { fontSize: 14, color: '#666' },
  customer: { fontSize: 12, color: '#888', marginTop: 5 },
  btnRow: { flexDirection: 'row', marginTop: 15 },
  btn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
  accept: { backgroundColor: '#2ECC71' },
  reject: { backgroundColor: '#f44336' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
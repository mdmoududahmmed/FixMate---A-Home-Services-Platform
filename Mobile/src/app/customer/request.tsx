import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Alert, StyleSheet, 
  ScrollView, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function RequestServiceScreen() {
  const router = useRouter();
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  // ===== ক্যাটাগরি লোড করার জন্য নতুন স্টেট =====
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // ===== কম্পোনেন্ট লোড হওয়ার সময় ব্যাকএন্ড থেকে ক্যাটাগরি আনছে =====
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/service-categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Failed to load categories', error);
        Alert.alert('Error', 'Could not load service categories.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

      const handleSubmit = async () => {
    if (!selectedCategoryId || !description || !location) {
      Alert.alert('Oops!', 'Please select a service and fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      // request to backend api to create a new service request
      await api.post('/service-requests', {
        categoryId: selectedCategoryId,
        description,
        location,
      });

      Alert.alert('✅ Request Sent!', 'Your request has been submitted successfully.');
      router.back();
    } catch (error: any) {
      console.error('Request Error:', error);
      Alert.alert('Error', 'Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerSection}>
            <Text style={styles.pageTitle}>What do you need fixed? 🔧</Text>
            <Text style={styles.subTitle}>
              Tell us what service you need. We'll connect you with the best professional.
            </Text>
          </View>

          {/* dropdown selector (category) */}
          <View style={styles.card}>
            <View style={styles.labelRow}>
              <Ionicons name="construct-outline" size={22} color="#2ECC71" />
              <Text style={styles.label}>Service Type</Text>
            </View>
            {loadingCategories ? (
              <ActivityIndicator size="small" color="#2ECC71" />
            ) : (
              <View style={styles.pickerContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.optionItem,
                      selectedCategoryId === cat.id && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedCategoryId(cat.id)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedCategoryId === cat.id && styles.selectedOptionText,
                    ]}>
                      {cat.name}
                    </Text>
                    {selectedCategoryId === cat.id && (
                      <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* ===== Description ===== */}
          <View style={styles.card}>
            <View style={styles.labelRow}>
              <Ionicons name="document-text-outline" size={22} color="#2ECC71" />
              <Text style={styles.label}>Describe the issue</Text>
            </View>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Describe your problem clearly..." 
              placeholderTextColor="#999"
              multiline={true} 
              numberOfLines={4} 
              textAlignVertical="top"
              value={description} 
              onChangeText={setDescription} 
            />
          </View>

          {/* ===== Location ===== */}
          <View style={styles.card}>
            <View style={styles.labelRow}>
              <Ionicons name="location-outline" size={22} color="#2ECC71" />
              <Text style={styles.label}>Where are you located?</Text>
            </View>
            <TextInput 
              style={styles.input} 
              placeholder="Your full address" 
              placeholderTextColor="#999"
              value={location} 
              onChangeText={setLocation} 
            />
          </View>

          {/* ===== Continue button ===== */}
          <TouchableOpacity 
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Continue</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Go Back</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E8F5E9' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  headerSection: { marginTop: 10, marginBottom: 25 },
  pageTitle: { fontSize: 26, fontWeight: '700', color: '#1e293b', marginBottom: 5 },
  subTitle: { fontSize: 14, color: '#64748b', marginTop: 5, lineHeight: 22 },
  
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  label: { fontSize: 15, fontWeight: '600', color: '#334155', marginLeft: 10 },
  
  input: { fontSize: 16, color: '#1e293b', paddingVertical: 8, borderBottomWidth: 1.5, borderBottomColor: '#e2e8f0' },
  textArea: { minHeight: 80, textAlignVertical: 'top', borderBottomWidth: 1.5 },

  // ===== Dropdown Style =====
  pickerContainer: { marginTop: 5 },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
  },
  optionText: { fontSize: 16, color: '#333' },
  selectedOptionText: { color: '#2ECC71', fontWeight: '600' },

  submitBtn: {
    backgroundColor: '#2ECC71',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  submitBtnDisabled: { opacity: 0.7, elevation: 0 },
  submitBtnText: { color: '#ffffff', fontSize: 17, fontWeight: '700' },
  backBtn: { marginTop: 20, alignItems: 'center' },
  backBtnText: { color: '#64748b', fontSize: 15, fontWeight: '500' },
});
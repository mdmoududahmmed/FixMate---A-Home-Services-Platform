import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Keyboard, Platform, Alert, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); //which technician to chat with
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // keyboard height state for animation
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  // keyboard show/hide listener
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        // when keyboard shows, adjust the input box position
        Animated.timing(keyboardHeight, {
          toValue: e.endCoordinates.height + 40, 
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        // when keyboard hides, reset the input box position
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [keyboardHeight]);

  // function to load chat messages
  useEffect(() => {
    let isMounted = true; // flag to prevent state updates after component unmount

    const fetchMessages = async () => {
      if (!id) { // without a valid id, we can't fetch messages
        setMessages([]);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/messages/chat/${id}`);
        if (isMounted) {
          setMessages(res.data);
        }
      } catch (error) {
        console.error('Failed to load messages', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      isMounted = false; 
    };
  }, [id]);

  // function to send a new message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const receiverId = Number(id); 

    if (!receiverId) {
      Alert.alert('Error', 'Invalid receiver ID');
      return;
    }

    try {
      const res = await api.post('/messages', {
        receiverId: receiverId,
        content: newMessage,
      });
      setMessages((prev) => [...prev, res.data]); 
      setNewMessage('');
    } catch (error: any) {
      console.error('Full error:', error); 
      const msg = error?.response?.data?.message || error?.message || 'Could not send message';
      Alert.alert('Error Details', String(msg));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* header section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* message box scroll action */}
      <ScrollView 
        style={styles.messageArea} 
        contentContainerStyle={styles.messageContainer}
        keyboardShouldPersistTaps="handled"
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet. Say hello! 👋</Text>
          </View>
        ) : (
          messages.map((msg: any) => (
            <View key={msg.id} style={styles.messageRow}>
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>{msg.content}</Text>
                <Text style={styles.messageTime}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* input box - with keyboard animation */}
      <Animated.View style={[styles.inputContainer, { paddingBottom: keyboardHeight }]}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2ECC71',
    padding: 16,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  messageArea: { flex: 1 },
  messageContainer: { padding: 16, flexGrow: 1 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#64748b' },
  messageRow: { marginBottom: 12 },
  messageBubble: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: { fontSize: 16, color: '#1e293b' },
  messageTime: { fontSize: 11, color: '#999', marginTop: 4, alignSelf: 'flex-end' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 15, 
    left: 0,
    right: 0,
    zIndex: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#2ECC71',
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Keyboard, Platform, Alert, Animated, Easing, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Which technician to chat with
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Keyboard height state for animation
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  // Keyboard show/hide listener
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
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

  // Function to load chat messages
  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      if (!id) {
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

  // Function to send a text message
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

  // Function to pick an image/video from gallery and upload
  const handlePickMedia = async () => {
    const receiverId = Number(id);
    if (!receiverId) {
      Alert.alert('Error', 'Invalid receiver ID');
      return;
    }

    // Request permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to grant camera roll permissions to send media.');
      return;
    }

    // Launch image picker with updated mediaTypes array syntax
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      const localUri = selectedAsset.uri;
      const filename = localUri.split('/').pop() || 'upload.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      // Create FormData to send file to backend
      const formData = new FormData();
      formData.append('receiverId', String(receiverId));
      formData.append('file', {
        uri: localUri,
        name: filename,
        type: selectedAsset.type === 'video' ? 'video/mp4' : type,
      } as any);

      try {
        // Uploading media via API (omitting explicit Content-Type header so Axios manages boundary automatically)
        const res = await api.post('/messages/upload', formData, {
          headers: {
            Accept: 'application/json',
          },
        });
        setMessages((prev) => [...prev, res.data]);
      } catch (error: any) {
        // Capture and display the exact backend error message for debugging 400 error
        const errorMsg = error?.response?.data?.message || error?.message || 'Failed to upload media';
        console.error('Upload error details:', error?.response?.data);
        Alert.alert('Upload Error', typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat with Technician</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Message box scroll action */}
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
                {/* Render image if fileUrl exists */}
                {msg.fileUrl && (
                  <Image 
                    source={{ uri: msg.fileUrl }} 
                    style={styles.mediaImage} 
                    resizeMode="cover"
                  />
                )}
                {/* Render text content if available */}
                {msg.content ? <Text style={styles.messageText}>{msg.content}</Text> : null}
                <Text style={styles.messageTime}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Input box with media picker and send buttons */}
      <Animated.View style={[styles.inputContainer, { paddingBottom: keyboardHeight }]}>
        {/* Button to pick photo/video */}
        <TouchableOpacity style={styles.attachButton} onPress={handlePickMedia}>
          <Ionicons name="image" size={24} color="#2ECC71" />
        </TouchableOpacity>

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
  messageText: { fontSize: 16, color: '#1e293b', marginTop: 4 },
  mediaImage: { width: 200, height: 150, borderRadius: 8, marginBottom: 4 },
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
  attachButton: {
    padding: 8,
    marginRight: 6,
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
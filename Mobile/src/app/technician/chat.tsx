// Import necessary React hooks and React Native UI components
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet 
} from 'react-native';
// Import Expo Router hook to get parameters passed from the previous screen
import { useLocalSearchParams } from 'expo-router';
// Import configured Axios instance for API requests
import '../../services/api'; 
import api from '../../services/api';

export default function TechnicianChatScreen() {
  // Extracting customerId and customerName passed via navigation parameters
  const { customerId, customerName } = useLocalSearchParams();
  
  // State to store the list of messages in the chat
  const [messages, setMessages] = useState<any[]>([]);
  
  // State to store the text currently typed in the input box
  const [inputText, setInputText] = useState('');

  // useEffect hook to fetch chat history when the screen loads or customerId changes
  useEffect(() => {
    fetchChatHistory();
    
    // Set up a polling interval (fetches messages every 3 seconds for basic real-time updates)
    const interval = setInterval(fetchChatHistory, 3000);
    
    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, [customerId]);

  // Function to fetch chat history between the logged-in technician and the specific customer
  const fetchChatHistory = async () => {
    try {
      const response = await api.get(`/messages/chat/${customerId}`);
      setMessages(response.data); // Update messages state with backend data
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  // Function to send a new message to the customer
  const sendMessage = async () => {
    // Prevent sending empty or whitespace-only messages
    if (!inputText.trim()) return;

    try {
      // Send message payload to the backend API
      await api.post('/messages', {
        receiverId: Number(customerId),
        content: inputText,
      });
      setInputText('');       // Clear the input box after successful send
      fetchChatHistory();   // Immediately refresh chat history
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header showing the customer's name */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{customerName || 'Customer Chat'}</Text>
      </View>

      {/* FlatList to render the list of messages dynamically */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => {
          // Determine if the message was sent by the technician (me) or received from the customer
          const isMe = item.receiverId !== Number(customerId);
          return (
            <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.otherMessage]}>
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          );
        }}
        contentContainerStyle={styles.chatList}
      />

      {/* Bottom input container for typing and sending messages */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a reply..."
          value={inputText}
          onChangeText={setInputText} // Update state as the user types
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Stylesheet for styling the chat UI components
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 16, backgroundColor: '#00C853', alignItems: 'center' }, // Mint green theme header
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  chatList: { padding: 16 },
  messageBubble: { maxWidth: '75%', padding: 12, borderRadius: 8, marginBottom: 8 },
  myMessage: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },       // Light green bubble for technician messages
  otherMessage: { backgroundColor: '#fff', alignSelf: 'flex-start' },     // White bubble for customer messages
  messageText: { fontSize: 14, color: '#333' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 16, height: 40, backgroundColor: '#f9f9f9' },
  sendButton: { marginLeft: 8, backgroundColor: '#00C853', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' }
});
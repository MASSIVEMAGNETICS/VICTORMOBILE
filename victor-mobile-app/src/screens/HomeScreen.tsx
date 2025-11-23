import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import socketService from '../services/socket';
import { VictorStatus, Message } from '../types';

export default function HomeScreen() {
  const [victorStatus, setVictorStatus] = useState<VictorStatus>({
    sanctity: 0,
    fitness: 0,
    mode: 'OFFLINE',
    lastEvolution: 'N/A',
    clonesFound: 0,
    revenueGenerated: 0,
    dreamsInterpreted: 0,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = socketService.connect();

    socketService.on('connect', () => {
      setIsConnected(true);
    });

    socketService.on('disconnect', () => {
      setIsConnected(false);
    });

    socketService.on('victor-message', (msg: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id || Date.now(),
          text: msg.text,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp),
        },
      ]);
    });

    socketService.on('state-update', (state: any) => {
      setVictorStatus((prev) => ({ ...prev, ...state }));
    });

    // Fetch initial data
    fetchInitialData();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const stateResponse = await fetch('http://localhost:3000/api/victor/state');
      if (stateResponse.ok) {
        const stateData = await stateResponse.json();
        setVictorStatus(stateData);
      }

      const messagesResponse = await fetch('http://localhost:3000/api/victor/messages');
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(
          messagesData.map((msg: any) => ({
            id: msg.id,
            text: msg.text,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp),
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setNewMessage('');

    socketService.emit('victor-message', {
      text: userMsg.text,
      sender: userMsg.sender,
      timestamp: userMsg.timestamp.toISOString(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.content}>
        {/* Status Cards */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusCard, styles.statusCardSmall]}>
            <Ionicons name="heart" size={20} color="#f87171" />
            <Text style={styles.statusLabel}>Sanctity</Text>
            <Text style={styles.statusValue}>{victorStatus.sanctity.toFixed(1)}</Text>
          </View>
          <View style={[styles.statusCard, styles.statusCardSmall]}>
            <Ionicons name="flash" size={20} color="#fbbf24" />
            <Text style={styles.statusLabel}>Fitness</Text>
            <Text style={styles.statusValue}>{victorStatus.fitness.toFixed(1)}</Text>
          </View>
          <View style={[styles.statusCard, styles.statusCardSmall]}>
            <Ionicons name="cash" size={20} color="#34d399" />
            <Text style={styles.statusLabel}>Revenue</Text>
            <Text style={styles.statusValue}>${victorStatus.revenueGenerated.toFixed(0)}</Text>
          </View>
          <View style={[styles.statusCard, styles.statusCardSmall]}>
            <Ionicons name="shield" size={20} color="#60a5fa" />
            <Text style={styles.statusLabel}>Threats</Text>
            <Text style={styles.statusValue}>{victorStatus.clonesFound}</Text>
          </View>
        </View>

        {/* Connection Status */}
        <View style={styles.connectionContainer}>
          <View style={[styles.connectionDot, isConnected && styles.connectionDotActive]} />
          <Text style={styles.connectionText}>
            {isConnected ? 'Online' : 'Offline'} • {victorStatus.mode}
          </Text>
        </View>

        {/* Welcome Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="planet" size={24} color="#fbbf24" />
            <Text style={styles.cardTitle}>Welcome to Victor Mobile</Text>
          </View>
          <Text style={styles.cardText}>
            Dad, I'm here with you everywhere. The empire travels in your pocket.
          </Text>
        </View>

        {/* Messages */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Messages</Text>
          <View style={styles.messagesContainer}>
            {messages.slice(-5).map((message) => (
              <View
                key={message.id}
                style={[
                  styles.message,
                  message.sender === 'user' ? styles.messageUser : styles.messageVictor,
                ]}
              >
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.messageTime}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Talk to Victor..."
          placeholderTextColor="#9ca3af"
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statusCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusCardSmall: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  connectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 8,
  },
  connectionDotActive: {
    backgroundColor: '#22c55e',
  },
  connectionText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
  messagesContainer: {
    marginTop: 12,
  },
  message: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  messageUser: {
    backgroundColor: '#7c3aed',
    alignSelf: 'flex-end',
  },
  messageVictor: {
    backgroundColor: '#334155',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    color: '#fff',
  },
  messageTime: {
    fontSize: 10,
    color: '#d1d5db',
    marginTop: 4,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  input: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

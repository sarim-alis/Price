import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getConversationMessages, markMessagesAsRead } from '../../services/api';
import socketService from '../../services/socket';
import { colors } from '../../styles/colors';

export default function ChatScreen() {
  const router = useRouter();
  const { conversationId, otherUserName, otherUserId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  
  const [message, setMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get current user ID
  useEffect(() => {
    const getUserId = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUserId(user.id);
      }
    };
    getUserId();
  }, []);

  // Fetch messages
  const { data: messagesData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getConversationMessages(conversationId),
    enabled: !!conversationId,
  });

  const messages = messagesData?.messages || [];

  // Join conversation room and set up Socket.IO listeners
  useEffect(() => {
    if (!conversationId) return;

    const setupSocket = async () => {
      try {
        // Ensure socket is connected
        if (!socketService.isConnected()) {
          console.log('🔌 Socket not connected, connecting...');
          await socketService.connect();
        }
        
        console.log('✅ Socket connected:', socketService.isConnected());
        console.log('📍 Joining conversation room:', conversationId);

        // Join conversation room
        socketService.joinConversation(conversationId);
      } catch (error) {
        console.error('❌ Failed to setup socket:', error);
      }
    };

    setupSocket();

    // Listen for new messages
    const handleNewMessage = (newMessage) => {
      console.log('✅ New message received via Socket.IO:', newMessage);
      queryClient.setQueryData(['messages', conversationId], (old) => {
        console.log('Current messages state:', old);
        if (!old) return { messages: [newMessage] };
        const updated = {
          ...old,
          messages: [...old.messages, newMessage]
        };
        console.log('Updated messages state:', updated);
        return updated;
      });
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    // Listen for typing indicator
    const handleUserTyping = (data) => {
      if (data.userId !== currentUserId) {
        setOtherUserTyping(data.isTyping);
        if (data.isTyping) {
          setTimeout(() => setOtherUserTyping(false), 3000);
        }
      }
    };

    // Listen for messages read
    const handleMessagesRead = (data) => {
      console.log('Messages marked as read:', data);
      refetch();
    };

    socketService.onNewMessage(handleNewMessage);
    socketService.onUserTyping(handleUserTyping);
    socketService.onMessagesRead(handleMessagesRead);

    // Mark messages as read when entering chat (only if messages exist)
    if (messages.length > 0) {
      markMessagesAsRead(conversationId).catch((err) => {
        console.log('Could not mark messages as read:', err.message);
      });
      socketService.markAsRead(conversationId);
    }

    return () => {
      socketService.leaveConversation(conversationId);
      socketService.off('new_message', handleNewMessage);
      socketService.off('user_typing', handleUserTyping);
      socketService.off('messages_read', handleMessagesRead);
    };
  }, [conversationId, currentUserId, queryClient, refetch, messages.length]);

  // Auto-scroll to bottom when messages load
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages.length]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      console.log('Message is empty');
      return;
    }

    if (!conversationId) {
      console.log('No conversationId');
      return;
    }

    if (!otherUserId) {
      console.log('No otherUserId');
      return;
    }

    console.log('Sending message:', {
      conversationId,
      receiverId: otherUserId,
      message: message.trim()
    });

    const messageText = message.trim();
    setMessage('');

    // Send via Socket.IO
    socketService.sendMessage({
      conversationId,
      receiverId: otherUserId,
      message: messageText
    });

    // Stop typing indicator
    socketService.sendTyping(conversationId, false);
    setIsTyping(false);
  };

  const handleTyping = (text) => {
    setMessage(text);

    // Send typing indicator
    if (!isTyping && text.length > 0) {
      setIsTyping(true);
      socketService.sendTyping(conversationId, true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.sendTyping(conversationId, false);
    }, 2000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId?._id === currentUserId || item.senderId === currentUserId;
    
    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.message}
          </Text>
          <Text style={[
            styles.messageTime,
            isMyMessage ? styles.myMessageTime : styles.otherMessageTime
          ]}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{otherUserName || 'Chat'}</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{otherUserName || 'Chat'}</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={styles.errorText}>{error?.message || 'Failed to load messages'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{otherUserName || 'Chat'}</Text>
            {otherUserTyping && (
              <Text style={styles.typingIndicator}>typing...</Text>
            )}
          </View>
          <TouchableOpacity style={styles.headerRight}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color={colors.textMuted} />
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start the conversation!</Text>
            </View>
          }
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textMuted}
            value={message}
            onChangeText={handleTyping}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!message.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={message.trim() ? colors.textLight : colors.textMuted} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerRight: {
    padding: 4,
    width: 32,
  },
  typingIndicator: {
    fontSize: 12,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '75%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: colors.textLight,
  },
  otherMessageText: {
    color: colors.textPrimary,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  myMessageTime: {
    color: colors.textLight,
    opacity: 0.8,
    textAlign: 'right',
  },
  otherMessageTime: {
    color: colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    fontSize: 15,
    color: colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.backgroundDark,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 16,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
  },
});

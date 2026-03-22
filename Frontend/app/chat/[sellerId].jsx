// Imports.
import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { sellerIdStyles as styles } from "../../styles/seller-id";

// Frontend.
export default function ChatScreen() {
  // States.
  const router = useRouter();
  const { sellerId, sellerName, mobileTitle } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Send message.
  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: trimmed, sent: true, time: new Date() },
    ]);
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{sellerName || "Seller"}</Text>
          {mobileTitle ? (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              About: {mobileTitle}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Message body */}
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}>
        {messages.length === 0 ? (
          <View style={styles.emptyChat}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Start the conversation</Text>
            <Text style={styles.emptySubtitle}>
              Send a message to {sellerName || "the seller"} about this listing.
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.messageList} contentContainerStyle={styles.messageListContent} keyboardShouldPersistTaps="handled">
            {messages.map((msg) => (
              <View key={msg.id} style={[styles.bubble, msg.sent ? styles.bubbleSent : styles.bubbleReceived]}>
                <Text style={[styles.bubbleText, msg.sent && styles.bubbleSentText]}>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Message input */}
        <View style={styles.inputRow}>
          <TextInput style={styles.input} placeholder="Type a message..." placeholderTextColor={colors.textMuted} value={message} onChangeText={setMessage} multiline maxLength={500} onSubmitEditing={sendMessage} />
          <TouchableOpacity style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]} onPress={sendMessage} disabled={!message.trim()}>
            <Ionicons name="send" size={22} color={message.trim() ? colors.textLight : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


# Real-Time Messaging System Implementation

## ✅ Backend Implementation (COMPLETED)

### 1. Dependencies Installed
- `socket.io` - WebSocket server for real-time communication

### 2. Database Models Created

#### **Conversation Model** (`Backend/src/models/Conversation.js`)
- Stores conversation metadata between two users
- Fields:
  - `participants`: Array of User IDs
  - `mobileId`: Optional reference to mobile listing
  - `lastMessage`: Last message text
  - `lastMessageTime`: Timestamp of last message
  - `unreadCount`: Separate counters for buyer and seller

#### **Message Model** (`Backend/src/models/Message.js`)
- Stores individual messages
- Fields:
  - `conversationId`: Reference to conversation
  - `senderId`: User who sent the message
  - `receiverId`: User who receives the message
  - `message`: Message text
  - `isRead`: Boolean flag
  - `readAt`: Timestamp when read

### 3. REST API Endpoints (`Backend/src/routes/message/message.route.js`)

All routes require authentication (`auth` middleware):

- `POST /api/messages/conversation` - Get or create conversation
- `GET /api/messages/conversations` - Get all user conversations
- `GET /api/messages/conversation/:conversationId` - Get messages for conversation
- `POST /api/messages/send` - Send message (REST fallback)
- `PUT /api/messages/conversation/:conversationId/read` - Mark messages as read
- `DELETE /api/messages/:messageId` - Delete a message

### 4. Socket.IO Configuration (`Backend/src/config/socket.js`)

#### **Authentication**
- Uses JWT token from `socket.handshake.auth.token`
- Verifies token and attaches `userId` and `userRole` to socket

#### **Events Handled**
- `join_conversation` - Join a conversation room
- `leave_conversation` - Leave a conversation room
- `send_message` - Send a message in real-time
- `mark_read` - Mark messages as read
- `typing` - Send typing indicator

#### **Events Emitted**
- `new_message` - New message received
- `message_notification` - Notification for new message
- `messages_read` - Messages marked as read
- `user_typing` - User is typing
- `error` - Error occurred

### 5. Server Integration (`Backend/index.js`)
- HTTP server created with `http.createServer(app)`
- Socket.IO initialized with `initializeSocket(httpServer)`
- Server listens on port 5000 (or PORT env variable)

---

## 🚧 Frontend Implementation (IN PROGRESS)

### 1. Dependencies Installed
- `socket.io-client` - WebSocket client for React Native

### 2. Services Created

#### **Socket Service** (`Frontend/services/socket.js`)
Singleton service for managing WebSocket connection:
- `connect()` - Connect to Socket.IO server with JWT token
- `disconnect()` - Disconnect from server
- `joinConversation(conversationId)` - Join conversation room
- `leaveConversation(conversationId)` - Leave conversation room
- `sendMessage(data)` - Send message via WebSocket
- `markAsRead(conversationId)` - Mark messages as read
- `sendTyping(conversationId, isTyping)` - Send typing indicator
- Event listeners for: `new_message`, `message_notification`, `messages_read`, `user_typing`

#### **Message API Service** (`Frontend/services/api.js`)
REST API functions for messaging:
- `getOrCreateConversation(otherUserId, mobileId)` - Get or create conversation
- `getUserConversations()` - Get all conversations
- `getConversationMessages(conversationId, page, limit)` - Get messages with pagination
- `sendMessage(conversationId, receiverId, message)` - Send message (REST fallback)
- `markMessagesAsRead(conversationId)` - Mark messages as read

### 3. Next Steps (TODO)

#### **Update Messages Screens**
1. Update buyer messages screen (`Frontend/app/(tabs)/messages.jsx`)
2. Update seller messages screen (`Frontend/app/(seller-tabs)/messages.jsx`)
   - Fetch real conversations using `getUserConversations()`
   - Display conversation list with unread counts
   - Navigate to chat screen on tap

#### **Create Chat Screen**
1. Create chat screen component (`Frontend/app/chat/[conversationId].jsx`)
   - Display messages in scrollable list
   - Real-time message updates via Socket.IO
   - Send message input with send button
   - Typing indicator
   - Mark messages as read when viewing
   - Auto-scroll to bottom on new messages

#### **Integration**
1. Connect socket on app startup
2. Listen for message notifications globally
3. Update unread counts in real-time
4. Handle reconnection logic

---

## 📋 API Usage Examples

### REST API

#### Create/Get Conversation
```javascript
const conversation = await getOrCreateConversation(sellerId, mobileId);
```

#### Get All Conversations
```javascript
const conversations = await getUserConversations();
```

#### Get Messages
```javascript
const { messages, totalPages } = await getConversationMessages(conversationId, 1, 50);
```

### WebSocket

#### Connect
```javascript
import socketService from './services/socket';
await socketService.connect();
```

#### Join Conversation
```javascript
socketService.joinConversation(conversationId);
```

#### Send Message
```javascript
socketService.sendMessage({
  conversationId,
  receiverId,
  message: "Hello!"
});
```

#### Listen for Messages
```javascript
socketService.onNewMessage((message) => {
  console.log("New message:", message);
});
```

---

## 🔄 Message Flow

### Buyer → Seller
1. Buyer views mobile listing
2. Clicks "Chat" button
3. Frontend calls `getOrCreateConversation(sellerId, mobileId)`
4. Opens chat screen with conversation
5. Buyer types and sends message via Socket.IO
6. Server emits `new_message` to conversation room
7. Seller receives message in real-time
8. Server emits `message_notification` to seller's personal room

### Real-Time Updates
- Both users join conversation room via `join_conversation` event
- Messages sent via `send_message` event
- Both users receive via `new_message` event
- Typing indicators via `typing` event
- Read receipts via `mark_read` and `messages_read` events

---

## 🎯 Features Implemented

✅ JWT authentication for WebSocket connections  
✅ Conversation creation and management  
✅ Real-time message sending and receiving  
✅ Message read status tracking  
✅ Unread message counters  
✅ Typing indicators  
✅ Message pagination  
✅ Automatic reconnection  
✅ Room-based messaging (conversation rooms)  
✅ Personal notification rooms  
✅ REST API fallback for offline scenarios  

---

## 🔧 Configuration

### Backend
- Socket.IO server runs on same port as Express (5000)
- CORS configured for development and production
- WebSocket transport enabled

### Frontend
- Socket URL: `http://192.168.100.39:5000`
- Auto-reconnection enabled
- JWT token from AsyncStorage

---

## 📱 Next Implementation Steps

1. **Update Messages Screens** - Show real conversations
2. **Create Chat Screen** - Real-time messaging UI
3. **Connect Socket on App Start** - Initialize WebSocket connection
4. **Add Message Notifications** - Badge counts and push notifications
5. **Test End-to-End** - Buyer-seller messaging flow

---

## 🚀 How to Test

### Start Backend
```bash
cd Backend
npm start
```

### Start Frontend
```bash
cd Frontend
npm start
```

### Test Flow
1. Register/login as buyer
2. Register/login as seller (different device/emulator)
3. Buyer views seller's mobile listing
4. Buyer clicks chat button
5. Send messages back and forth
6. Verify real-time delivery
7. Check unread counts
8. Test typing indicators


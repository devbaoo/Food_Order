import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ChatScreen() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Tôi muốn ăn đồ tây nhưng mà phải healthy, tôi bị trào viêm da còn dị ứng lacto",
            isUser: true,
            timestamp: "8:10 p.m"
        },
        {
            id: 2,
            text: "Hi! Tôi là MôMênu của bạn. Tôi có thể đáp ứng 7749 yêu cầu của bạn từ A tới Á. Thiếu người yêu nhắn tin mỗi ngày hãy nhắn tin cho tôi. Mà phải tải app mới được trải nghiệm ớ nhen.",
            isUser: false,
            timestamp: "8:11 p.m"
        }
    ]);
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    const sendMessage = () => {
        if (inputText.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: inputText.trim(),
                isUser: true,
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            };

            setMessages(prev => [...prev, newMessage]);
            setInputText('');

            // Simulate AI response after a delay
            setTimeout(() => {
                const aiResponse = {
                    id: messages.length + 2,
                    text: "Tôi hiểu bạn muốn ăn đồ Tây mà vẫn healthy và phù hợp với tình trạng trào ngược dạ dày. Tôi sẽ gợi ý một số món ăn phù hợp cho bạn.",
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    })
                };
                setMessages(prev => [...prev, aiResponse]);
            }, 1500);
        }
    };

    useEffect(() => {
        // Auto scroll to bottom when new messages are added
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const renderMessage = (message: any) => {
        return (
            <View key={message.id} style={styles.messageContainer}>
                <Text style={styles.timestamp}>{message.timestamp}</Text>
                <View style={[
                    styles.messageBubble,
                    message.isUser ? styles.userMessage : styles.aiMessage
                ]}>
                    {!message.isUser && (
                        <View style={styles.aiAvatar}>
                            <Text style={styles.aiAvatarText}>AI</Text>
                        </View>
                    )}
                    <View style={[
                        styles.messageContent,
                        message.isUser ? styles.userMessageContent : styles.aiMessageContent
                    ]}>
                        <Text style={[
                            styles.messageText,
                            message.isUser ? styles.userMessageText : styles.aiMessageText
                        ]}>
                            {message.text}
                        </Text>
                    </View>
                    {message.isUser && (
                        <View style={styles.userAvatar}>
                            <Ionicons name="person" size={16} color="#FF6B35" />
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(home)')}>
                    <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>MOME AI</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Messages */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
            >
                {messages.map(renderMessage)}
            </ScrollView>

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inputContainer}
            >
                <View style={styles.inputWrapper}>
                    <TouchableOpacity style={styles.attachButton}>
                        <Ionicons name="happy-outline" size={24} color="#999" />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.textInput}
                        placeholder="Write something..."
                        placeholderTextColor="#999"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                    />

                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            inputText.trim() ? styles.sendButtonActive : null
                        ]}
                        onPress={sendMessage}
                        disabled={!inputText.trim()}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={inputText.trim() ? "#FF6B35" : "#999"}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
        paddingTop: 32
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    placeholder: {
        width: 34,
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    messagesContent: {
        padding: 20,
        paddingBottom: 100,
    },
    messageContainer: {
        marginBottom: 20,
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginBottom: 8,
    },
    messageBubble: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    userMessage: {
        justifyContent: 'flex-end',
    },
    aiMessage: {
        justifyContent: 'flex-start',
    },
    aiAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#6c757d',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    aiAvatarText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    userAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#ffe8d6',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    messageContent: {
        maxWidth: '75%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
    },
    userMessageContent: {
        backgroundColor: '#FF6B35',
        borderBottomRightRadius: 6,
    },
    aiMessageContent: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userMessageText: {
        color: '#fff',
    },
    aiMessageText: {
        color: '#333',
    },
    inputContainer: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 15,
        gap: 12,
    },
    attachButton: {
        padding: 8,
    },
    textInput: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        maxHeight: 100,
        minHeight: 44,
        textAlignVertical: 'center',
    },
    sendButton: {
        padding: 8,
        borderRadius: 20,
    },
    sendButtonActive: {
        backgroundColor: '#ffe8d6',
    },
});
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Together from "together-ai";
import { useTranslation } from 'react-i18next';

export default function ChatScreen() {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: t("app.init_ai_chat"),
            isUser: false,
            timestamp: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const params = useLocalSearchParams();

    const together = new Together({
        baseURL: process.env.EXPO_PUBLIC_TOGETHER_BASE_URL,
        apiKey: process.env.EXPO_PUBLIC_TOGETHER_API_KEY
    });

    // Alternative: Using Together AI (Free credits)
    const callTogetherAPI = async (userMessage: any) => {
        try {
            const response = await together.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                model: "lgai/exaone-3-5-32b-instruct"
            });

            return response.choices[0].message?.content ?? "";
        } catch (error) {
            console.error('Together API Error:', error);
            throw error;
        }
    };

    // Fallback: Simple rule-based responses for demo
    const getFallbackResponse = (userMessage: any) => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('dinh dưỡng') || lowerMessage.includes('ăn gì')) {
            return t("app.nutrition_result");
        } else if (lowerMessage.includes('sức khỏe') || lowerMessage.includes('khỏe mạnh')) {
            return t("app.health_result");
        } else if (lowerMessage.includes('dạ dày') || lowerMessage.includes('tiêu hóa')) {
            return t("app.stomach_result");
        } else {
            return t("app.thanks_result");
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage = inputText.trim();
        const newUserMessage = {
            id: Date.now(),
            text: userMessage,
            isUser: true,
            timestamp: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })
        };

        // Add user message
        setMessages(prev => [...prev, newUserMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            let aiResponse;

            // Try different APIs in order of preference
            if (process.env.EXPO_PUBLIC_TOGETHER_API_KEY) {
                aiResponse = await callTogetherAPI(userMessage);
            } else {
                // Use fallback response for demo
                aiResponse = getFallbackResponse(userMessage);
            }

            // Clean up the response
            aiResponse = aiResponse ? aiResponse.replace(userMessage, '').trim() : "";
            if (!aiResponse) {
                aiResponse = getFallbackResponse(userMessage);
            }

            // Add AI response
            const aiMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                isUser: false,
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('AI API Error:', error);

            // Use fallback response on error
            const fallbackResponse = getFallbackResponse(userMessage);
            const errorMessage = {
                id: Date.now() + 1,
                text: fallbackResponse,
                isUser: false,
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const sendInitMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMessage = text.trim();
        const newUserMessage = {
            id: Date.now(),
            text: userMessage,
            isUser: true,
            timestamp: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })
        };

        // Add user message
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            let aiResponse;

            // Try different APIs in order of preference
            if (process.env.EXPO_PUBLIC_TOGETHER_API_KEY) {
                aiResponse = await callTogetherAPI(userMessage);
            } else {
                // Use fallback response for demo
                aiResponse = getFallbackResponse(userMessage);
            }

            // Clean up the response
            aiResponse = aiResponse ? aiResponse.replace(userMessage, '').trim() : "";
            if (!aiResponse) {
                aiResponse = getFallbackResponse(userMessage);
            }

            // Add AI response
            const aiMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                isUser: false,
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('AI API Error:', error);

            // Use fallback response on error
            const fallbackResponse = getFallbackResponse(userMessage);
            const errorMessage = {
                id: Date.now() + 1,
                text: fallbackResponse,
                isUser: false,
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Auto scroll to bottom when new messages are added
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    useEffect(() => {
        if (params && params.text) {
            sendInitMessage(params.text as string);
        }
    }, [params?.text]);

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
                <Text style={styles.headerTitle}>MOME AI (Free)</Text>
                <View style={styles.placeholder} />
            </View>

            {/* API Info Banner */}
            <View style={styles.infoBanner}>
                <Ionicons name="information-circle-outline" size={16} color="#666" />
                <Text style={styles.infoText}>
                    {t("app.use_api_key")}
                </Text>
            </View>

            {/* Messages */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
            >
                {messages.map(renderMessage)}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <View style={styles.loadingBubble}>
                            <ActivityIndicator size="small" color="#FF6B35" />
                            <Text style={styles.loadingText}>{t("app.ai_is_thinking")}</Text>
                        </View>
                    </View>
                )}
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
                        placeholder={t("app.input_message")}
                        placeholderTextColor="#999"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                        editable={!isLoading}
                    />

                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (inputText.trim() && !isLoading) ? styles.sendButtonActive : null
                        ]}
                        onPress={sendMessage}
                        disabled={!inputText.trim() || isLoading}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={(inputText.trim() && !isLoading) ? "#FF6B35" : "#999"}
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
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    infoText: {
        marginLeft: 5,
        fontSize: 12,
        color: '#666',
        flex: 1,
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
    loadingContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 20,
    },
    loadingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        marginLeft: 40,
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
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
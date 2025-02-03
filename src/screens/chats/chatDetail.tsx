import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Text, TextInput, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../config/colors';
import { ChatProvider } from '../../domain/chat/chatProvider';
import { useAppContext } from '../../contexts/appContext';
import { ChatItem, Message, User } from '../../config/data';

export default function ChatDetailScreen({ route, navigation }: { route: any, navigation: any }) {
    const { chatId } = route.params;
    const { user: me } = useAppContext()

    const [chat, setChat] = useState<ChatItem | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [messageText, setMessageText] = useState<string | null>(null);

    useEffect(() => {
        loadChat();
    }, [])


    useEffect(() => {
        if (chat == null) return;

        loadMessages();
        loadUsers();

    }, [chat])

    async function loadChat() {
        const chat = await ChatProvider.getChat(chatId);
        setChat(chat);
    }

    async function loadMessages() {
        if (chat == null) return;

        const chatMessages = await ChatProvider.loadMessages(chat.id);
        setMessages(chatMessages.messages);
    }

    async function loadUsers() {
        const users = await ChatProvider.getUsers();
        setUsers(users);
    }

    const handleSendMessage = () => {
        if (messageText && messageText.trim()) {
            setMessages(prevMessages => [
                ...prevMessages,
                { id: Date.now().toString(), text: messageText, userId: me!.id }
            ]);
            setMessageText(null);
        }
    };

    function getUserById(userId: string) {
        return users.find(u => u.id == userId)!;
    }

    const renderMessage = ({ item }: { item: Message }) => {
        const isMyMessage = item.userId === me!.id;
        const user = isMyMessage ? me! : getUserById(item.userId);

        return (
            <View style={[styles.messageContainer, isMyMessage ? styles.myMessageContainer : styles.userMessageContainer]}>
                {!isMyMessage && (
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                )}
                <View style={styles.messageContent}>
                    {!isMyMessage && <Text style={styles.senderName}>{user.name}</Text>}
                    <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.userMessage]}>
                        <Text style={isMyMessage ? styles.myMessageText : styles.userMessageText}>{item.text}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.chatContainer}>
            {
                chat != null &&
                <View style={styles.chatHeader}>

                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Icon name="angle-left" size={35} color={colors.darkPrimary} />
                        </TouchableOpacity>

                        <View style={styles.headerInfoContainer}>
                            <Image source={{ uri: chat.avatar }} style={styles.headerAvatar} />
                            <Text style={styles.headerName}>{chat.name}</Text>
                        </View>
                    </View>

                    <View style={styles.headerActionButton}>
                        <TouchableOpacity>
                            <IoniconsIcon name="call" size={22} color={colors.darkPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <IoniconsIcon name="videocam" size={22} color={colors.darkPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <IoniconsIcon name="information-circle" size={22} color={colors.darkPrimary} />
                        </TouchableOpacity>
                    </View>
                </View>
            }
            <FlatList
                data={[...messages].reverse()}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesContainer}
                inverted
            />

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Message"
                    style={styles.textInput}
                    value={messageText ?? ""}
                    onChangeText={setMessageText}
                    multiline
                    numberOfLines={4}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <IoniconsIcon name="send" size={15} color="#ffffff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 20
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#f9f9f9',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    headerActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    headerName: {
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 14,
    },
    headerAvatar: {
        width: 30,
        height: 30,
        borderRadius: 20,
    },
    messagesContainer: {
        paddingHorizontal: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#f2f2f2',
        color: colors.textColor
    },
    sendButton: {
        backgroundColor: colors.primary,
        width: 35,
        height: 35,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 5,
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
    },
    userMessageContainer: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    messageContent: {
        maxWidth: '80%',
    },
    senderName: {
        fontSize: 12,
        color: '#555',
        marginBottom: 2,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 18,
    },
    myMessage: {
        backgroundColor: colors.primary,
        alignSelf: 'flex-end',
    },
    userMessage: {
        backgroundColor: colors.lightGray,
        alignSelf: 'flex-start',
    },
    myMessageText: {
        color: '#ffffff',
    },
    userMessageText: {
        color: '#000',
    },
});

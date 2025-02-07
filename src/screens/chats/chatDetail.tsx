import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Text, TextInput, StyleSheet, FlatList, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../config/colors';
import { ChatProvider } from '../../domain/chat/chatProvider';
import { useAppContext } from '../../contexts/appContext';
import { ChatItem, Message, User } from '../../config/data';
import { Platform } from 'react-native';
import { openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { launchImageLibrary } from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import ChatPhotoModal from './chatPhoto';
import Avatar from '../../components/avatar';

const audioRecorderPlayer = new AudioRecorderPlayer();

export default function ChatDetailScreen({ route, navigation }: { route: any, navigation: any }) {
    const { chatId } = route.params;
    const { userId } = route.params;
    const { user: me } = useAppContext()

    const [chat, setChat] = useState<ChatItem | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [messageText, setMessageText] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioPath, setAudioPath] = useState<string | null>(null);

    const [startTime, setStartTime] = useState<number | null>(null);
    const [recordingTime, setRecordingTime] = useState('0:00,00');
    const [dotOpacity] = useState(new Animated.Value(1));
    const [allMedia, setAllMedia] = useState<string[]>([]);

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    useEffect(() => {
        const allMedia = messages.filter(m => m.mediaUris).flatMap(m => m.mediaUris);
        setAllMedia(allMedia as string[]);
    }, [messages])

    useEffect(() => {
        loadChat();
    }, [])

    useEffect(() => {
        if (isRecording) {
            const dotAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(dotOpacity, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dotOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            );
            dotAnimation.start();

            const timer = setInterval(() => {
                if (startTime) {
                    const elapsedTime = performance.now() - startTime;
                    const seconds = Math.floor(elapsedTime / 1000);
                    const milliseconds = Math.floor(elapsedTime % 1000);
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = seconds % 60;
                    setRecordingTime(formatTime(minutes, remainingSeconds, milliseconds));
                }
            }, 50);

            return () => {
                clearInterval(timer);
                dotAnimation.stop();
            };
        }
    }, [isRecording, startTime]);


    const formatTime = (minutes: number, seconds: number, milliseconds: number) => {
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        const formattedMilliseconds = String(milliseconds).padStart(3, '0').slice(0, 2);
        return `${formattedMinutes}:${formattedSeconds},${formattedMilliseconds}`;
    };

    useEffect(() => {
        handlePlayRecording();
    }, [audioPath])

    const handlePlayRecording = async () => {
        if (audioPath) {
            try {
                await audioRecorderPlayer.startPlayer(audioPath);
                setAudioPath(null);
                audioRecorderPlayer.addPlayBackListener((e) => {
                    if (e.currentPosition === e.duration) {
                        audioRecorderPlayer.removePlayBackListener();
                    }
                });
            } catch (error: any) {
                Alert.alert('Ошибка воспроизведения:', error?.message);
            }
        }
    };

    useEffect(() => {
        if (chat == null) return;

        loadMessages();
        loadUsers();

    }, [chat])

    async function loadChat() {
        if (chatId) {
            const chat = await ChatProvider.getChat(chatId);
            setChat(chat);
        }
        else {
            const chat: ChatItem = await ChatProvider.getChatByUser(userId);
            setChat(chat);
        }
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

    const handleStartRecording = async () => {
        const permissionResult = await requestMicrophonePermission();
        if (!permissionResult) return;

        try {
            await audioRecorderPlayer.startRecorder();
            setIsRecording(true);
            setStartTime(performance.now());

        } catch (error: any) {
            Alert.alert('Ошибка записи:', error?.message);
        }
    };

    async function requestMicrophonePermission(): Promise<boolean> {
        if (Platform.OS === 'android') {
            const requestResult = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
            if (requestResult === RESULTS.BLOCKED) {
                Alert.alert(
                    'Microphone Permission',
                    'To record voice messages, you need to grant permission to use the microphone. Please open settings and allow access.',
                    [{ text: 'Open Settings', onPress: () => openSettings() }]
                );
                return false;
            }
            if (requestResult === RESULTS.GRANTED) return true;
            return false;

        } else {
            const requestResult = await request(PERMISSIONS.IOS.MICROPHONE);
            if (requestResult === RESULTS.BLOCKED) {
                Alert.alert(
                    'Microphone Permission',
                    'To record voice messages, you need to grant permission to use the microphone. Please open settings and allow access.',
                    [{ text: 'Open Settings', onPress: () => openSettings() }]
                );
                return false;
            }
            if (requestResult === RESULTS.GRANTED) return true;
            return false;
        }
    }

    const handleStopRecording = async () => {
        try {
            const result = await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
            setIsRecording(false);
            setAudioPath(result);

        } catch (error) {
            console.error('Ошибка остановки записи:', error);
        }
    };

    const handleAttachMedia = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
            selectionLimit: 50,
        });

        if (result.didCancel) return;

        if (result.assets && result.assets.length > 0) {
            const mediaUris = result.assets.map(asset => asset.uri!);
            setMessages(prev => [
                ...prev,
                { id: Date.now().toString(), text: messageText ?? "", userId: me!.id, mediaUris }
            ]);
            setMessageText(null);
        }
    };

    const handleImagePress = (uri: string) => {
        const selectedIndex = allMedia.findIndex(m => m == uri);
        setSelectedImageIndex(selectedIndex);
    };

    // async function requestMediaLibraryPermission(): Promise<boolean> {
    //     if (Platform.OS === 'android') {
    //         const requestResult = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
    //         if (requestResult === RESULTS.BLOCKED) {
    //             Alert.alert(
    //                 'Permission Required',
    //                 'We need access to your media files to select photos and videos. Please open settings and allow access.',
    //                 [{ text: 'Open Settings', onPress: () => openSettings() }]
    //             );
    //             return false;
    //         }
    //         return requestResult === RESULTS.GRANTED;

    //     } else {
    //         const requestResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    //         if (requestResult === RESULTS.BLOCKED) {
    //             Alert.alert(
    //                 'Permission Required',
    //                 'We need access to your media library to select photos and videos. Please open settings and allow access.',
    //                 [{ text: 'Open Settings', onPress: () => openSettings() }]
    //             );
    //             return false;
    //         }
    //         return requestResult === RESULTS.GRANTED;
    //     }
    // }

    const renderMediaGrid = (mediaUris: string[]) => {
        const groupedMedia = [];
        for (let i = 0; i < mediaUris.length; i += 10) {
            groupedMedia.push(mediaUris.slice(i, i + 10));
        }

        return groupedMedia.map((group, index) => (
            <View key={index} style={styles.mediaGrid}>
                {
                    group.map((uri, uriIndex) => (
                        <TouchableOpacity onPress={() => handleImagePress(uri)}>
                            <FastImage
                                key={uriIndex}
                                source={{ uri }}
                                style={styles.mediaThumbnail}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                    ))
                }
            </View>
        ));
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMyMessage = item.userId === me!.id;
        const user = isMyMessage ? me! : getUserById(item.userId);
        const hasText = item.text && item.text.trim().length > 0; // проверяем, есть ли текст

        return (
            <View style={[styles.messageContainer, isMyMessage ? styles.myMessageContainer : styles.userMessageContainer]}>
                {!isMyMessage && (
                    <Avatar username={user.userName} avatarUrl={user.avatar} style={styles.avatar} size={40} />
                )}
                <View style={styles.messageContent}>
                    {!isMyMessage && <Text style={styles.senderName}>{user.name}</Text>}
                    <View style={[styles.messageBubble, isMyMessage ? (hasText ? styles.myMessage : styles.myMessageNoText) : styles.userMessage]}>
                        {item.mediaUris && renderMediaGrid(item.mediaUris)}
                        {item.text && (
                            <Text style={isMyMessage ? styles.myMessageText : styles.userMessageText}>
                                {item.text}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.chatContainer}>
            {
                selectedImageIndex != null &&
                <ChatPhotoModal images={allMedia} selectedIndex={selectedImageIndex} onClose={() => setSelectedImageIndex(null)} />
            }
            {
                chat != null &&
                <View style={styles.chatHeader}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Icon name="angle-left" size={35} color={colors.darkPrimary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.headerInfoContainer}
                            onPress={() => navigation.navigate('ChatSettings', { chatId, userId: chat.user.id })}
                        >
                            <Avatar username={chat.user.userName} avatarUrl={chat.user.avatar} style={styles.avatar} size={30} />
                            <Text style={styles.headerName}>{chat.user.name}</Text>
                        </TouchableOpacity>
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
                {
                    isRecording ? (
                        <View style={styles.recordingContainer}>
                            <Animated.View
                                style={[
                                    styles.recordingDot,
                                    { opacity: dotOpacity },
                                ]}
                            />
                            <Text style={styles.recordingText}>
                                {recordingTime}
                            </Text>
                        </View>
                    )
                        : (
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={handleAttachMedia} style={styles.attachButton}>
                                    <IoniconsIcon name="attach" size={25} color={colors.darkPrimary} />
                                </TouchableOpacity>
                                <TextInput
                                    placeholder="Message"
                                    style={styles.textInput}
                                    value={messageText ?? ""}
                                    onChangeText={setMessageText}
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>
                        )
                }

                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={messageText?.trim() ? handleSendMessage : undefined}
                    onLongPress={!messageText?.trim() ? handleStartRecording : undefined}
                    onPressOut={!messageText?.trim() ? handleStopRecording : undefined}
                >
                    <IoniconsIcon name={messageText?.trim() ? "send" : "mic"} size={15} color="#ffffff" />
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
    recordingContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 10,
        height: 40
    },
    recordingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        marginRight: 8,
    },
    recordingText: {
        color: colors.textColor,
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
        color: colors.textColor,
        height: 40
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
    myMessageNoText: {
        backgroundColor: 'transparent',
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
    attachButton: {
        marginRight: 10,
    },
    mediaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
        justifyContent: 'flex-end',
    },
    mediaThumbnail: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
    },
});


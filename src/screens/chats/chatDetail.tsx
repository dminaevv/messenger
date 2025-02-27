import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Image, Text, TextInput, StyleSheet, FlatList, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { ChatProvider } from '../../domain/chat/chatProvider';
import { useAppContext } from '../../contexts/appContext';
import { Platform } from 'react-native';
import { openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { launchImageLibrary } from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import ChatPhotoModal from './chatPhoto';
import Avatar from '../../components/avatar';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Links } from '../../config/links';
import { User } from '../../domain/user/user';
import { mapToMessage, Message } from '../../domain/chat/message';
import Loader from '../../components/Loader';

const audioRecorderPlayer = new AudioRecorderPlayer();

export default function ChatDetailScreen({ route, navigation }: { route: any, navigation: any }) {
    const { userId, groupId, avatar, username } = route.params;
    const { user: me, colors, isAuth, token } = useAppContext()

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
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

    const [isMessageLoading, setIsMessageLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [isMoreMessages, setIsMoreMessages] = useState<boolean>(true);

    // useEffect(() => {
    //     // const allMedia = messages.filter(m => m.mediaUris).flatMap(m => m.mediaUris);
    //     // setAllMedia(allMedia as string[]);
    // }, [messages])

    useEffect(() => {
        loadChatMessages(0);
    }, []);

    async function loadChatMessages(pageNumber: number) {
        if (!isAuth || isMessageLoading || !isMoreMessages) return;

        setIsMessageLoading(true);
        const result = await ChatProvider.getMessages(token, userId, pageNumber, 15, groupId);
        const newMessages = JSON.parse(result.data).messages.map(mapToMessage);

        setIsMessageLoading(false);

        if (newMessages.length > 0) {
            setMessages(prev => [...prev, ...newMessages]);
            setPage(pageNumber + 1);
        } else {
            setIsMoreMessages(false);
        }
    }

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

    const handleSendMessage = () => {
        // if (messageText && messageText.trim()) {
        //     setMessages(prevMessages => [
        //         ...prevMessages,
        //         { id: Date.now().toString(), text: messageText, userId: me!.id }
        //     ]);
        //     setMessageText(null);
        // }
    };

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
        // const result = await launchImageLibrary({
        //     mediaType: 'photo',
        //     quality: 1,
        //     selectionLimit: 50,
        // });

        // if (result.didCancel) return;

        // if (result.assets && result.assets.length > 0) {
        //     const mediaUris = result.assets.map(asset => asset.uri!);
        //     setMessages(prev => [
        //         ...prev,
        //         { id: Date.now().toString(), text: messageText ?? "", userId: me!.id, mediaUris }
        //     ]);
        //     setMessageText(null);
        // }
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
        if (!isAuth) throw new Error("");

        const isMyMessage = item.from_id === me!.id;
        const hasText = item.message && item.message.trim().length > 0;

        return (
            <View style={[styles.messageContainer, isMyMessage ? styles.myMessageContainer : styles.userMessageContainer]}>
                {!isMyMessage && (
                    <Avatar username={username} avatarUrl={avatar} style={styles.avatar} size={40} />
                )}
                <View style={styles.messageContent}>
                    {!isMyMessage && <Text style={[styles.senderName, { color: colors.textPlaceholderColor }]}>{username}</Text>}
                    <View style={[styles.messageBubble, isMyMessage ? (hasText ? (styles.myMessage, { backgroundColor: colors.primary }) : styles.myMessageNoText) : (styles.userMessage, { backgroundColor: colors.lightGray })]}>
                        {/* {item.mediaUris && renderMediaGrid(item.mediaUris)} */}
                        {item.message && (
                            <Text style={isMyMessage ? styles.myMessageText : { color: colors.text }}>
                                {item.message}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.chatContainer, { backgroundColor: colors.background }]}>
            {
                selectedImageIndex != null &&
                <ChatPhotoModal images={allMedia} selectedIndex={selectedImageIndex} onClose={() => setSelectedImageIndex(null)} />
            }
            <View style={[styles.chatHeader, { backgroundColor: colors.bottomMenuBackGroundColor, borderBottomColor: colors.lightGray }]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="angle-left" size={35} color={colors.darkPrimary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.headerInfoContainer}
                        onPress={() => navigation.navigate(Links.Chat.Settings, { userId, groupId })}
                    >
                        <Avatar username={username} avatarUrl={avatar} style={styles.avatar} size={30} />
                        <Text style={[styles.headerName, { color: colors.text }]}>{username}</Text>
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
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.messagesContainer}
                inverted
                ListFooterComponent={isMessageLoading ? <Loader /> : null}
                onEndReached={() => loadChatMessages(page)}
                onEndReachedThreshold={0.1}
            />

            <View style={[styles.inputContainer, { backgroundColor: colors.bottomMenuBackGroundColor }]}>
                {
                    isRecording ? (
                        <View style={styles.recordingContainer}>
                            <Animated.View
                                style={[
                                    styles.recordingDot,
                                    { opacity: dotOpacity },
                                ]}
                            />
                            <Text style={{ color: colors.text }}>
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
                                    style={[styles.textInput, { color: colors.text, backgroundColor: colors.inputBackgroundColor }]}
                                    value={messageText ?? ""}
                                    onChangeText={setMessageText}
                                    placeholderTextColor={colors.textPlaceholderColor}
                                    multiline
                                    numberOfLines={4}
                                />

                            </View>
                        )
                }

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setIsEmojiPickerVisible(prev => !prev)}>
                        <IoniconsIcon name="happy-outline" size={25} color={colors.darkPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: colors.primary }]}
                        onPress={messageText?.trim() ? handleSendMessage : undefined}
                        onLongPress={!messageText?.trim() ? handleStartRecording : undefined}
                        onPressOut={!messageText?.trim() ? handleStopRecording : undefined}
                    >
                        <IoniconsIcon name={messageText?.trim() ? "send" : "mic"} size={15} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(20),
    },
    recordingContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: moderateScale(8),
        borderRadius: moderateScale(10),
        height: verticalScale(40),
    },
    recordingDot: {
        width: moderateScale(10),
        height: moderateScale(10),
        borderRadius: moderateScale(5),
        backgroundColor: 'red',
        marginRight: moderateScale(8),
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(5),
        borderBottomWidth: moderateScale(1)
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
    },
    headerActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
    },
    headerName: {
        textAlign: 'center',
        fontWeight: '500',
        fontSize: moderateScale(14),
    },
    messagesContainer: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(10),
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(5),
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        borderRadius: moderateScale(20),
        padding: moderateScale(10),
        height: 40,
        marginRight: 5,
    },
    sendButton: {
        width: moderateScale(35),
        height: moderateScale(35),
        borderRadius: moderateScale(20),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: scale(10),
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: verticalScale(5),
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
    },
    userMessageContainer: {
        justifyContent: 'flex-start',
    },
    avatar: {
        marginRight: scale(10),
    },
    messageContent: {
        maxWidth: '80%',
    },
    senderName: {
        fontSize: moderateScale(12),
        marginBottom: verticalScale(2),
    },
    messageBubble: {
        padding: moderateScale(10),
        borderRadius: moderateScale(18),
    },
    myMessage: {
        alignSelf: 'flex-end',
    },
    myMessageNoText: {
        backgroundColor: 'transparent',
        alignSelf: 'flex-end',
    },
    userMessage: {
        alignSelf: 'flex-start',
    },
    myMessageText: {
        color: '#ffffff',
    },
    attachButton: {
        marginRight: scale(10),
    },
    mediaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: moderateScale(5),
        justifyContent: 'flex-end',
    },
    mediaThumbnail: {
        width: moderateScale(100),
        height: moderateScale(100),
        borderRadius: moderateScale(8),
        backgroundColor: '#f0f0f0',
    },
});


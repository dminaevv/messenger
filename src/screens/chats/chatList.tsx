import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';
import { ru } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ChatItem, chatsData } from '../../config/data';
import { ChatProvider } from '../../domain/chat/chatProvider';
import Avatar from '../../components/avatar';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useAppContext } from '../../contexts/appContext';
import { Links } from '../../config/links';
import { User } from '../../domain/user/user';
import { Chat, mapToChat } from '../../domain/chat/chat';
import Loader from '../../components/Loader';

export default function ChatListScreen({ navigation }: { navigation: any }) {
    const { colors, isAuth, token } = useAppContext();
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [originalChats, setOriginalChats] = useState<Chat[]>([]);
    const [chats, setChats] = useState<Chat[]>([]);
    const [isLoadingChats, setIsLoadingChats] = useState<boolean>(false);

    useEffect(() => {
        loadOnlineUsers();
        loadChats();
    }, []);

    async function loadOnlineUsers() {
        const onlineUsers = await ChatProvider.getOnlineUsers();
        setOnlineUsers(onlineUsers);
    }

    async function loadChats() {
        if (!isAuth) return;

        setIsLoadingChats(true);
        const result = await ChatProvider.getChats(token);
        setIsLoadingChats(false);
        const chatList = (result.data as any[]).map(mapToChat);
        setChats(chatList);
        setOriginalChats(chatList);
    }

    async function handleSearch(text: string) {
        if (!isAuth) return;

        setSearchQuery(text);

        // if (text.trim() === '') return setChats(originalChats);

        // setIsLoadingChats(true);
        // const result = await ChatProvider.search(token, text);
        // setChats((result.data as any[]).map(mapToChat));
        // setIsLoadingChats(false);

    }

    function formatChatTime(date: Date) {
        if (isToday(date)) {
            return format(date, 'HH:mm', { locale: ru });
        } else if (isYesterday(date)) {
            return 'yesterday';
        } else if (isThisWeek(date)) {
            return format(date, 'EEEE', { locale: ru });
        } else if (isThisYear(date)) {
            return format(date, 'dd.MM', { locale: ru });
        } else {
            return format(date, 'dd.MM.yy', { locale: ru });
        }
    }

    const renderChatItem = (item: Chat) => (
        <TouchableOpacity
            style={[styles.chatItem, { borderBottomColor: colors.lightGray }]}
            onPress={() => navigation.navigate(Links.Chat.Detail, { userId: item.user_id, groupId: item.group_id, username: item.username, avatar: item.avatar })}
        >
            <Avatar avatarUrl={item.avatar} username={item.username} />
            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={[styles.chatName, { color: colors.text }]}>{item.username}</Text>
                    {item.time != null && (
                        <Text style={[styles.chatTime, { color: colors.gray }]}>{formatChatTime(item.time)}</Text>
                    )}
                </View>
                <Text style={[styles.lastMessage, { color: colors.gray }]} numberOfLines={1}>
                    {item.text}
                </Text>
            </View>
        </TouchableOpacity>
    );

    // const renderOnlineUser = ({ item }: { item: User }) => (
    //     <TouchableOpacity
    //         style={styles.onlineUserContainer}
    //         onPress={() => navigation.navigate(Links.Chat.Detail, { userId: item.id })}
    //     >
    //         <View style={styles.onlineAvatarContainer} >
    //             <Avatar username={item.username} avatarUrl={item.avatar} style={styles.onlineAvatar} />
    //             <View style={styles.onlineIndicator} />
    //         </View>
    //         <Text style={styles.onlineUserName}>{item.first_name}</Text>
    //     </TouchableOpacity>
    // );

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <FlatList
                contentContainerStyle={{ paddingBottom: 20 }}
                ListHeaderComponent={
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={[styles.headerText, { color: colors.text }]}>Contacts</Text>
                        </View>

                        <View style={[styles.searchInputContainer, { backgroundColor: colors.inputBackgroundColor }]}>
                            <Icon name="search" size={14} color={colors.textPlaceholderColor} />
                            <TextInput
                                style={[styles.searchInput, { color: colors.text }]}
                                placeholder="Search"
                                placeholderTextColor={colors.textPlaceholderColor}
                                value={searchQuery}
                                onChangeText={handleSearch}
                            />
                        </View>

                        {/* <FlatList
                            data={onlineUsers}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderOnlineUser}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.onlineUsersList}
                        /> */}
                    </View>
                }
                data={chats}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderChatItem(item)}
                ListFooterComponent={
                    isLoadingChats ? (
                        <Loader />
                    ) : null
                }
                ListEmptyComponent={
                    isLoadingChats ? null : (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: colors.text }}>No contacts found</Text>
                        </View>
                    )
                }
            />
        </View>
    );
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: moderateScale(16),
    },
    headerText: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
    },
    chatItem: {
        flexDirection: 'row',
        padding: moderateScale(10),
        borderBottomWidth: 0.5,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: scale(10),
        marginBottom: verticalScale(10),
        borderRadius: moderateScale(18),
        paddingHorizontal: scale(10),
        height: 40,
    },
    searchInput: {
        flex: 1,
        marginLeft: scale(5),
    },
    chatInfo: {
        flex: 1,
        marginLeft: scale(10),
        justifyContent: 'center',
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chatName: {
        fontWeight: '500',
        fontSize: moderateScale(17),
    },
    chatTime: {
        fontSize: moderateScale(12),
    },
    lastMessage: {
        marginTop: verticalScale(2),
        fontSize: moderateScale(14),
    },
    onlineUsersList: {
        paddingVertical: verticalScale(10),
    },
    onlineUserContainer: {
        alignItems: 'center',
        marginHorizontal: scale(8),
    },
    onlineAvatarContainer: {
        position: 'relative',
    },
    onlineAvatar: {
        position: 'relative',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: moderateScale(14),
        height: moderateScale(14),
        borderRadius: moderateScale(7),
        backgroundColor: '#34c949',
        borderWidth: moderateScale(2),
        borderColor: '#fff',
    },
    onlineUserName: {
        marginTop: verticalScale(4),
        fontSize: moderateScale(12),
    },
});

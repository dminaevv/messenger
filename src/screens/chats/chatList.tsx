import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';
import { ru } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../config/colors';
import { ChatItem, chatsData, User } from '../../config/data';
import { ChatProvider } from '../../domain/chat/chatProvider';
import Avatar from '../../components/avatar';

export default function ChatListScreen({ navigation }: { navigation: any }) {
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadOnlineUsers();
    }, [])

    async function loadOnlineUsers() {
        const onlineUsers = await ChatProvider.getOnlineUsers();
        setOnlineUsers(onlineUsers);
    }
    const sortedChats = chatsData.sort((a, b) => {
        const timeA = a.time ? a.time.getTime() : new Date(0).getTime();
        const timeB = b.time ? b.time.getTime() : new Date(0).getTime();
        return timeB - timeA;
    });

    function formatChatTime(date: Date) {
        if (isToday(date)) {
            return format(date, 'HH:mm', { locale: ru });
        } else if (isYesterday(date)) {
            return 'вчера';
        } else if (isThisWeek(date)) {
            return format(date, 'EEEE', { locale: ru });
        } else if (isThisYear(date)) {
            return format(date, 'dd.MM', { locale: ru });
        } else {
            return format(date, 'dd.MM.yy', { locale: ru });
        }
    }

    const renderChatItem = (item: ChatItem) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('ChatDetail', { chatId: item.id })}
        >
            <Avatar avatarUrl={item.user.avatar} username={item.user.userName} />
            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>{item.user.name}</Text>
                    {item.time != null && <Text style={styles.chatTime}>{formatChatTime(item.time)}</Text>}
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.isGroup && item.lastMessageSender ? `${item.lastMessageSender}: ` : ''}
                    {item.lastMessage}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderOnlineUser = ({ item }: { item: User }) => (
        <TouchableOpacity
            style={styles.onlineUserContainer}
            onPress={() => navigation.navigate('ChatDetail', { userId: item.id })}
        >
            <View style={styles.onlineAvatarContainer} >
                <Avatar username={item.userName} avatarUrl={item.avatar} style={styles.onlineAvatar} />
                <View style={styles.onlineIndicator} />
            </View>
            <Text style={styles.onlineUserName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            contentContainerStyle={{ backgroundColor: '#fff', }}
            ListHeaderComponent={
                <>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Contacts</Text>
                        </View>

                        <View style={styles.searchInputContainer}>
                            <Icon name="search" size={14} color={colors.textPlaceholderColor} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        <FlatList
                            data={onlineUsers}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderOnlineUser}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.onlineUsersList}
                        />
                    </View>
                </>
            }
            data={sortedChats}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => renderChatItem(item)}
        />
    );
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textColor
    },
    chatItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#f0f0f0',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 18,
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 10,
        height: 40,

    },
    searchInput: {
        flex: 1,
        marginLeft: 5,
        color: colors.textColor
    },
    chatInfo: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chatName: {
        fontWeight: '500',
        fontSize: 17,
    },
    chatTime: {
        color: '#808080',
        fontSize: 12,
    },
    lastMessage: {
        color: '#808080',
        marginTop: 2,
        fontSize: 14
    },
    onlineUsersList: {
        paddingVertical: 10,
    },
    onlineUserContainer: {
        alignItems: 'center',
        marginHorizontal: 8,
    },
    onlineAvatarContainer: {
        position: 'relative'
    },
    onlineAvatar: {
        position: 'relative'
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#34c949',
        borderWidth: 2,
        borderColor: '#fff',
    },
    onlineUserName: {
        marginTop: 4,
        fontSize: 12,
        color: colors.textColor,
    },
});

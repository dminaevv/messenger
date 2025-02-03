import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';
import { ru } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../config/colors';
import { ChatItem, chatsData } from '../../config/data';

export default function ChatListScreen({ navigation }: { navigation: any }) {
    const [searchQuery, setSearchQuery] = useState('');

    const sortedChats = chatsData.sort((a, b) => b.time.getTime() - a.time.getTime());

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
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.chatTime}>{formatChatTime(item.time)}</Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.isGroup && item.lastMessageSender ? `${item.lastMessageSender}: ` : ''}
                    {item.lastMessage}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Contacts</Text>
            </View>
            <View style={styles.searchInputContainer}>
                <Icon name="search" size={14} color={colors.textPlaceholderColor} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                />
            </View>

            <FlatList
                data={sortedChats}
                keyExtractor={(item) => item.id.toString()}
                renderItem={(a) => renderChatItem(a.item)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
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
});

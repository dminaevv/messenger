import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, Dimensions, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ChatItem } from '../../config/data';
import { ChatProvider } from '../../domain/chat/chatProvider';
import Avatar from '../../components/avatar';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useAppContext } from '../../contexts/appContext';

const { width, height } = Dimensions.get('window');

export default function ChatSettingsScreen({ route, navigation }: { route: any, navigation: any }) {
    const { chatId, userId } = route.params;
    const [chat, setChat] = useState<ChatItem | null>(null);
    const { colors } = useAppContext();

    useEffect(() => {
        loadChat();
    }, [])

    async function loadChat() {
        const chat = await ChatProvider.getChatByUser(userId);
        setChat(chat);
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
            {chat && <>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color={colors.darkPrimary} />
                        <Text style={[styles.backButtonText, { color: colors.darkPrimary }]}>Back</Text>
                    </TouchableOpacity>
                    {
                        chat.user.avatar ? (
                            <ImageBackground style={styles.imageContainer} source={{ uri: chat.user.avatar }}>
                                {/* <Image source={{ uri: chat.user.avatar }} style={styles.headerAvatar} /> */}
                                {/* <BlurView style={styles.blurView} blurType="light" blurAmount={5} /> */}
                                {/* <Text style={styles.username}>{chat.user.name}</Text> */}
                            </ImageBackground>
                        )
                            : (
                                <View style={styles.avatarContainer}>
                                    <Avatar username={chat.user.username} size={width * 0.33} />
                                    <Text style={styles.name}>{chat.user.first_name ?? chat.user.username}</Text>
                                </View>
                            )
                    }
                </View>

                <View style={[styles.card, { backgroundColor: colors.inputBackgroundColor }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>User Settings</Text>
                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Theme')}>
                        <Icon name="paint-brush" size={20} color={colors.text} style={styles.icon} />
                        <Text style={[styles.optionText, { color: colors.text }]}>Theme</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Quick Reaction')}>
                        <Icon name="smile-o" size={20} color={colors.text} style={styles.icon} />
                        <Text style={[styles.optionText, { color: colors.text }]}>Quick Reaction</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Nicknames')}>
                        <Icon name="user" size={20} color={colors.text} style={styles.icon} />
                        <Text style={[styles.optionText, { color: colors.text }]}>Nicknames</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.card, { backgroundColor: colors.inputBackgroundColor }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Other Settings</Text>
                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Create Group Chat')}>
                        <Icon name="users" size={20} color={colors.text} style={styles.icon} />
                        <Text style={[styles.optionText, { color: colors.text }]}>Create Group Chat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Media, Files, and Links')}>
                        <Icon name="file" size={20} color={colors.text} style={styles.icon} />
                        <Text style={[styles.optionText, { color: colors.text }]}>Media, Files, and Links</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Search in Conversation')}>
                        <Icon name="search" size={20} color={colors.text} style={styles.icon} />
                        <Text style={[styles.optionText, { color: colors.text }]}>Search in Conversation</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Delete Conversation')}>
                        <Icon name="trash" size={20} color={colors.text} style={styles.icon} />
                        <Text style={[styles.optionText, { color: colors.text }]}>Delete Conversation</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Block Contact')}>
                        <Icon name="ban" size={20} color={colors.text} style={styles.icon} />
                        <Text style={[styles.optionText, { color: colors.text }]}>Block Contact</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Notifications')}>
                        <Icon name="bell" size={20} color={colors.text} style={styles.icon} />
                        <Text style={[styles.optionText, { color: colors.text }]}>Notifications</Text>
                    </TouchableOpacity>
                </View>
            </>
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f2f2f2',
        padding: scale(10),
    },
    headerContainer: {
        position: 'relative',
    },
    backButton: {
        borderRadius: moderateScale(20),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    backButtonText: {
        marginLeft: scale(5),
        fontSize: moderateScale(18),
    },
    card: {
        borderRadius: moderateScale(8),
        marginVertical: verticalScale(10),
        padding: moderateScale(15),
    },
    cardTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        marginBottom: verticalScale(10),
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(10),
    },
    icon: {
        marginRight: scale(15),
    },
    optionText: {
        fontSize: moderateScale(16),
    },
    imageContainer: {
        width: width - scale(20),
        height: height * 0.4,
        borderRadius: moderateScale(12),
    },
    avatarContainer: {
        width: width - scale(20),
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    name: {
        marginTop: verticalScale(10),
        fontSize: moderateScale(26),
        fontWeight: '600',
    },
    nameText: {
        color: '#fff',
        fontSize: moderateScale(18),
        fontWeight: '600',
    },
    overlayContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: moderateScale(15),
        alignItems: 'center',
    },
    blurView: {
        width: width - scale(20),
        height: (height * 0.4) * 0.15,
        position: 'absolute',
    },
    username: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: 'white',
        zIndex: 1,
    },
});

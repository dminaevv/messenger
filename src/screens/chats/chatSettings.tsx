import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, Dimensions, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../config/colors';
import { ChatItem } from '../../config/data';
import { ChatProvider } from '../../domain/chat/chatProvider';
import Avatar from '../../components/avatar';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

export default function ChatSettingsScreen({ route, navigation }: { route: any, navigation: any }) {
    const { chatId, userId } = route.params;
    const [chat, setChat] = useState<ChatItem | null>(null);

    useEffect(() => {
        loadChat();
    }, [])

    async function loadChat() {
        const chat = await ChatProvider.getChatByUser(userId);
        setChat(chat);
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {chat && <>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color={colors.darkPrimary} />
                        <Text style={styles.backButtonText}>Back</Text>
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
                                    <Avatar username={chat.user.userName} size={width * 0.33} />
                                    <Text style={styles.name}>{chat.user.name ?? chat.user.userName}</Text>
                                </View>
                            )
                    }
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>User Settings</Text>
                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Theme')}>
                        <Icon name="paint-brush" size={20} color="#333" style={styles.icon} />
                        <Text style={styles.optionText}>Theme</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Quick Reaction')}>
                        <Icon name="smile-o" size={20} color="#333" style={styles.icon} />
                        <Text style={styles.optionText}>Quick Reaction</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Nicknames')}>
                        <Icon name="user" size={20} color="#333" style={styles.icon} />
                        <Text style={styles.optionText}>Nicknames</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Other Settings</Text>
                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Create Group Chat')}>
                        <Icon name="users" size={20} color="#333" style={styles.icon} />
                        <Text style={styles.optionText}>Create Group Chat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Media, Files, and Links')}>
                        <Icon name="file" size={20} color="#333" style={styles.icon} />
                        <Text style={styles.optionText}>Media, Files, and Links</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Search in Conversation')}>
                        <Icon name="search" size={20} color="#333" style={styles.icon} />
                        <Text style={styles.optionText}>Search in Conversation</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Delete Conversation')}>
                        <Icon name="trash" size={20} color="#333" style={styles.icon} />
                        <Text style={styles.optionText}>Delete Conversation</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Block Contact')}>
                        <Icon name="ban" size={20} color="#333" style={styles.icon} />
                        <Text style={styles.optionText}>Block Contact</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert('Notifications')}>
                        <Icon name="bell" size={20} color="#333" style={styles.icon} />
                        <Text style={styles.optionText}>Notifications</Text>
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
        color: colors.darkPrimary,
        fontSize: moderateScale(18),
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: moderateScale(8),
        marginVertical: verticalScale(10),
        padding: moderateScale(15),
    },
    cardTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        marginBottom: verticalScale(10),
        color: '#333',
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
        color: '#333',
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

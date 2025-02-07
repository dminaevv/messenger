import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

export default function SettingsScreen() {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [username, setUsername] = useState<string>('User123');

    const selectAvatar = () => {
        ImagePicker.launchImageLibrary(
            {
                mediaType: 'photo',
            },
            (response) => {
                if (response.assets && response.assets.length > 0) {
                    setAvatar(response.assets[0].uri || null);
                }
            }
        );
    };

    return (
        <View style={styles.screen}>
            <TouchableOpacity style={styles.avatarContainer} onPress={selectAvatar}>
                <Image
                    source={avatar ? { uri: avatar } : require('../../assets/img/default_avatar.jpg')}
                    style={styles.avatar}
                />
                <Text style={styles.changeAvatarText}>Change Avatar</Text>
            </TouchableOpacity>

            <View style={styles.card}>
                <Text style={styles.label}>Username:</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your username"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#d3d3d3',
    },
    changeAvatarText: {
        color: '#007AFF',
        marginTop: 8,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 12,
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        color: '#333',
    },
    input: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16,
    },
});

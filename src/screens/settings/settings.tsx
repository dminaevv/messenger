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
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Avatar from '../../components/avatar';
import { useAppContext } from '../../contexts/appContext';
import { colors } from '../../config/colors';

export default function SettingsScreen() {
    const { user } = useAppContext()
    const [avatar, setAvatar] = useState<string | null>(user?.avatar ?? null);

    const [name, setName] = useState<string>(user?.name ?? "");
    const [surname, setSurname] = useState<string>(user?.surname ?? "");
    const [username, setUsername] = useState<string>(user?.userName ?? "");
    const [mail, setMail] = useState<string>(user?.mail ?? "");

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
                <Avatar
                    avatarUrl={avatar}
                    username={user!.userName}
                    size={scale(100)}
                />
                <Text style={styles.changeAvatarText}>Change Avatar</Text>
            </TouchableOpacity>

            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                />
                <TextInput
                    style={styles.input}
                    value={surname}
                    onChangeText={setSurname}
                    placeholder="surname"
                />
            </View>
            <Text style={[styles.subtitle, { marginBottom: 30 }]}>Enter a name and, if you want, add a photo to your profile.</Text>

            <View style={styles.card}>
                <View style={styles.cardRow}>
                    <Text style={styles.cardRowText}>Mail</Text>
                    <TextInput
                        style={[styles.input, styles.rightInput]}
                        value={mail}
                        onChangeText={setMail}
                        placeholder="Enter your mail"
                    />
                </View>
                <View style={styles.cardRow}>
                    <Text style={styles.cardRowText}>Username</Text>
                    <TextInput
                        style={[styles.input, styles.rightInput]}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Enter your username"
                    />
                </View>
            </View>
        </View>
    );
}

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: moderateScale(20),
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: verticalScale(20),
        marginBottom: verticalScale(5),
    },
    changeAvatarText: {
        color: '#007AFF',
        fontSize: scale(16),
        marginTop: verticalScale(4),
    },
    subtitle: {
        marginLeft: scale(20),
        marginTop: verticalScale(5),
        color: colors.gray
    },
    card: {
        backgroundColor: '#ffffff',
        padding: moderateScale(10),
        borderRadius: moderateScale(12),
        marginTop: verticalScale(10),
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(10),
    },
    cardRowText: {
        fontSize: moderateScale(16),
    },
    label: {
        fontSize: moderateScale(16),
        color: '#333',
    },
    input: {
        borderRadius: moderateScale(8),
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(8),
        fontSize: moderateScale(16),
    },
    rightInput: {
        textAlign: 'right',
        flex: 1
    }
});
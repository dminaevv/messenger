import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Switch,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Avatar from '../../components/avatar';
import { useAppContext } from '../../contexts/appContext';
import ConfirmModal from '../../components/confirmModal';

export default function SettingsScreen() {
    const { user, colors, theme, setTheme, logout } = useAppContext();
    const [avatar, setAvatar] = useState<string | null>(user?.avatar ?? null);
    const [name, setName] = useState<string>(user?.first_name ?? "");
    const [surname, setSurname] = useState<string>(user?.last_name ?? "");
    const [username, setUsername] = useState<string>(user?.username ?? "");
    const [mail, setMail] = useState<string>(user?.email ?? "");
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    function selectAvatar() {
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

    function toggleTheme() {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    function handleLogout() {
        setIsConfirmVisible(true);
    };

    function confirmLogout() {
        setIsConfirmVisible(false);
        logout();
    };

    return (
        <View style={[styles.screen, { backgroundColor: colors.background }]}>
            <ConfirmModal
                title='Are you sure?'
                message='Do you really want to log out?'
                visible={isConfirmVisible}
                onConfirm={confirmLogout}
                onCancel={() => setIsConfirmVisible(false)}
            />
            <TouchableOpacity style={styles.avatarContainer} onPress={selectAvatar}>
                <Avatar
                    avatarUrl={avatar}
                    username={user!.username}
                    size={scale(100)}
                />
                <Text style={[styles.changeAvatarText, { color: colors.primary }]}>
                    Change Avatar
                </Text>
            </TouchableOpacity>

            <View style={[styles.card, { backgroundColor: colors.inputBackgroundColor }]}>
                <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                    placeholderTextColor={colors.textPlaceholderColor}
                />
                <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={surname}
                    onChangeText={setSurname}
                    placeholder="Surname"
                    placeholderTextColor={colors.textPlaceholderColor}
                />
            </View>

            <Text style={[styles.subtitle, { color: colors.gray, marginBottom: 30 }]}>
                Enter a name and, if you want, add a photo to your profile.
            </Text>

            <View style={[styles.card, { backgroundColor: colors.inputBackgroundColor }]}>
                <View style={styles.cardRow}>
                    <Text style={[styles.cardRowText, { color: colors.text }]}>Mail</Text>
                    <TextInput
                        style={[styles.input, styles.rightInput, { color: colors.text }]}
                        value={mail}
                        onChangeText={setMail}
                        placeholder="Enter your mail"
                        placeholderTextColor={colors.textPlaceholderColor}
                    />
                </View>
                <View style={styles.cardRow}>
                    <Text style={[styles.cardRowText, { color: colors.text }]}>Username</Text>
                    <TextInput
                        style={[styles.input, styles.rightInput, { color: colors.text }]}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Enter your username"
                        placeholderTextColor={colors.textPlaceholderColor}
                    />
                </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.inputBackgroundColor }]}>
                <View style={styles.cardRow}>
                    <Text style={[styles.cardRowText, { color: colors.text }]}>
                        Theme: {theme === 'light' ? 'Light' : 'Dark'}
                    </Text>
                    <Switch
                        value={theme === 'dark'}
                        onValueChange={toggleTheme}
                        thumbColor={colors.primary}
                        trackColor={{ false: colors.gray, true: colors.primary }}
                    />
                </View>
            </View>

            <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.primary }]} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
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
        fontSize: scale(16),
        marginTop: verticalScale(4),
    },
    subtitle: {
        marginLeft: scale(20),
        marginTop: verticalScale(5),
    },
    card: {
        padding: moderateScale(10),
        borderRadius: moderateScale(12),
        marginTop: verticalScale(10),
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(10),
    },
    cardRowText: {
        fontSize: moderateScale(16),
    },
    input: {
        borderRadius: moderateScale(8),
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(8),
        fontSize: moderateScale(16),
    },
    rightInput: {
        textAlign: 'right',
        flex: 1,
    },
    logoutButton: {
        marginTop: verticalScale(20),
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(8),
        alignItems: 'center',
    },
    logoutButtonText: {
        color: 'white',
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
});

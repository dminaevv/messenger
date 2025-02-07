import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';

interface IProps {
    username: string;
    avatarUrl?: string | null;
    size?: number;
    style?: ViewStyle | ViewStyle[];
}

export default function Avatar({ username, avatarUrl, size = 50, style }: IProps) {
    const firstLetter = username.charAt(0).toUpperCase();

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            {avatarUrl ? (
                <Image
                    source={{ uri: avatarUrl }}
                    style={[styles.avatarImage, { width: size, height: size, borderRadius: size / 2 }]}
                />
            ) : (
                <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
                    <Text style={[styles.initialText, { fontSize: size * 0.4 }]}>{firstLetter}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImage: {
        resizeMode: 'cover',
    },
    circle: {
        backgroundColor: '#BDBDBD',
        alignItems: 'center',
        justifyContent: 'center',
    },
    initialText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

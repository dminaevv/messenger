import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const { width } = Dimensions.get('window');

interface IProps {
    images: string[];
    selectedIndex: number;
    onClose: () => void;
}

export default function ChatPhotoModal(props: IProps) {
    const [currentIndex, setCurrentIndex] = useState<number>(props.selectedIndex);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentIndex(props.selectedIndex);
        }, 500);

        return () => clearTimeout(timer);
    }, [props.selectedIndex]);

    const saveImage = () => {
        Alert.alert('Сохранено!', 'Фото сохранено на вашем устройстве');
    };

    const onSnapToItem = (index: number) => {
        setCurrentIndex(index);
    };

    const renderItem = ({ item }: any) => (
        <FastImage
            source={{ uri: item }}
            style={styles.fullScreenImage}
            resizeMode={FastImage.resizeMode.contain}
        />
    );

    return (
        <View style={styles.modalContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={props.onClose} style={styles.button}>
                    <Icon name="angle-left" size={35} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.photoNumber}>
                    {currentIndex + 1} из {props.images.length}
                </Text>

                <Menu>
                    <MenuTrigger>
                        <TouchableOpacity style={styles.button}>
                            <Icon name="ellipsis-v" size={20} color="#fff" />
                        </TouchableOpacity>
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption onSelect={saveImage}>
                            <Text style={styles.menuOptionText}>Сохранить</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>

            <Carousel
                data={props.images}
                renderItem={renderItem}
                sliderWidth={width}
                itemWidth={width}
                onSnapToItem={onSnapToItem}
                firstItem={currentIndex}
                loop={false}
                autoplay={false}
                useScrollView={true}
                inactiveSlideOpacity={1}
                inactiveSlideScale={1}
                vertical={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    fullScreenImage: {
        width: width,
        height: "100%",
    },
    header: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    button: {
        padding: 10,
    },
    photoNumber: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    menuOptionText: {
        color: '#000',
        padding: 10,
        fontSize: 16,
    },
});

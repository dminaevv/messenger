import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../contexts/appContext';
import { SOCKET_APP_URL, SOCKET_APP_PORT, SOCKET_DOMAIN, SOCKET_VERSION, SOCKET_PATH } from '@env';
import { Platform } from 'react-native';
import { LicenseProvider } from '../domain/license/LicenseProvider';
import { UserProvider } from '../domain/user/userProvider';
import { User } from '../domain/user/user';

interface IProps {
    user: User | null,
    token: string | null
}

export default function useWebSocket(props: IProps) {
    const FULL_CONNECT_URL = `${SOCKET_APP_URL}:${SOCKET_APP_PORT}`
    const platform = Platform.OS;

    const [licenseKey, setLicenseKey] = useState<string | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        getLicense();
    }, []);

    async function getLicense() {
        const license = await LicenseProvider.getLicense();
        setLicenseKey(license);
    }

    useEffect(() => {
        if (props.token == null || licenseKey == null || props.user == null) return;

        startSocket();
    }, [props.token, props.user, licenseKey])

    async function startSocket() {
        const contactIds = await getContacts();

        connectSocket(contactIds);
    }

    async function getContacts(): Promise<number[]> {
        if (props.token == null || props.userId == null) return [];

        const contacts = await UserProvider.getContacts(props.userId, props.token);
        const contactIds = contacts.map(c => c.id);

        return contactIds;
    }

    function connectSocket(contactIds: number[]) {
        if (licenseKey == null || props.userId == null) return;

        closeSocket();

        const SOCKET_URL = `${FULL_CONNECT_URL}/${SOCKET_PATH}?u=${props.userId}&key=${licenseKey}&domain=${SOCKET_DOMAIN}&v=${SOCKET_VERSION}&from=${platform}`;
        socketRef.current = new WebSocket(SOCKET_URL);

        socketRef.current.onopen = () => {
            console.log("WebSocket подключен");
            sendMessageWithContacts(contactIds);
        };

        socketRef.current.onclose = (event) => {
            console.log(`WebSocket закрыт: Код=${event.code}, Причина=${event.reason}`);
            reconnectSocket(contactIds);
        };

        socketRef.current.onerror = (error) => {
            console.error("Ошибка WebSocket", error);
            closeSocket();
            reconnectSocket(contactIds);
        };
    }

    function reconnectSocket(contactIds: number[]) {
        if (socketRef.current !== null) return;

        setTimeout(() => {
            if (socketRef.current === null) {
                connectSocket(contactIds);
            }
        }, 5000);
    }

    function sendMessageWithContacts(contactIds: number[]) {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const message = {
                id: 'send_online_status',
                data: {
                    user_id: props.userId,
                    contacts: contactIds
                }
            };

            socketRef.current.send(JSON.stringify(message));
            console.log('Сообщение отправлено: ', message);
        } else {
            console.error('WebSocket не подключен');
        }
    }

    function closeSocket() {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
    }

    function sendMessageToUser(recipientId: number, text: string) {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            console.error('WebSocket не подключен');
            return;
        }

        const timestamp = Date.now();
        const randomId = Math.floor(Math.random() * 1000000);

        const message = {
            id: 'vy_new_message',
            data: {
                user_id: recipientId,
                From: props.user?.id,
                Data: {
                    msg: {
                        id: randomId,
                        msgid: randomId,
                        text,
                        min_text: text,
                        push_text: text,
                        page_id: 0,
                        group_id: 0,
                        rd: 'no',
                        read: 'no',
                        seen: 0,
                        bg: 'yes',
                        time: new Date().toLocaleTimeString(),
                        timestamp,
                        curr_date: new Date().getDate(),
                        count: 1,
                        recipient: recipientId,
                        forwarded: 'no',
                        reply: null
                    },
                    user: {
                        group: 0,
                        socketid: props.user?.id,
                        id: props.user?.id,
                        fullname: props.user?.username, // Здесь можно взять из контекста
                        avatar: props.user?.avatar,
                        online_ago: 1,
                        online: 1
                    }
                },
                Hash: Math.random().toString(36).substring(7) // Не используется, но можно передавать
            }
        };

        socketRef.current.send(JSON.stringify(message));
        console.log('Личное сообщение отправлено:', message);
    }

    function sendMessageToGroup(groupId: number, text: string) {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            console.error('WebSocket не подключен');
            return;
        }

        const timestamp = Date.now();
        const randomId = Math.floor(Math.random() * 1000000);

        const message = {
            id: 'vy_ms__group_message',
            data: {
                Group_id: groupId,
                From: props.user?.id,
                Data: {
                    msg: {
                        id: randomId,
                        msgid: randomId,
                        text,
                        min_text: text,
                        push_text: text,
                        page_id: 0,
                        group_id: groupId,
                        rd: 'no',
                        read: 'no',
                        seen: 0,
                        bg: 'yes',
                        time: new Date().toLocaleTimeString(),
                        timestamp,
                        curr_date: new Date().getDate(),
                        count: 1,
                        recipient: 0,
                        forwarded: 'no',
                        reply: null
                    },
                    user: {
                        group: groupId,
                        socketid: props.user?.id,
                        id: props.user?.id,
                        fullname: props.user?.username,
                        avatar: props.user?.avatar,
                        online_ago: 1,
                        online: 1,
                        group_avatar: '',
                        group_name: ''
                    }
                },
                Hash: Math.random().toString(36).substring(7)
            }
        };

        socketRef.current.send(JSON.stringify(message));
        console.log('Групповое сообщение отправлено:', message);
    }

    return { sendMessageToUser, sendMessageToGroup };

};

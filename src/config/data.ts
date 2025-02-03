
export interface ChatItem {
    id: number;
    avatar: string;
    name: string;
    lastMessage: string;
    time: Date;
    isGroup: boolean;
    lastMessageSender?: string;
}

export interface User {
    id: string;
    name: string;
    avatar: string;
}

export interface Message {
    id: string;
    text: string;
    userId: string;
}

export const chatsData: ChatItem[] = [
    {
        id: 1,
        avatar: 'https://i.pravatar.cc/150?img=21',
        name: 'Work',
        lastMessage: 'Meeting tomorrow at 10:00',
        time: new Date('2025-01-30T08:15:00'),
        isGroup: false,
    },
    {
        id: 2,
        avatar: 'https://i.pravatar.cc/150?img=22',
        name: 'Peter',
        lastMessage: 'Sent the documents',
        time: new Date('2025-01-29T15:00:00'),
        isGroup: false,
    },
    {
        id: 3,
        avatar: 'https://i.pravatar.cc/150?img=23',
        name: 'Marina',
        lastMessage: 'When will we meet?',
        time: new Date('2025-01-28T11:00:00'),
        isGroup: false,
    },
    {
        id: 4,
        avatar: 'https://i.pravatar.cc/150?img=24',
        name: 'Igor Nikolaevich',
        lastMessage: 'We need to discuss the project',
        time: new Date('2024-12-25T10:00:00'),
        isGroup: false,
    },
    {
        id: 5,
        avatar: 'https://cdn.culture.ru/images/bf4aa2f8-a986-5468-83ed-b96c01015ce3',
        name: 'Family Group',
        lastMessage: 'Absolutely! Let’s plan something fun for next weekend',
        time: new Date('2025-01-31T09:20:00'),
        isGroup: true,
        lastMessageSender: 'You',
    },
];


export const users: User[] = [
    { id: '1', name: 'Emily Smith', avatar: 'https://i.pravatar.cc/150?img=21' },
    { id: '2', name: 'Michael Brown', avatar: 'https://i.pravatar.cc/150?img=22' },
    { id: '3', name: 'Sophia Davis', avatar: 'https://i.pravatar.cc/150?img=23' },
    { id: '4', name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?img=24' },
    { id: '5', name: 'Olivia Martinez', avatar: 'https://i.pravatar.cc/150?img=25' },
];

export const chatMessages = [
    {
        chatId: 1, messages: [
            { id: '0', text: 'Hey!', userId: '0' },
            { id: '1', text: 'Hey everyone! How was your weekend?', userId: '1' },
            { id: '2', text: 'Hi Emily! My weekend was great, went hiking.', userId: '0' },
        ]
    },
    {
        chatId: 2, messages: [
            { id: '0', text: 'Hey!', userId: '0' },
            { id: '1', text: 'Hey everyone! How was your weekend?', userId: '2' },
        ]
    },
    {
        chatId: 3, messages: [
            { id: '0', text: 'Hey!', userId: '3' }
        ]
    },
    {
        chatId: 4, messages: [
            { id: '0', text: 'Hey!', userId: '0' },
            { id: '1', text: 'Hey everyone! How was your weekend?', userId: '4' },
        ]
    },
    {
        chatId: 5, messages: [
            { id: '0', text: 'Hey!', userId: '0' },
            { id: '1', text: 'Hey everyone! How was your weekend?', userId: '1' },
            { id: '2', text: 'Hi Emily! My weekend was great, went hiking.', userId: '2' },
            { id: '3', text: 'That sounds awesome, Michael! I visited my grandparents.', userId: '3' },
            { id: '4', text: 'I had to work, unfortunately.', userId: '4' },
            { id: '5', text: 'Don’t worry, James. Next weekend will be better!', userId: '5' },
            { id: '6', text: 'Absolutely! Let’s plan something fun for next weekend.', userId: '0' },
        ]
    }
]
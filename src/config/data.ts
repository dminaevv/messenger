import { User } from "../domain/user/user";

export interface ChatItem {
    id: number;
    user: User;
    lastMessage?: string | null;
    time?: Date | null;
    isGroup: boolean;
    lastMessageSender?: string;
}

export interface Message {
    id: string;
    text: string;
    userId: string;
    mediaUris?: string[];
}

export const users: User[] = [
    { id: 1, email: "test@mail.ru", username: "test1", first_name: 'Emily', last_name: "Smith", avatar: null },
    { id: 2, email: "test@mail.ru", username: "test2", first_name: 'Michael', last_name: "Brown", avatar: 'https://i.pravatar.cc/150?img=22' },
    { id: 3, email: "test@mail.ru", username: "test3", first_name: 'Sophia', last_name: "Davis", avatar: 'https://i.pravatar.cc/150?img=23' },
    { id: 4, email: "test@mail.ru", username: "test4", first_name: 'James', last_name: "Wilson", avatar: 'https://i.pravatar.cc/150?img=24' },
    { id: 5, email: "test@mail.ru", username: "test5", first_name: 'Olivia', last_name: "Martinez", avatar: 'https://i.pravatar.cc/150?img=25' },
    { id: 6, email: "test@mail.ru", username: "test6", first_name: 'Liam', last_name: "Johnson", avatar: 'https://i.pravatar.cc/150?img=26' },
    { id: 7, email: "test@mail.ru", username: "test7", first_name: 'Ava', last_name: "White", avatar: 'https://i.pravatar.cc/150?img=27' },
    { id: 8, email: "test@mail.ru", username: "test8", first_name: 'Isabella', last_name: "Harris", avatar: 'https://i.pravatar.cc/150?img=28' },
    { id: 9, email: "test@mail.ru", username: "test9", first_name: 'Noah', last_name: "Clark", avatar: 'https://i.pravatar.cc/150?img=29' },
    { id: 10, email: "test@mail.ru", username: "test10", first_name: 'Ethan', last_name: "Lewis", avatar: 'https://i.pravatar.cc/150?img=30' },
    { id: 11, email: "test@mail.ru", username: "test11", first_name: 'Sophia', last_name: "White", avatar: 'https://i.pravatar.cc/150?img=31' },
    { id: 12, email: "test@mail.ru", username: "test12", first_name: 'Benjamin', last_name: "Scott", avatar: 'https://i.pravatar.cc/150?img=32' },
    { id: 13, email: "test@mail.ru", username: "test13", first_name: 'Ella', last_name: "Thompson", avatar: 'https://i.pravatar.cc/150?img=33' },
];


export const chatsData: ChatItem[] = [
    // {
    //     id: 1,
    //     user: users[0],
    //     lastMessage: 'Meeting tomorrow at 10:00',
    //     time: new Date('2025-01-30T08:15:00'),
    //     isGroup: false,
    // },
    {
        id: 2,
        user: users[1],
        lastMessage: 'Sent the documents',
        time: new Date('2025-01-29T15:00:00'),
        isGroup: false,
    },
    {
        id: 3,
        user: users[2],
        lastMessage: 'When will we meet?',
        time: new Date('2025-01-28T11:00:00'),
        isGroup: false,
    },
    {
        id: 4,
        user: users[3],
        lastMessage: 'We need to discuss the project',
        time: new Date('2024-12-25T10:00:00'),
        isGroup: false,
    },
    {
        id: 5,
        user: users[4],
        lastMessage: 'Absolutely! Let’s plan something fun for next weekend',
        time: new Date('2025-01-31T09:20:00'),
        isGroup: true,
        lastMessageSender: 'You',
    },
    {
        id: 6,
        user: users[5],
        lastMessage: 'How about a coffee this weekend?',
        time: new Date('2025-02-01T14:30:00'),
        isGroup: false,
    },
    {
        id: 7,
        user: users[6],
        lastMessage: 'Let’s catch up soon!',
        time: new Date('2025-02-02T12:45:00'),
        isGroup: false,
    },
    {
        id: 8,
        user: users[7],
        lastMessage: 'Can we reschedule our meeting?',
        time: new Date('2025-01-29T18:10:00'),
        isGroup: false,
    },
    // Added new chats
    {
        id: 9,
        user: users[8],
        lastMessage: 'Let’s have a video call tomorrow',
        time: new Date('2025-02-03T10:00:00'),
        isGroup: false,
    },
    {
        id: 10,
        user: users[9],
        lastMessage: 'The report is ready, check your email!',
        time: new Date('2025-02-04T16:15:00'),
        isGroup: false,
    },
    {
        id: 11,
        user: users[10],
        lastMessage: 'I’ll send you the updated proposal soon',
        time: new Date('2025-02-05T09:00:00'),
        isGroup: false,
    },
    {
        id: 12,
        user: users[11],
        lastMessage: 'Let’s catch up this weekend',
        time: new Date('2025-02-06T13:30:00'),
        isGroup: false,
    },
    {
        id: 13,
        user: users[12],
        lastMessage: 'Do you want to grab lunch tomorrow?',
        time: new Date('2025-02-07T08:45:00'),
        isGroup: false,
    }
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
    },
    {
        chatId: 6, messages: [
            { id: '0', text: 'Hey Liam!', userId: '0' },
            { id: '1', text: 'How about a coffee this weekend?', userId: '6' },
            { id: '2', text: 'Sounds great! When?', userId: '0' },
        ]
    },
    {
        chatId: 7, messages: [
            { id: '0', text: 'Hey Ava!', userId: '0' },
            { id: '1', text: 'Let’s catch up soon!', userId: '7' },
        ]
    },
    {
        chatId: 8, messages: [
            { id: '0', text: 'Hey Isabella!', userId: '0' },
            { id: '1', text: 'Can we reschedule our meeting?', userId: '8' },
            { id: '2', text: 'Sure, when works for you?', userId: '0' },
        ]
    },
    // Added new messages for the new chats
    {
        chatId: 9, messages: [
            { id: '0', text: 'Hey Noah!', userId: '0' },
            { id: '1', text: 'Let’s have a video call tomorrow', userId: '9' },
        ]
    },
    {
        chatId: 10, messages: [
            { id: '0', text: 'Hey Ethan!', userId: '0' },
            { id: '1', text: 'The report is ready, check your email!', userId: '10' },
        ]
    },
    {
        chatId: 11, messages: [
            { id: '0', text: 'Hey Sophia!', userId: '0' },
            { id: '1', text: 'I’ll send you the updated proposal soon', userId: '11' },
        ]
    },
    {
        chatId: 12, messages: [
            { id: '0', text: 'Hey Benjamin!', userId: '0' },
            { id: '1', text: 'Let’s catch up this weekend', userId: '12' },
        ]
    },
    {
        chatId: 13, messages: [
            { id: '0', text: 'Hey Ella!', userId: '0' },
            { id: '1', text: 'Do you want to grab lunch tomorrow?', userId: '13' },
        ]
    }
];

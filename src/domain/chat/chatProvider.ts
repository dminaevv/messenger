import { API_URL, API_KEY } from '@env';
import { chatMessages, chatsData, users } from "../../config/data";

export class ChatProvider {
    public static async getChats(token: string): Promise<any> {
        const responseUrl = API_URL;
        const response = await fetch(responseUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                cmd: 'api',
                action: 'get-conversations',
                api_key: API_KEY,
                session: token
            })
        })
            .then(response => response.json())
            .then(response => response);

        return response;
    }

    public static async getMessages(token: string, recipient_id: number | null, page: number, limit: number, group_id: number | null): Promise<any> {
        const responseUrl = API_URL;
        const response = await fetch(responseUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                cmd: 'api',
                action: 'get-messages',
                api_key: API_KEY,
                session: token,
                recipient_id,
                group_id,
                page_id: page
            })
        })
            .then(response => response.json())
            .then(response => response);

        return response;
    }

    public static async search(token: string, searchString: string): Promise<any> {
        const responseUrl = API_URL;
        const response = await fetch(responseUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                cmd: 'api',
                action: 'search-contacts',
                api_key: API_KEY,
                session: token,
                search_key: searchString
            })
        })
            .then(response => response.json())
            .then(response => response);

        return response;
    }

    public static async getChat(chatId: number) {
        return chatsData.find(c => c.id == chatId)!;
    }

    public static async getChatByUser(userId: number) {
        // let chat = chatsData.find(c => c.user.id == userId);
        // if (chat == null) {
        //     const user = await ChatProvider.getUser(userId);
        //     chat = { id: Date.now(), isGroup: false, user }
        // }

        // return chat;
    }

    public static async loadMessages(chatId: number) {
        return chatMessages.find(c => c.chatId == chatId)!;
    }

    public static async getUsers() {
        return users;
    }

    public static async getUser(id: string) {
        // return users.find(u => u.id == id)!;
    }


    public static async getOnlineUsers() {
        return users;
    }
}
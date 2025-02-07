import { chatMessages, chatsData, users } from "../../config/data";

export class ChatProvider {
    public static async getChat(chatId: number) {
        return chatsData.find(c => c.id == chatId)!;
    }

    public static async getChatByUser(userId: string) {
        let chat = chatsData.find(c => c.user.id == userId);
        if (chat == null) {
            const user = await ChatProvider.getUser(userId);
            chat = { id: Date.now(), isGroup: false, user }
        }

        return chat;
    }

    public static async loadMessages(chatId: number) {
        return chatMessages.find(c => c.chatId == chatId)!;
    }

    public static async getUsers() {
        return users;
    }

    public static async getUser(id: string) {
        return users.find(u => u.id == id)!;
    }


    public static async getOnlineUsers() {
        return users;
    }
}
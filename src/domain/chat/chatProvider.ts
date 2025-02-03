import { chatMessages, chatsData, users } from "../../config/data";

export class ChatProvider {
    public static async getChat(chatId: number) {
        return chatsData.find(c => c.id == chatId)!;
    }

    public static async loadMessages(chatId: number) {
        return chatMessages.find(c => c.chatId == chatId)!;
    }

    public static async getUsers() {
        return users;
    }
}
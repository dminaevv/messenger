export class Chat {
    constructor(
        public id: string,
        public user_id: string,
        public avatar: string | null,
        public first_name: string | null,
        public last_name: string | null,
        public fullname: string | null,
        public group_name: string | null,
        public group_id: string | null,
        public online: string,
        public online_status: number,
        public page_id: number,
        public showlastseen: string | null,
        public time: Date,
        public username: string,
        public text: string | null,
    ) { }
}

export function mapToChat(data: any) {
    return new Chat(
        data.id,
        data.user_id,
        data.avatar,
        data.first_name,
        data.last_name,
        data.fullname,
        data.group_name,
        data.group_id,
        data.online,
        data.online_status,
        data.page_id,
        data.showlastseen,
        new Date(data.time * 1000),
        data.username,
        data.text,
    )
}
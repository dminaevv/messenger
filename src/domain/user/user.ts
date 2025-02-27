export class User {
    constructor(
        public id: number,
        public first_name: string,
        public last_name: string,
        public username: string,
        public email: string,
        public avatar: string | null,
    ) { }
}

export function mapToUser(data: any) {
    return new User(
        data.id,
        data.first_name,
        data.last_name,
        data.username,
        data.email,
        data.avatar,
    )
}
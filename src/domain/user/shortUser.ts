export class ShortUser {
    constructor(
        public id: number,
        public avatar: string | null,
        public fullname: string,
        public online: boolean
    ) { }
}

export function mapToShortUser(data: any) {
    return new ShortUser(
        data.id,
        data.avatar,
        data.fullname,
        data.online,
    );
}
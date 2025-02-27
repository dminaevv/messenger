import { API_URL, API_KEY } from '@env';
import { mapToShortUser, ShortUser } from './shortUser';

export class UserProvider {
    public static async getContacts(userId: number, token: string,): Promise<ShortUser[]> {
        const responseUrl = API_URL;
        const response = await fetch(responseUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                cmd: 'api',
                action: 'get-contacts',
                api_key: API_KEY,
                session: token,
                recipient_id: userId
            })
        })
            .then(response => response.json())
            .then(response => response);

        return (response.data.users as any[]).map(mapToShortUser);
    }
}
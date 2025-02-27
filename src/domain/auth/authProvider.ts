import { API_URL, API_KEY } from '@env';

export class AuthProvider {
    public static async login(login: string, password: string): Promise<any> {
        const responseUrl = API_URL;
        const response = await fetch(responseUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                cmd: 'api',
                action: 'login',
                api_key: API_KEY,
                login,
                pass: password
            })
        })
            .then(response => response.json())
            .then(response => response);

        return response;
    }

    public static async me(session: string): Promise<any> {
        const responseUrl = API_URL;
        const response = await fetch(responseUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                cmd: 'api',
                action: 'me',
                api_key: API_KEY,
                session
            })
        })
            .then(response => response.json())
            .then(response => response);

        return response;
    }
}

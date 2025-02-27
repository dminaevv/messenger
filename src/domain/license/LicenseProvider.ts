import { API_URL, API_KEY } from '@env';

export class LicenseProvider {
    public static async getLicense() {
        const responseUrl = API_URL;
        const response = await fetch(responseUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                cmd: 'api',
                action: 'license',
                api_key: API_KEY,
            })
        })
            .then(response => response.json())
            .then(response => response);

        return response.data.license_key;
    }
}
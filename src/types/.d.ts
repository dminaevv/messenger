declare module '*.png';
declare module '*.jpg';
declare module '@env' {
    export const API_URL: string;
    export const API_KEY: string;
    export const IMAGE_BASE_URL: string;
    export const SOCKET_APP_URL: string;
    export const SOCKET_APP_PORT: string;
    export const SOCKET_DOMAIN: string;
    export const SOCKET_VERSION: string;
    export const SOCKET_PATH: string;
}

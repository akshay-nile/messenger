import type { Message, User, UserLogin, UserRegistration } from './models';

let token: string | null = null;
export let user: User | null = null;

export async function registerUser(userToRegister: UserRegistration): Promise<{ registered: boolean }> {
    const response = await fetch('/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userToRegister)
    });
    if (response.ok) return await response.json();
    return { registered: false };
}

export async function loginUser(userToLogin: UserLogin): Promise<boolean> {
    const response = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userToLogin)
    });
    if (response.ok) {
        const data = await response.json();
        if (data) {
            user = data.user;
            token = data.token;
            return true;
        }
    }
    return false;
}

export function logout() {
    token = user = null;
    localStorage.removeItem('token');
}

export async function getCurrentUser(email: string): Promise<User | null> {
    const response = await fetch('/user/' + encodeURIComponent(email));
    if (response.ok) user = await response.json();
    return user;
}

export async function getUsers(): Promise<User[] | null> {
    const response = await fetch('/users', {
        headers: { 'Authentication': 'Bearer ' + token }
    });
    if (response.ok) return await response.json();
    return null;
}

export async function getChatThread(other: string, refresh = false): Promise<Message[] | null> {
    const params = '?refresh=' + refresh;
    const response = await fetch('/chats/' + encodeURIComponent(other) + params, {
        headers: { 'Authentication': 'Bearer ' + token }
    });
    if (response.ok) return await response.json();
    return null;
}

export async function deleteChatThread(other: string): Promise<{ deleted: boolean }> {
    const response = await fetch('/chats/' + encodeURIComponent(other), {
        method: 'DELETE',
        headers: { 'Authentication': 'Bearer ' + token }
    });
    if (response.ok) return await response.json();
    return { deleted: false };
}

export async function sendMessage(other: string, message: string): Promise<{ stored: boolean }> {
    const response = await fetch('/chats/' + encodeURIComponent(other), {
        method: 'POST',
        headers: { 'Authentication': 'Bearer ' + token },
        body: message
    });
    if (response.ok) return await response.json();
    return { stored: false };
}
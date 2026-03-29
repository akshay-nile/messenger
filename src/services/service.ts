import type { Message, User, UserLogin, UserRegistration } from './models';

let token: string | null = localStorage.getItem('token');

export function isLoggedIn() {
    return !!token;
}

export function logout() {
    token = null;
    localStorage.removeItem('token');
}

export async function registerUser(user: UserRegistration): Promise<{ registered: boolean }> {
    const response = await fetch('/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    if (response.ok) return await response.json();
    return { registered: false };
}

export async function loginUser(user: UserLogin): Promise<boolean> {
    const response = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    if (response.ok) {
        const data = await response.json();
        if (data && data.token) {
            token = data.token;
            localStorage.setItem('token', data.token);
            return true;
        }
    }
    return false;
}

export async function checkUserExists(email: string): Promise<{ exists: boolean } | null> {
    const response = await fetch('/user/' + encodeURIComponent(email));
    if (response.ok) return await response.json();
    return null;
}

export async function getAllUsers(): Promise<User[] | null> {
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

export async function sendMessage(other: string, message: string): Promise<Message | null> {
    const response = await fetch('/chats/' + encodeURIComponent(other), {
        method: 'POST',
        headers: { 'Authentication': 'Bearer ' + token },
        body: message
    });
    if (response.ok) return await response.json();
    return null;
}
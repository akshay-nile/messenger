import type { Message, User, UserLogin, UserRegistration } from './models';

let token: string | null = localStorage.getItem('messenger-token');

export function isLoggedIn(): string | null {
    if (token) {
        const segment = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(segment + '='.repeat(segment.length % 4)));
        if (payload.exp * 1000 > Date.now()) return payload.email;
        else logout();
    }
    return null;
}

export function logout() {
    token = null;
    localStorage.removeItem('messenger-token');
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
            localStorage.setItem('messenger-token', data.token);
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
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if (response.ok) return await response.json();
    return null;
}

export async function getChatThread(other: string, refresh = false): Promise<Message[] | null> {
    const params = '?refresh=' + refresh;
    const response = await fetch('/chats/' + encodeURIComponent(other) + params, {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if (response.ok) return await response.json();
    return null;
}

export async function deleteChatThread(other: string): Promise<{ deleted: boolean }> {
    const response = await fetch('/chats/' + encodeURIComponent(other), {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if (response.ok) return await response.json();
    return { deleted: false };
}

export async function sendMessage(other: string, message: string): Promise<Message | null> {
    const response = await fetch('/chats/' + encodeURIComponent(other), {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: message
    });
    if (response.ok) return await response.json();
    return null;
}
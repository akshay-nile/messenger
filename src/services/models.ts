export interface User {
    name: string,
    email: string,
    active: boolean,
    unseen: number
}

export interface UserLogin {
    email: string,
    password: string
}

export interface UserRegistration extends UserLogin {
    name: string
}

export interface Message {
    message: string,
    sender: string,
    reciever: string,
    delivered: boolean,
    timestamp: number
}

export interface SDP {
    email: string,
    sdp: RTCSessionDescription,
}

export type Status = 'online' | 'typing' | 'refresh' | 'offline';

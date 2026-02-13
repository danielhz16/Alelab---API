
export interface User {
    id: number;
    name?: string | null;
    email: string;
    password?: string;
    tempToken?: string;
}

export interface Session {
    userId: number;
    ip: string;
    timeStamp: string;
}

export interface SessionsUser {
    User: UserProfile;
    sessions: string[];
}

export interface Token {
    sessionId: string;
    timeStamp: string;
}

export interface UserProfile {
    id: number;
    name: string | null;
    email: string;
}
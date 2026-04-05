export type User = {
    id: number;
    username: string;
    email: string;
    isActive: boolean;
    createdAt: string;
};

export type Post = {
    id: number;
    title: string;
    content: string;
    ownerId: number;
    createdAt: string;
    updatedAt: string | null;
    owner?: {
        id: number;
        username: string;
    };
};

export type AuthResponse = {
    access_token: string;
    token_type: string;
};

export type ApiError = {
    error: string;
    details?: unknown;
};
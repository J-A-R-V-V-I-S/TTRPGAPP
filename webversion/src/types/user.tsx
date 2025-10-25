// User and Authentication Types

interface User {
    id: string;
    username: string;
    email: string;
    isGameMaster: boolean;
    profilePicture?: string;
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    notificationsEnabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface UserPreferences {
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    notificationsEnabled?: boolean;
}

interface LoginCredentials {
    username: string;
    password: string;
}

interface RegisterCredentials extends LoginCredentials {
    email: string;
    confirmPassword: string;
    isGameMaster: boolean;
}

interface AuthResponse {
    user: User;
    token: string;
    refreshToken?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export type {
    User,
    UserPreferences,
    LoginCredentials,
    RegisterCredentials,
    AuthResponse,
    AuthState,
};


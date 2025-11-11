import { User } from "../../modules/user/user.types";

export interface UserCredentials {
    email: string;
    password: string;
}

export interface AuthUserInfo extends User {
}

export interface AuthTokenDetails {
    accessToken: string;
    expiresAt: string;
    userId: string;
}

export interface AuthResponse {
    token: AuthTokenDetails;
    user: AuthUserInfo;
}
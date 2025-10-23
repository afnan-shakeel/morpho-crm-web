export interface UserCredentials {
    email: string;
    password: string;
}

export interface AuthUserInfo {
    id: number;
    name: string;
    surname?: string;
    username: string;
    emailAddress: string;
}

export interface AuthTokenDetails {
    accessToken: string;
    expiresIn: number;
}

export interface TenantDetails {
    id: number;
    name: string;
    tenancyName: string;
}

export interface AuthResponse {
    tokenDetails: AuthTokenDetails;
    userDetails: AuthUserInfo;
    tenantDetails?: TenantDetails;
}
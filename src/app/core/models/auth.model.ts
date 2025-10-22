export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  userId: number;
//   user: {
//     id: number;
//     firstName: string;
//     lastName: string;
//     email: string;
//     role: 'Admin' | 'User';
//   };
}
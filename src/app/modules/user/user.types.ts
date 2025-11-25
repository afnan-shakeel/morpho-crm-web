

export interface User {
    id: string;
    firstName: string;
    lastName?: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    isActive?: boolean;
    roles?: string[];
}

export interface UserListData {
  data: User[];
  count: number;
  total: number;
  page: number;
  limit: number;
}
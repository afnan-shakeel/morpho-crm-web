import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

// Using the new @ path mapping
import { APP_CONFIG } from '@/core/config/app.config';
import { ApiBaseService } from '@/core/services/api-base.service';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiBase = inject(ApiBaseService);
  private config = inject(APP_CONFIG);

  // Example of using the base API service
  getUsers(): Observable<User[]> {
    return this.apiBase.get<User[]>('users');
  }

  getUserById(id: number): Observable<User> {
    return this.apiBase.get<User>(`users/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.apiBase.post<User, Partial<User>>('users', user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.apiBase.put<User, Partial<User>>(`users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.apiBase.delete<void>(`users/${id}`);
  }

  // Example of accessing config
  logApiUrl(): void {
    console.log('Current API URL:', this.config.apiUrl);
  }
}
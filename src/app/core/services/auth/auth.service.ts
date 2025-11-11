// src/app/core/services/auth.service.ts

import { AuthResponse, AuthUserInfo, UserCredentials } from '@/core/models/auth.model';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { MorphoApiResponse } from '../../models/api.model';
import { ApiBaseService } from '../http/api-base.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

    // A Subject/Signal would handle the current user state reactively
    // For now, let's keep it simple and focus on token retrieval.
    // BehaviorSubject holds the current value (initial state: false) and streams updates.
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkInitialAuthStatus());

    /** Public Observable stream for components to subscribe to the login status */
    public isLoggedIn$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
    private api = inject(ApiBaseService);

    constructor() {
    }


    /**
       * Attempts to log in the user via the API.
       * Uses RxJs operators (tap, catchError) for side effects and error handling.
       */
    login(credentials: UserCredentials): Observable<MorphoApiResponse<AuthResponse>> {

        // 1. Call the API using the ApiBaseService wrapper
        return this.api.post<MorphoApiResponse<AuthResponse>, UserCredentials>('auth/login', credentials).pipe(

            // 2. RxJs tap: Perform side effects upon successful response
            tap(response => {
                this.storeToken(response?.data?.token?.accessToken);
                this.storeUserInfo(response?.data?.user);
                this.isAuthenticatedSubject.next(true);
            }),

            // 3. RxJs catchError: Handle API errors (e.g., 401 Unauthorized)
            catchError(error => {
                this.isAuthenticatedSubject.next(false); // Ensure state is false

                // Re-throw the error for the consuming component to handle the UI feedback (e.g., "Invalid credentials")
                return throwError(() => new Error(error.error?.message || 'Login failed. Please check credentials.'));
            })
        );
    }

    public isAuthenticated(): boolean {
        return !!this.getAuthToken();
    }

    public getAuthToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    public getUserInfo(): AuthUserInfo | null {
        const userInfo = localStorage.getItem('user_info');
        return userInfo ? JSON.parse(userInfo) : null;
    }

    private storeToken(token: string): void {
        localStorage.setItem('auth_token', token);
    }

    private storeUserInfo(userInfo: AuthUserInfo): void {
        localStorage.setItem('user_info', JSON.stringify(userInfo));
    }

    private checkInitialAuthStatus(): boolean {
        return !!this.getAuthToken();
    }

    /**
   * Clears the authentication state and token.
   */
    logout(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        this.isAuthenticatedSubject.next(false);
    }
}





// // ... inside a login submission method

// this.authService.login(credentials).subscribe({
//   // ⚡ Success callback (The equivalent of .then() in Promises)
//   next: (response) => {
//     // Navigate to dashboard
//     this.router.navigate(['/dashboard']); 
//   },
//   // ⚡ Error callback (The equivalent of .catch() in Promises)
//   error: (err) => {
//     this.errorMessage = err.message; // Display "Login failed..."
//     this.isLoading = false;
//   }
// });
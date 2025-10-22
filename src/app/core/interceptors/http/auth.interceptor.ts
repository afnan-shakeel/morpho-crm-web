import { AuthService } from '@/core/services/auth.service';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    // ⚡ V20/Standalone Injection: Use inject()
    private authService = inject(AuthService); 

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.authService.getAuthToken();

        // 1. Check if a token exists
        if (authToken) {
            // 2. Clone the request to modify it (requests are immutable)
            const authReq = req.clone({
                // 3. Set the Authorization header in the industry-standard format
                setHeaders: {
                    Authorization: `Bearer ${authToken}` 
                }
            });

            // 4. Pass the cloned request to the next handler
            return next.handle(authReq);
        }

        // 5. If no token, just pass the original request without modification
        return next.handle(req);
    }
}
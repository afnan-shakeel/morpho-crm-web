

// craete a global error handler for http requests in angular
import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ToastService } from '../ui/toast.service';

// this service will handle api errors globally
// handle different status codes and show appropriate toast messages
// for example, 400 - show bad request message
// 401 - show unauthorized message
// 403 - show forbidden message
// 404 - show not found message
// 500 - show server error message
@Injectable({
    providedIn: 'root'
})
export class ApiErrorHandlerService {
    private toastService = inject(ToastService);

    handleError(error: HttpErrorResponse): Observable<never> {
        console.error('API error occurred:', error.error);
        switch (error.status) {
            case 400:
                // handle bad request errors with detailed messages if available
                if (error.error && error.error.details && Array.isArray(error.error.details)) {
                    // error.error.details.forEach((detail: string) => {
                    //     this.toastService.error(`Bad Request: ${detail.message}`);
                    // });
                    // Temporarily show a generic message instead of multiple toasts
                    this.toastService.error(`Please check your input.`);
                    break;
                } else if (error.error && error.error.message) {
                    this.toastService.error(`${error.error.message}`);
                    break;
                } else {
                    this.toastService.error('Please check your input.');
                }
                break;
            case 401:
                this.toastService.error('Unauthorized: Please log in again.');
                break;
            case 403:
                this.toastService.error('Forbidden: You do not have permission to access this resource.');
                break;
            case 404:
                if (error.error && error.error.message) {
                    this.toastService.error(`${error.error.message}`);
                } else {
                    this.toastService.error('Not Found: The requested resource could not be found.');
                }
                break;
            case 409:
                if (error.error && error.error.message) {
                    this.toastService.error(`${error.error.message}`);
                } else {
                    this.toastService.error('Conflict: The request could not be completed due to a conflict with the current state of the resource.');
                }
                break;
            case 500:
                this.toastService.error('Server Error: Please try again later.');
                break;
            default:
                this.toastService.error('An unexpected error occurred. Please try again later.');
        }
        return throwError('An error occurred while processing your request. Please try again later.');
    }
}

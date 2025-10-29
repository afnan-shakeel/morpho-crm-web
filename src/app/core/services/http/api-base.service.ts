// src/app/core/services/api-base.service.ts

import { APP_CONFIG } from '@/core/config/app.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Ensures it's a singleton accessible anywhere
})
export class ApiBaseService {
  
  // ⚡ Modern Angular Injection (v16+)
  // We use the inject() function to grab the HttpClient dependency.
  private http = inject(HttpClient); 
  private config = inject(APP_CONFIG);
  
  private readonly baseUrl = this.config.apiUrl; 

  // --- Type T is the expected response body, Type B is the request body ---

  /** Generic GET request */
  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`, { params: params });
  }
  // example usage with params:
  // const params = new HttpParams().set('key', 'value');
  // this.apiBaseService.get<YourType>('your/path', params);

  /** Generic POST request */
  post<T, B>(path: string, body: B): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body);
  }

  /** Generic PUT request */
  put<T, B>(path: string, body: B): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body);
  }
  
  /** Generic DELETE request */
  delete<T>(path: string): Observable<T> {
    // Angular handles the status codes internally. Use catchError in the feature service!
    return this.http.delete<T>(`${this.baseUrl}/${path}`);
  }
}
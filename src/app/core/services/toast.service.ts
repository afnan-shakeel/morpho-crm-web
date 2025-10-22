import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Toast {
  id: number; // Unique ID for tracking/dismissal
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number; // Duration in milliseconds
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  
  private toastQueue: Toast[] = [];
  // Subject will stream the entire queue array whenever it changes
  private queueSubject = new Subject<Toast[]>();
  
  /** Public Observable stream for the UI component to subscribe to the queue */
  public queue$: Observable<Toast[]> = this.queueSubject.asObservable();
  
  private nextId = 0;

  constructor() { }

  /**
   * Adds a toast message to the queue and notifies subscribers.
   */
  private addToast(toast: Omit<Toast, 'id'>): void {
    const newToast: Toast = { 
      ...toast, 
      id: this.nextId++ 
    };
    
    this.toastQueue.push(newToast);
    this.queueSubject.next(this.toastQueue); // Push the updated queue
  }

  /**
   * Removes a toast from the queue by its ID.
   * This is called automatically by the ToastContainerComponent after 'duration'.
   */
  public dismiss(id: number): void {
    this.toastQueue = this.toastQueue.filter(t => t.id !== id);
    this.queueSubject.next(this.toastQueue); // Push the new, shorter queue
  }

  // --- Public Shortcut Methods (Standard Durations) ---

  public success(message: string, duration: number = 4000): void {
    this.addToast({ message, type: 'success', duration });
  }

  public error(message: string, duration: number = 7000): void {
    this.addToast({ message, type: 'error', duration });
  }

  public info(message: string, duration: number = 5000): void {
    this.addToast({ message, type: 'info', duration });
  }
}
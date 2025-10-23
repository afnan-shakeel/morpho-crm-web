import { Toast, ToastService } from '@/core';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast-container',
  imports: [CommonModule],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css'
})
export class ToastContainer implements OnInit {
   public toastService = inject(ToastService); // Inject service publicly for template access
  
  ngOnInit(): void {
    // We subscribe here to manage the timers explicitly
    this.toastService.queue$.subscribe(queue => {
      // Set a timer for the LAST (newest) toast added to the queue
      const newestToast = queue[queue.length - 1];
      if (newestToast) {
        this.setDismissTimer(newestToast);
      }
    });
  }

  private setDismissTimer(toast: Toast): void {
    setTimeout(() => {
      // Dismiss the toast after its specified duration
      this.toastService.dismiss(toast.id);
    }, toast.duration);
  }
  
  // Method to apply Tailwind classes based on toast type
  public getToastClasses(type: Toast['type']): string {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-700 text-white';
    }
  }

}

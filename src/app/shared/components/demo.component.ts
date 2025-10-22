import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

// Using @ path mapping for different directories
import { ApiBaseService, APP_CONFIG, EnvironmentService } from '@/core';
import { UserService } from '@/features/users/user.service';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container">
      <h1>{{ config.appName }}</h1>
      
      <div class="environment-info">
        <h3>Environment Information</h3>
        <ul>
          <li><strong>Environment:</strong> {{ config.production ? 'Production' : 'Development' }}</li>
          <li><strong>API URL:</strong> {{ config.apiUrl }}</li>
          <li><strong>Version:</strong> {{ config.version }}</li>
          <li><strong>Logging:</strong> {{ config.enableLogging ? 'Enabled' : 'Disabled' }}</li>
          <li><strong>Debug Mode:</strong> {{ config.features.debugMode ? 'On' : 'Off' }}</li>
        </ul>
      </div>

      <div class="actions">
        <button (click)="testApiCall()" class="btn">Test API Call</button>
        <button (click)="loadUsers()" class="btn">Load Users</button>
      </div>

      <div class="users" *ngIf="users.length > 0">
        <h3>Users</h3>
        <ul>
          <li *ngFor="let user of users">{{ user.name }} ({{ user.email }})</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .environment-info {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    
    .environment-info ul {
      list-style: none;
      padding: 0;
    }
    
    .environment-info li {
      padding: 5px 0;
    }
    
    .actions {
      margin: 20px 0;
    }
    
    .btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      margin: 0 10px 10px 0;
      border-radius: 5px;
      cursor: pointer;
    }
    
    .btn:hover {
      background: #0056b3;
    }
    
    .users {
      background: #e9ecef;
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
    }
  `]
})
export class DemoComponent implements OnInit {
  // Clean imports using @ path mapping
  config = inject(APP_CONFIG);
  private apiService = inject(ApiBaseService);
  private userService = inject(UserService);
  private envService = inject(EnvironmentService);

  users: any[] = [];

  ngOnInit() {
    console.log('Demo component initialized');
    console.log('Current configuration:', this.config);
    
    // Log environment info
    if (this.envService.isProduction) {
      console.log('Running in production mode');
    } else {
      console.log('Running in development mode');
    }
  }

  testApiCall() {
    console.log('Testing API connection to:', this.config.apiUrl);
    
    // Example of direct API service usage
    this.apiService.get<any>('health').subscribe({
      next: (response) => {
        console.log('API Response:', response);
        alert('API call successful! Check console for details.');
      },
      error: (error) => {
        console.error('API Error:', error);
        alert('API call failed. This is expected if no backend is running.');
      }
    });
  }

  loadUsers() {
    console.log('Loading users...');
    
    // Example of feature service usage
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log('Users loaded:', users);
      },
      error: (error) => {
        console.error('Failed to load users:', error);
        // Mock data for demo purposes
        this.users = [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ];
        alert('Using mock data since no backend is available');
      }
    });
  }
}
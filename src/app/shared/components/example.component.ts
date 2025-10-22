import { APP_CONFIG, EnvironmentService } from '@/core';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `
    <div class="environment-info">
      <h2>{{ config.appName }}</h2>
      <p>Version: {{ config.version }}</p>
      <p>Environment: {{ config.production ? 'Production' : 'Development' }}</p>
      <p>API URL: {{ config.apiUrl }}</p>
      <p>Debug Mode: {{ config.features.debugMode ? 'Enabled' : 'Disabled' }}</p>
    </div>
  `
})
export class ExampleComponent implements OnInit {
  // Method 1: Direct injection of config
  config = inject(APP_CONFIG);
  
  // Method 2: Using the environment service
  private environmentService = inject(EnvironmentService);

  ngOnInit() {
    console.log('Current environment:', this.config);
    
    // Using environment service
    if (this.environmentService.isProduction) {
      console.log('Running in production mode');
    }
  }
}
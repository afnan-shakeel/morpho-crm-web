import { Injectable, inject } from '@angular/core';

export interface AppEnvironment {
  production: boolean;
  apiUrl: string;
  appName: string;
  version: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private readonly environment: AppEnvironment;

  constructor() {
    // Access environment variables from the global scope
    this.environment = {
      production: this.getEnvVariable('PRODUCTION', 'false') === 'true',
      apiUrl: this.getEnvVariable('API_URL', 'http://localhost:3000/api'),
      appName: this.getEnvVariable('APP_NAME', 'Morpho CRM'),
      version: this.getEnvVariable('VERSION', '1.0.0')
    };
  }

  get config(): AppEnvironment {
    return this.environment;
  }

  get isProduction(): boolean {
    return this.environment.production;
  }

  get apiUrl(): string {
    return this.environment.apiUrl;
  }

  private getEnvVariable(key: string, defaultValue: string): string {
    // In Angular 20, environment variables are available through globalThis
    return (globalThis as any)[`NG_APP_${key}`] || defaultValue;
  }
}
import { environment } from '@/environments/environment.development';
import { InjectionToken, Provider } from '@angular/core';

export interface AppConfig {
  production: boolean;
  apiUrl: string;
  appName: string;
  version: string;
  enableLogging: boolean;
  features: {
    analytics: boolean;
    debugMode: boolean;
  };
}

// Injection token for the environment configuration
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

// Provider factory for environment configuration
export function provideAppConfig(): Provider {
  return {
    provide: APP_CONFIG,
    useValue: environment
  };
}

// Helper function to access config in components/services
export function getAppConfig(): AppConfig {
  return environment;
}
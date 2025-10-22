/**
 * Path Mapping Quick Reference for Angular 20
 * 
 * ACTUAL WORKING EXAMPLES FROM THIS PROJECT:
 */

// ✅ CORE SERVICES & CONFIG (Barrel imports)
// import { ApiBaseService, EnvironmentService, APP_CONFIG } from '@/core';

// ✅ CORE SERVICES & CONFIG (Individual imports)  
// import { ApiBaseService } from '@/core/services/api-base.service';
// import { APP_CONFIG } from '@/core/config/app.config';
// import { EnvironmentService } from '@/core/services/environment.service';

// ✅ SHARED COMPONENTS (Barrel imports)
// import { DemoComponent, ExampleComponent } from '@/shared';

// ✅ SHARED COMPONENTS (Individual imports)
// import { DemoComponent } from '@/shared/components/demo.component';
// import { ExampleComponent } from '@/shared/components/example.component';

// ✅ FEATURE MODULES
// import { UserService } from '@/features/users/user.service';

// ✅ ENVIRONMENTS
// import { environment } from '@/environments/environment.development';
// import { environment as prodEnv } from '@/environments/environment.production';
// import { environment as stagingEnv } from '@/environments/environment.staging';

/**
 * PATH MAPPING PATTERNS:
 * 
 * @/*              -> src/app/*
 * @/core/*         -> src/app/core/*
 * @/shared/*       -> src/app/shared/*
 * @/features/*     -> src/app/features/*
 * @/layouts/*      -> src/app/layouts/*
 * @/environments/* -> src/environments/*
 * 
 * BENEFITS:
 * - No more ../../../ relative paths
 * - Refactor-safe imports
 * - Better IDE support and IntelliSense
 * - Consistent across the project
 */

export { }; // Make this a module to avoid global scope issues

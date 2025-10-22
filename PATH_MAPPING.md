# Path Mapping Configuration

This project uses TypeScript path mapping with the `@/` prefix for cleaner imports.

## Available Path Mappings

| Import Pattern | Maps to | Example Usage |
|---------------|---------|---------------|
| `@/*` | `src/app/*` | `import { Component } from '@/some-component'` |
| `@/core/*` | `src/app/core/*` | `import { ApiService } from '@/core/services/api.service'` |
| `@/shared/*` | `src/app/shared/*` | `import { ButtonComponent } from '@/shared/components/button'` |
| `@/features/*` | `src/app/features/*` | `import { UserService } from '@/features/users/user.service'` |
| `@/layouts/*` | `src/app/layouts/*` | `import { MainLayout } from '@/layouts/main-layout'` |
| `@/environments/*` | `src/environments/*` | `import { environment } from '@/environments/environment'` |

## Benefits

1. **Cleaner Imports**: No more `../../../` relative paths
2. **Refactor-Safe**: Moving files doesn't break imports
3. **IDE Support**: Full IntelliSense and auto-completion
4. **Consistent**: Same pattern across the entire project

## Example Usage

### Before (Relative Paths)
```typescript
import { ApiService } from '../../../core/services/api.service';
import { UserModel } from '../../models/user.model';
import { ButtonComponent } from '../../../shared/components/button.component';
```

### After (Path Mapping)
```typescript
import { ApiService } from '@/core/services/api.service';
import { UserModel } from '@/features/users/models/user.model';
import { ButtonComponent } from '@/shared/components/button.component';
```

## Barrel Exports

We also use barrel exports (`index.ts` files) to group related exports:

```typescript
// Import individual items
import { ApiService } from '@/core/services/api.service';
import { APP_CONFIG } from '@/core/config/app.config';

// Or import from barrel (recommended)
import { ApiService, APP_CONFIG } from '@/core';
```

## Configuration Files

- `tsconfig.json` - Main TypeScript configuration with path mappings
- `tsconfig.app.json` - Application-specific configuration
- `src/app/core/index.ts` - Core module barrel exports
- `src/app/shared/index.ts` - Shared module barrel exports

## Adding New Mappings

To add new path mappings, update both `tsconfig.json` and `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/new-module/*": ["app/new-module/*"]
    }
  }
}
```
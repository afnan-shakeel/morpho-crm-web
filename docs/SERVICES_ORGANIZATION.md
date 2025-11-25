# Services Organization Documentation

## Overview
We have reorganized the Angular services in the `src/app/core/services/` directory to improve maintainability and code organization. Services are now grouped by their domain and responsibility.

## New Folder Structure

```
src/app/core/services/
├── auth/                    # Authentication & Security Services
│   ├── auth.service.ts      # User authentication, login/logout
│   └── index.ts             # Auth services exports
├── business/                # Business Logic Services  
│   ├── leads.service.ts     # Lead management business logic
│   └── index.ts             # Business services exports
├── http/                    # HTTP & API Services
│   ├── api-base.service.ts  # Base HTTP client wrapper
│   └── index.ts             # HTTP services exports
├── navigation/              # Navigation & Routing Services
│   ├── menu.service.ts      # Menu state management
│   └── index.ts             # Navigation services exports
├── ui/                      # User Interface Services
│   ├── toast.service.ts     # Toast notification management
│   └── index.ts             # UI services exports
├── environment.service.ts   # Environment configuration (stays in root)
└── index.ts                 # Main services index file
```

## Service Categories

### 🔐 Authentication Services (`auth/`)
- **AuthService**: Manages user authentication, login/logout, token handling
- **Future**: Password reset, user registration, role management

### 💼 Business Services (`business/`)  
- **LeadsService**: Lead management, CRUD operations, business validation
- **Future**: Customer service, product service, order service

### 🌐 HTTP Services (`http/`)
- **ApiBaseService**: Base HTTP client with common API operations (GET, POST, PUT, DELETE)
- **Future**: Cache service, retry logic, request/response interceptors

### 🧭 Navigation Services (`navigation/`)
- **MenuService**: Menu state management, activation/deactivation, dynamic menu handling
- **Future**: Breadcrumb service, route guard service

### 🎨 UI Services (`ui/`)
- **ToastService**: Toast notification system with queuing and auto-dismiss
- **Future**: Modal service, loading service, theme service

### ⚙️ Core Services (root level)
- **EnvironmentService**: Application configuration and environment settings

## MenuService Features

The MenuService provides comprehensive menu management functionality:

### Key Features:
- **Observable-based state**: Uses BehaviorSubject for reactive menu state
- **Activation management**: Automatically handles menu item activation/deactivation
- **Submenu support**: Full support for nested menu items
- **Dynamic operations**: Add, remove, and update menu items at runtime

### Available Methods:
```typescript
// State Management
getMenuItems(): Observable<MenuItem[]>          // Get menu items as observable
getCurrentMenuItems(): MenuItem[]               // Get current menu state
isMenuItemActive(link: string): boolean         // Check if item is active

// Activation Control
activateMenuItem(link: string): void            // Activate item, deactivate others
deactivateMenuItem(link: string): void          // Deactivate specific item  
deactivateAllMenuItems(): void                  // Deactivate all items

// Dynamic Management
addMenuItem(menuItem: MenuItem): void           // Add new menu item
removeMenuItem(link: string): void              // Remove menu item
updateMenuItems(menuItems: MenuItem[]): void    // Replace entire menu
```

### Usage in Components:
```typescript
// In side-bar.ts component
export class SideBar implements OnInit, OnDestroy {
  menuItems$: Observable<MenuItem[]>;

  constructor(private menuService: MenuService) {
    this.menuItems$ = this.menuService.getMenuItems();
  }

  onMenuItemClick(link: string): void {
    this.menuService.activateMenuItem(link);
  }
}
```

## Import Patterns

All services can be imported from the core module using clean imports:

```typescript
// ✅ Clean imports from core module
import { MenuService, MenuItem, ToastService, AuthService } from '@/core';

// ❌ Avoid direct service imports (old pattern)
import { MenuService } from '@/core/services/navigation/menu.service';
```

## Benefits of This Organization

1. **🎯 Clear Separation of Concerns**: Each service category has a specific responsibility
2. **📦 Better Maintainability**: Related services are grouped together
3. **🔍 Easy Discovery**: Developers can quickly find services by domain
4. **🚀 Scalability**: Easy to add new services in appropriate categories
5. **📚 Clean Imports**: All services available through unified core module
6. **🔄 Reusability**: Well-organized services are easier to reuse across components

## Future Enhancements

### Navigation Services
- Breadcrumb service for complex navigation paths
- Route guard service for navigation protection
- Tab management service for tabbed interfaces

### UI Services  
- Modal service for dialog management
- Loading service for loading states
- Theme service for dark/light mode

### Business Services
- Customer service for customer management
- Product service for product catalog
- Order service for order processing

This organization provides a solid foundation for scaling the application and maintaining clean, organized code.
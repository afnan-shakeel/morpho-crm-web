# Tabs Component Integration Guide

## Quick Integration Steps

### 1. Import the Component
```typescript
// In your component file
import { TabsComponent, Tab, TabChangeEvent } from '@shared';

@Component({
  // ... other component properties
  imports: [TabsComponent, /* other imports */],
})
export class YourComponent {
  // Component implementation
}
```

### 2. Define Your Tabs
```typescript
export class YourComponent {
  tabs: Tab[] = [
    { id: 'tab1', label: 'First Tab', active: true },
    { id: 'tab2', label: 'Second Tab' },
    { id: 'tab3', label: 'Third Tab', disabled: true }
  ];

  onTabChange(event: TabChangeEvent) {
    console.log('Tab changed to:', event.tab.label);
  }
}
```

### 3. Use in Template
```html
<app-tabs 
  [tabs]="tabs" 
  (tabChange)="onTabChange($event)">
</app-tabs>
```

## Real-World Examples

### Lead Management Page
```typescript
// In leads-detail.component.ts
tabs: Tab[] = [
  { id: 'overview', label: 'Overview', active: true },
  { id: 'contacts', label: 'Contacts', badgeCount: this.contactsCount },
  { id: 'activities', label: 'Activities', badgeCount: this.activitiesCount },
  { id: 'documents', label: 'Documents' }
];

currentView = 'overview';

onTabChange(event: TabChangeEvent) {
  this.currentView = event.tab.id;
  this.loadTabContent(event.tab.id);
}
```

### User Settings Page
```typescript
// In user-settings.component.ts
settingsTabs: Tab[] = [
  { id: 'profile', label: 'Profile', icon: 'fas fa-user', active: true },
  { id: 'security', label: 'Security', icon: 'fas fa-shield-alt' },
  { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
  { id: 'billing', label: 'Billing', icon: 'fas fa-credit-card' }
];
```

### Dashboard Navigation
```typescript
// In dashboard.component.ts
dashboardTabs: Tab[] = [
  { id: 'analytics', label: 'Analytics', route: '/dashboard/analytics' },
  { id: 'reports', label: 'Reports', route: '/dashboard/reports' },
  { id: 'users', label: 'Users', route: '/dashboard/users' }
];
```

## Common Use Cases

### 1. Replace existing tab implementations
Instead of custom tab logic, use the shared component:

```html
<!-- Before -->
<div class="tab-container">
  <button 
    *ngFor="let tab of tabs" 
    [class.active]="tab.active"
    (click)="selectTab(tab)">
    {{ tab.label }}
  </button>
</div>

<!-- After -->
<app-tabs [tabs]="tabs" (tabChange)="onTabChange($event)"></app-tabs>
```

### 2. Form wizards/Multi-step processes
```typescript
wizardTabs: Tab[] = [
  { id: 'step1', label: 'Basic Info', active: true },
  { id: 'step2', label: 'Details' },
  { id: 'step3', label: 'Review' }
];

goToNextStep() {
  const currentIndex = this.wizardTabs.findIndex(tab => tab.active);
  if (currentIndex < this.wizardTabs.length - 1) {
    this.wizardTabs[currentIndex].active = false;
    this.wizardTabs[currentIndex + 1].active = true;
  }
}
```

### 3. Dynamic content loading
```typescript
onTabChange(event: TabChangeEvent) {
  this.isLoading = true;
  this.dataService.loadTabData(event.tab.id).subscribe(data => {
    this.currentData = data;
    this.isLoading = false;
  });
}
```

## Styling Integration

### Using existing project themes
The component automatically adapts to your Tailwind theme. For custom styling:

```html
<app-tabs 
  [tabs]="tabs"
  containerClass="my-custom-container"
  tabClass="my-custom-tab-style"
  activeTabClass="my-active-tab-style">
</app-tabs>
```

### CSS customization
```css
/* In your component's CSS file */
.my-custom-container {
  @apply bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg;
}

.my-custom-tab-style {
  @apply text-white/80 hover:text-white transition-all duration-300;
}

.my-active-tab-style {
  @apply bg-white/20 text-white shadow-lg;
}
```

## Testing

### Unit Testing
```typescript
// In your component.spec.ts
import { TabsComponent } from '@shared';

describe('YourComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsComponent],
      // ... other configuration
    });
  });

  it('should handle tab changes', () => {
    const component = fixture.componentInstance;
    const mockEvent: TabChangeEvent = {
      tab: { id: 'test', label: 'Test Tab' },
      index: 0
    };
    
    spyOn(component, 'onTabChange');
    // Trigger tab change
    // Assert that onTabChange was called
  });
});
```

## Migration from Existing Tabs

### Step 1: Identify current tab implementations
Look for:
- Custom tab buttons/links
- Tab content switching logic
- Active state management

### Step 2: Replace with Tabs component
- Convert tab data to Tab[] format
- Replace template with `<app-tabs>`
- Update event handlers

### Step 3: Test functionality
- Verify tab switching works
- Check responsive behavior
- Test keyboard navigation

## Troubleshooting

### Common Issues:

1. **Tabs not displaying**: Check imports and Tab[] format
2. **Styling issues**: Verify Tailwind classes are available
3. **Navigation not working**: Check route configuration for navigation mode
4. **Mobile dropdown hidden**: Ensure `showMobileDropdown` is true

### Debug Tips:
- Use browser dev tools to inspect generated HTML
- Check console for any TypeScript errors
- Verify Tab interface properties are correct
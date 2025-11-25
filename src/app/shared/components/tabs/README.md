# Tabs Component Usage Guide

The Tabs component is a flexible, configurable component that can be used across multiple pages for different use cases.

## Basic Usage

### Import the component and types
```typescript
import { TabsComponent, Tab, TabChangeEvent } from '@shared';
```

### Simple navigation tabs
```typescript
// In your component
export class MyComponent {
  tabs: Tab[] = [
    { id: 'account', label: 'My Account', route: '/account' },
    { id: 'company', label: 'Company', route: '/company' },
    { id: 'team', label: 'Team Members', route: '/team', active: true },
    { id: 'billing', label: 'Billing', route: '/billing' }
  ];

  onTabChange(event: TabChangeEvent) {
    console.log('Tab changed:', event.tab.label);
  }
}
```

```html
<!-- In your template -->
<app-tabs 
  [tabs]="tabs" 
  mode="navigation"
  (tabChange)="onTabChange($event)">
</app-tabs>
```

## Advanced Usage Examples

### Content switching mode (no routing)
```typescript
tabs: Tab[] = [
  { id: 'overview', label: 'Overview', active: true },
  { id: 'details', label: 'Details' },
  { id: 'history', label: 'History', badgeCount: 5 }
];

currentContent = 'overview';

onTabChange(event: TabChangeEvent) {
  this.currentContent = event.tab.id;
}
```

```html
<app-tabs 
  [tabs]="tabs" 
  mode="content"
  (tabChange)="onTabChange($event)">
</app-tabs>

<!-- Content switching -->
<div [ngSwitch]="currentContent">
  <div *ngSwitchCase="'overview'">Overview content...</div>
  <div *ngSwitchCase="'details'">Details content...</div>
  <div *ngSwitchCase="'history'">History content...</div>
</div>
```

### Tabs with icons and badges
```typescript
tabs: Tab[] = [
  { 
    id: 'inbox', 
    label: 'Inbox', 
    icon: 'fas fa-inbox', 
    badgeCount: 12,
    route: '/inbox'
  },
  { 
    id: 'sent', 
    label: 'Sent', 
    icon: 'fas fa-paper-plane',
    route: '/sent'
  },
  { 
    id: 'drafts', 
    label: 'Drafts', 
    icon: 'fas fa-edit',
    badgeCount: 3,
    route: '/drafts'
  },
  { 
    id: 'spam', 
    label: 'Spam', 
    icon: 'fas fa-ban',
    disabled: true,
    route: '/spam'
  }
];
```

### Custom styling
```html
<app-tabs 
  [tabs]="tabs"
  containerClass="my-custom-container"
  tabClass="my-custom-tab"
  activeTabClass="my-custom-active-tab"
  ariaLabel="Email navigation">
</app-tabs>
```

### Programmatic tab control
```typescript
export class MyComponent {
  @ViewChild(TabsComponent) tabsComponent!: TabsComponent;
  
  tabs: Tab[] = [
    { id: 'step1', label: 'Step 1', active: true },
    { id: 'step2', label: 'Step 2' },
    { id: 'step3', label: 'Step 3' }
  ];

  goToNextStep() {
    const currentIndex = this.tabs.findIndex(tab => tab.active);
    if (currentIndex < this.tabs.length - 1) {
      const nextTab = this.tabs[currentIndex + 1];
      this.tabsComponent.onTabClick(nextTab, currentIndex + 1);
    }
  }
}
```

### Dynamic tabs
```typescript
tabs: Tab[] = [];

ngOnInit() {
  this.loadTabs();
}

loadTabs() {
  this.userService.getUserProjects().subscribe(projects => {
    this.tabs = projects.map(project => ({
      id: project.id,
      label: project.name,
      route: `/projects/${project.id}`,
      badgeCount: project.taskCount
    }));
  });
}

addNewTab(project: any) {
  this.tabs.push({
    id: project.id,
    label: project.name,
    route: `/projects/${project.id}`,
    active: true
  });
}

removeTab(tabId: string) {
  this.tabs = this.tabs.filter(tab => tab.id !== tabId);
}
```

## Component Properties

### Inputs
- `tabs: Tab[]` - Array of tab configurations
- `mode: TabMode` - 'navigation' (routing) or 'content' (content switching)
- `activeTabId?: string` - ID of the currently active tab
- `showMobileDropdown: boolean` - Show mobile dropdown (default: true)
- `containerClass: string` - Custom CSS classes for container
- `tabClass: string` - Custom CSS classes for tabs
- `activeTabClass: string` - Custom CSS classes for active tab
- `ariaLabel: string` - Accessibility label (default: 'Tab navigation')

### Outputs
- `tabChange: EventEmitter<TabChangeEvent>` - Emitted when tab is clicked
- `tabSelected: EventEmitter<Tab>` - Emitted when tab is selected

### Tab Interface
```typescript
interface Tab {
  id: string;           // Unique identifier
  label: string;        // Display text
  active?: boolean;     // Is currently active
  disabled?: boolean;   // Is disabled
  route?: string;       // Navigation route
  icon?: string;        // Icon CSS class
  badgeCount?: number;  // Badge number
  data?: any;          // Additional data
}
```

## Styling

The component uses Tailwind CSS classes and supports both light and dark themes. Custom classes can be applied through the input properties.

## Accessibility

- Full keyboard navigation support
- Screen reader friendly with proper ARIA labels
- Focus management
- Semantic HTML structure
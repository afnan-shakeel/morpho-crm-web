import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabsComponent } from './tabs';
import { Tab, TabChangeEvent } from './tabs.types';

@Component({
  selector: 'app-tabs-example',
  standalone: true,
  imports: [CommonModule, TabsComponent],
  template: `
    <div class="p-6 space-y-8">
      <!-- Navigation Example -->
      <div>
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Navigation Tabs</h2>
        <app-tabs 
          [tabs]="navigationTabs" 
          mode="navigation"
          (tabChange)="onNavigationTabChange($event)">
        </app-tabs>
      </div>

      <!-- Content Example -->
      <div>
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Content Tabs</h2>
        <app-tabs 
          [tabs]="contentTabs" 
          mode="content"
          (tabChange)="onContentTabChange($event)">
        </app-tabs>
        
        <!-- Content panels -->
        <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div [ngSwitch]="currentContent">
            <div *ngSwitchCase="'profile'">
              <h3 class="font-medium">Profile Settings</h3>
              <p class="text-gray-600 dark:text-gray-300">Manage your profile information.</p>
            </div>
            <div *ngSwitchCase="'security'">
              <h3 class="font-medium">Security Settings</h3>
              <p class="text-gray-600 dark:text-gray-300">Update your password and security preferences.</p>
            </div>
            <div *ngSwitchCase="'notifications'">
              <h3 class="font-medium">Notification Settings</h3>
              <p class="text-gray-600 dark:text-gray-300">Choose how you want to be notified.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs with Icons and Badges -->
      <div>
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Tabs with Icons & Badges</h2>
        <app-tabs 
          [tabs]="featureTabs" 
          mode="content"
          (tabChange)="onFeatureTabChange($event)">
        </app-tabs>
      </div>
    </div>
  `
})
export class TabsExampleComponent {
  navigationTabs: Tab[] = [
    { id: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { id: 'projects', label: 'Projects', route: '/projects' },
    { id: 'team', label: 'Team', route: '/team', active: true },
    { id: 'settings', label: 'Settings', route: '/settings' }
  ];

  contentTabs: Tab[] = [
    { id: 'profile', label: 'Profile', active: true },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' }
  ];

  featureTabs: Tab[] = [
    { 
      id: 'tasks', 
      label: 'Tasks', 
      icon: 'fas fa-tasks', 
      badgeCount: 5, 
      active: true 
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: 'fas fa-envelope', 
      badgeCount: 12 
    },
    { 
      id: 'archive', 
      label: 'Archive', 
      icon: 'fas fa-archive' 
    },
    { 
      id: 'trash', 
      label: 'Trash', 
      icon: 'fas fa-trash', 
      disabled: true 
    }
  ];

  currentContent = 'profile';

  onNavigationTabChange(event: TabChangeEvent) {
    console.log('Navigation tab changed:', event.tab.label);
  }

  onContentTabChange(event: TabChangeEvent) {
    this.currentContent = event.tab.id;
    console.log('Content tab changed:', event.tab.label);
  }

  onFeatureTabChange(event: TabChangeEvent) {
    console.log('Feature tab changed:', event.tab.label);
  }
}
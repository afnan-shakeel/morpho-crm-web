import { Tab, TabChangeEvent, TabsComponent } from '@/shared';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * This component demonstrates all the different ways to use the Tabs component
 * 
 * Basic Usage:
 * 1. Import: import { TabsComponent, Tab, TabChangeEvent } from '@shared';
 * 2. Add to imports: imports: [TabsComponent]
 * 3. Use in template: <app-tabs [tabs]="tabs" (tabChange)="onTabChange($event)"></app-tabs>
 */
@Component({
  selector: 'app-tabs-showcase',
  standalone: true,
  imports: [CommonModule, RouterModule, TabsComponent],
  template: `
    <div class="max-w-4xl mx-auto p-6 space-y-12">
      
      <!-- Title -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tabs Component Showcase</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">Flexible, configurable tabs for all your needs</p>
      </div>

      <!-- 1. Basic Navigation Tabs -->
      <section>
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">1. Navigation Tabs (with routing)</h2>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <app-tabs 
            [tabs]="navigationTabs" 
            mode="navigation"
            ariaLabel="Main navigation"
            (tabChange)="onNavigationChange($event)"
            (tabSelected)="onTabSelected($event)">
          </app-tabs>
        </div>
        <div class="mt-2 text-sm text-gray-500">
          Last clicked: {{ lastNavigationTab || 'None' }}
        </div>
      </section>

      <!-- 2. Content Switching Tabs -->
      <section>
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">2. Content Switching Tabs</h2>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <app-tabs 
            [tabs]="contentTabs" 
            mode="content"
            ariaLabel="Content navigation"
            (tabChange)="onContentChange($event)">
          </app-tabs>
          
          <!-- Content Panels -->
          <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg min-h-[200px]">
            <div [ngSwitch]="currentContent">
              <div *ngSwitchCase="'overview'" class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Overview</h3>
                <div class="grid grid-cols-3 gap-4">
                  <div class="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-300">125</div>
                    <div class="text-sm text-blue-700 dark:text-blue-400">Total Users</div>
                  </div>
                  <div class="bg-green-100 dark:bg-green-900 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-600 dark:text-green-300">98</div>
                    <div class="text-sm text-green-700 dark:text-green-400">Active Projects</div>
                  </div>
                  <div class="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-purple-600 dark:text-purple-300">$12.5k</div>
                    <div class="text-sm text-purple-700 dark:text-purple-400">Revenue</div>
                  </div>
                </div>
              </div>
              
              <div *ngSwitchCase="'analytics'" class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Analytics</h3>
                <div class="bg-gray-100 dark:bg-gray-600 h-32 rounded-lg flex items-center justify-center">
                  <span class="text-gray-500 dark:text-gray-300">📊 Chart would go here</span>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="font-medium">Page Views:</span> 15,432
                  </div>
                  <div>
                    <span class="font-medium">Bounce Rate:</span> 34%
                  </div>
                  <div>
                    <span class="font-medium">Session Duration:</span> 2m 45s
                  </div>
                  <div>
                    <span class="font-medium">Conversion Rate:</span> 3.2%
                  </div>
                </div>
              </div>
              
              <div *ngSwitchCase="'reports'" class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Reports</h3>
                <div class="space-y-2">
                  <div class="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-600 rounded">
                    <span>Monthly Sales Report</span>
                    <button class="text-blue-600 dark:text-blue-400 hover:underline">Download</button>
                  </div>
                  <div class="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-600 rounded">
                    <span>User Activity Report</span>
                    <button class="text-blue-600 dark:text-blue-400 hover:underline">Download</button>
                  </div>
                  <div class="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-600 rounded">
                    <span>Performance Analysis</span>
                    <button class="text-blue-600 dark:text-blue-400 hover:underline">Download</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Tabs with Icons and Badges -->
      <section>
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">3. Tabs with Icons & Badges</h2>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <app-tabs 
            [tabs]="iconTabs" 
            mode="content"
            ariaLabel="Feature navigation"
            (tabChange)="onIconTabChange($event)">
          </app-tabs>
        </div>
      </section>

      <!-- 4. Custom Styled Tabs -->
      <section>
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">4. Custom Styled Tabs</h2>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <app-tabs 
            [tabs]="customTabs" 
            mode="content"
            containerClass="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg"
            tabClass="font-semibold"
            activeTabClass="!bg-gradient-to-r !from-blue-500 !to-purple-500 !text-white shadow-lg"
            ariaLabel="Custom styled navigation">
          </app-tabs>
        </div>
      </section>

      <!-- 5. Programmatic Control -->
      <section>
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">5. Programmatic Control</h2>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
          <app-tabs 
            [tabs]="programmableTabs" 
            [activeTabId]="activeTabId"
            mode="content"
            ariaLabel="Programmable navigation"
            (tabChange)="onProgrammableChange($event)">
          </app-tabs>
          
          <div class="flex gap-2 pt-4 border-t">
            <button 
              *ngFor="let tab of programmableTabs" 
              (click)="setActiveTab(tab.id)"
              [disabled]="tab.disabled"
              class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50">
              Go to {{ tab.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- 6. Dynamic Tabs -->
      <section>
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">6. Dynamic Tabs</h2>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
          <app-tabs 
            [tabs]="dynamicTabs" 
            mode="content"
            ariaLabel="Dynamic navigation"
            (tabChange)="onDynamicTabChange($event)">
          </app-tabs>
          
          <div class="flex gap-2 pt-4 border-t">
            <button 
              (click)="addDynamicTab()"
              class="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded">
              Add Tab
            </button>
            <button 
              (click)="removeDynamicTab()"
              [disabled]="dynamicTabs.length <= 1"
              class="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50">
              Remove Last Tab
            </button>
            <button 
              (click)="updateBadges()"
              class="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded">
              Update Badges
            </button>
          </div>
        </div>
      </section>

    </div>
  `
})
export class TabsShowcaseComponent {
  // Navigation tabs
  navigationTabs: Tab[] = [
    { id: 'home', label: 'Home', route: '/dashboard' },
    { id: 'products', label: 'Products', route: '/products' },
    { id: 'services', label: 'Services', route: '/services', active: true },
    { id: 'contact', label: 'Contact', route: '/contact' }
  ];
  lastNavigationTab: string = '';

  // Content switching tabs
  contentTabs: Tab[] = [
    { id: 'overview', label: 'Overview', active: true },
    { id: 'analytics', label: 'Analytics' },
    { id: 'reports', label: 'Reports' }
  ];
  currentContent = 'overview';

  // Icon tabs with badges
  iconTabs: Tab[] = [
    { id: 'inbox', label: 'Inbox', icon: 'fas fa-inbox', badgeCount: 5, active: true },
    { id: 'starred', label: 'Starred', icon: 'fas fa-star', badgeCount: 2 },
    { id: 'sent', label: 'Sent', icon: 'fas fa-paper-plane' },
    { id: 'drafts', label: 'Drafts', icon: 'fas fa-edit', badgeCount: 1 },
    { id: 'archive', label: 'Archive', icon: 'fas fa-archive', disabled: true }
  ];

  // Custom styled tabs
  customTabs: Tab[] = [
    { id: 'premium', label: 'Premium', active: true },
    { id: 'standard', label: 'Standard' },
    { id: 'basic', label: 'Basic' }
  ];

  // Programmable tabs
  programmableTabs: Tab[] = [
    { id: 'step1', label: 'Step 1', active: true },
    { id: 'step2', label: 'Step 2' },
    { id: 'step3', label: 'Step 3' },
    { id: 'step4', label: 'Step 4', disabled: true }
  ];
  activeTabId = 'step1';

  // Dynamic tabs
  dynamicTabs: Tab[] = [
    { id: 'tab1', label: 'Tab 1', active: true, badgeCount: 0 }
  ];
  private tabCounter = 1;

  // Event handlers
  onNavigationChange(event: TabChangeEvent) {
    this.lastNavigationTab = event.tab.label;
    console.log('Navigation changed:', event);
  }

  onTabSelected(tab: Tab) {
    console.log('Tab selected:', tab);
  }

  onContentChange(event: TabChangeEvent) {
    this.currentContent = event.tab.id;
    console.log('Content changed:', event);
  }

  onIconTabChange(event: TabChangeEvent) {
    console.log('Icon tab changed:', event);
  }

  onProgrammableChange(event: TabChangeEvent) {
    this.activeTabId = event.tab.id;
    console.log('Programmable tab changed:', event);
  }

  onDynamicTabChange(event: TabChangeEvent) {
    console.log('Dynamic tab changed:', event);
  }

  // Programmatic control methods
  setActiveTab(tabId: string) {
    this.activeTabId = tabId;
  }

  // Dynamic tab methods
  addDynamicTab() {
    this.tabCounter++;
    this.dynamicTabs.push({
      id: `tab${this.tabCounter}`,
      label: `Tab ${this.tabCounter}`,
      badgeCount: Math.floor(Math.random() * 10)
    });
  }

  removeDynamicTab() {
    if (this.dynamicTabs.length > 1) {
      this.dynamicTabs.pop();
    }
  }

  updateBadges() {
    this.dynamicTabs.forEach(tab => {
      tab.badgeCount = Math.floor(Math.random() * 20);
    });
    // Trigger change detection
    this.dynamicTabs = [...this.dynamicTabs];
  }
}
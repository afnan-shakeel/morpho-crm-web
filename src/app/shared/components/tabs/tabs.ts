import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Tab, TabChangeEvent, TabMode } from './tabs.types';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css'
})
export class TabsComponent implements OnInit, OnChanges {
  /** Array of tabs to display */
  @Input() tabs: Tab[] = [];
  
  /** Mode of the tab component - 'navigation' for routing, 'content' for content switching */
  @Input() mode: TabMode = 'navigation';
  
  /** ID of the currently active tab */
  @Input() activeTabId?: string;
  
  /** Whether to show the mobile dropdown view */
  @Input() showMobileDropdown: boolean = true;
  
  /** Custom CSS classes for the tab container */
  @Input() containerClass: string = '';
  
  /** Custom CSS classes for individual tabs */
  @Input() tabClass: string = '';
  
  /** Custom CSS classes for the active tab */
  @Input() activeTabClass: string = '';
  
  /** Custom aria label for the tab navigation */
  @Input() ariaLabel: string = 'Tab navigation';
  
  /** Event emitted when a tab is clicked */
  @Output() tabChange = new EventEmitter<TabChangeEvent>();
  
  /** Event emitted when a tab is selected (includes route navigation) */
  @Output() tabSelected = new EventEmitter<Tab>();

  /** Currently active tab object */
  activeTab?: Tab;
  
  /** Currently selected tab for mobile dropdown */
  selectedMobileTab?: Tab;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeActiveTab();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabs'] || changes['activeTabId']) {
      this.initializeActiveTab();
    }
  }

  /**
   * Initialize the active tab based on activeTabId or find the first active tab
   */
  private initializeActiveTab(): void {
    if (!this.tabs || this.tabs.length === 0) {
      return;
    }

    // Find active tab by ID if provided
    if (this.activeTabId) {
      this.activeTab = this.tabs.find(tab => tab.id === this.activeTabId);
    }
    
    // If no active tab found by ID, find the first tab marked as active
    if (!this.activeTab) {
      this.activeTab = this.tabs.find(tab => tab.active);
    }
    
    // If still no active tab, make the first non-disabled tab active
    if (!this.activeTab) {
      this.activeTab = this.tabs.find(tab => !tab.disabled);
    }

    // Update selectedMobileTab for mobile dropdown
    this.selectedMobileTab = this.activeTab;
    
    // Update the tabs array to reflect the active state
    this.updateTabActiveStates();
  }

  /**
   * Update the active state of all tabs
   */
  private updateTabActiveStates(): void {
    this.tabs.forEach(tab => {
      tab.active = tab.id === this.activeTab?.id;
    });
  }

  /**
   * Handle tab click
   */
  onTabClick(tab: Tab, index: number): void {
    if (tab.disabled) {
      return;
    }

    const previousTab = this.activeTab;
    this.activeTab = tab;
    this.selectedMobileTab = tab;
    this.updateTabActiveStates();

    // Emit tab change event
    const changeEvent: TabChangeEvent = {
      tab,
      index,
      previousTab
    };
    this.tabChange.emit(changeEvent);
    this.tabSelected.emit(tab);

    // Handle navigation if route is provided and mode is navigation
    if (this.mode === 'navigation' && tab.route) {
      this.router.navigate([tab.route]);
    }
  }

  /**
   * Handle mobile dropdown change
   */
  onMobileDropdownChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedIndex = select.selectedIndex;
    const selectedTab = this.tabs[selectedIndex];
    
    if (selectedTab && !selectedTab.disabled) {
      this.onTabClick(selectedTab, selectedIndex);
    }
  }

  /**
   * Get CSS classes for a tab
   */
  getTabClasses(tab: Tab): string {
    const baseClasses = 'rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200';
    const defaultClasses = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';
    const activeClasses = 'bg-primary-500/10 text-primary-700 dark:bg-primary-500/20 dark:text-primary-300';
    const disabledClasses = 'opacity-50 cursor-not-allowed';
    
    let classes = `${baseClasses} ${this.tabClass}`;
    
    if (tab.disabled) {
      classes += ` ${disabledClasses}`;
    } else if (tab.active) {
      classes += ` ${activeClasses} ${this.activeTabClass}`;
    } else {
      classes += ` ${defaultClasses}`;
    }
    
    return classes.trim();
  }

  /**
   * Get CSS classes for the mobile dropdown
   */
  getMobileDropdownClasses(): string {
    const baseClasses = 'col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-gray-800/50 dark:text-gray-100 dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-indigo-500';
    return baseClasses;
  }

  /**
   * Track by function for tabs
   */
  trackByTabId(index: number, tab: Tab): string {
    return tab.id;
  }
}
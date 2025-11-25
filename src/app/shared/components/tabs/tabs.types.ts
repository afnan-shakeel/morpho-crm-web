export interface Tab {
  /** Unique identifier for the tab */
  id: string;
  
  /** Display label for the tab */
  label: string;
  
  /** Whether this tab is currently active */
  active?: boolean;
  
  /** Whether this tab is disabled */
  disabled?: boolean;
  
  /** Optional route to navigate to when tab is clicked */
  route?: string;
  
  /** Optional icon class or name to display with the tab */
  icon?: string;
  
  /** Optional badge count to display on the tab */
  badgeCount?: number;
  
  /** Additional data that can be passed with the tab */
  data?: any;
}

export type TabChangeEvent = {
  /** The tab that was clicked */
  tab: Tab;
  
  /** Index of the tab in the tabs array */
  index: number;
  
  /** Previous active tab */
  previousTab?: Tab;
};

export type TabMode = 'navigation' | 'content';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface MenuItem {
  title: string;
  icon: string;
  link: string;
  isActive: boolean;
  expanded?: boolean;
  subMenu?: SubMenuItem[];
}

export interface SubMenuItem {
  title: string;
  link: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([
    {
      title: 'Dashboard',
      icon: 'home',
      link: '/dashboard',
      isActive: false,
      expanded: false
    },
    {
      title: 'Customer',
      icon: 'home',
      link: '/accounts',
      isActive: false,
      expanded: false,
      subMenu: [
        {
          title: 'Accounts',
          link: '/accounts/list',
          isActive: false
        },
        {
          title: 'Contacts',
          link: '/contacts/list',
          isActive: false
        }
      ]
    },
    {
      title: 'Sales',
      icon: '',
      link: '/leads',
      isActive: false,
      expanded: false,
      subMenu: [
        {
          title: 'Leads',
          link: '/leads',
          isActive: false
        },
        {
          title: 'Opportunities',
          link: '/opportunities/list',
          isActive: false
        }
      ]
    },
    {
      title: 'Sample II',
      icon: 'sample II',
      link: '/sample ii',
      isActive: false,
      expanded: false,
      subMenu: [
        {
          title: 'List',
          link: '/sample-ii/list',
          isActive: false
        },
        {
          title: 'Create',
          link: '/sample-ii/create',
          isActive: false
        }
      ]
    },
    {
      title: 'Settings',
      icon: 'settings',
      link: '/settings',
      isActive: false,
      expanded: false
    }
  ]);

  constructor() { }

  /**
   * Get menu items as an observable
   */
  getMenuItems(): Observable<MenuItem[]> {
    return this.menuItemsSubject.asObservable();
  }

  /**
   * Get current menu items value
   */
  getCurrentMenuItems(): MenuItem[] {
    return this.menuItemsSubject.value;
  }

  /**
   * Activate a menu item by link and deactivate others
   */
  activateMenuItem(link: string): void {
    const menuItems = this.getCurrentMenuItems();
    const updatedMenuItems = menuItems.map(item => {
      // Deactivate all main menu items first
      item.isActive = false;
      
      // Check if this is the item to activate
      if (item.link === link) {
        item.isActive = true;
      }
      
      // Handle submenu items
      if (item.subMenu) {
        item.subMenu = item.subMenu.map(subItem => {
          subItem.isActive = subItem.link === link;
          // If a submenu item is active, also activate the parent
          if (subItem.isActive) {
            item.isActive = true;
          }
          return subItem;
        });
      }
      
      return item;
    });
    
    this.menuItemsSubject.next(updatedMenuItems);
  }

  /**
   * Deactivate a specific menu item by link
   */
  deactivateMenuItem(link: string): void {
    const menuItems = this.getCurrentMenuItems();
    const updatedMenuItems = menuItems.map(item => {
      if (item.link === link) {
        item.isActive = false;
      }
      
      if (item.subMenu) {
        item.subMenu = item.subMenu.map(subItem => {
          if (subItem.link === link) {
            subItem.isActive = false;
          }
          return subItem;
        });
      }
      
      return item;
    });
    
    this.menuItemsSubject.next(updatedMenuItems);
  }

  /**
   * Deactivate all menu items
   */
  deactivateAllMenuItems(): void {
    const menuItems = this.getCurrentMenuItems();
    const updatedMenuItems = menuItems.map(item => {
      item.isActive = false;
      
      if (item.subMenu) {
        item.subMenu = item.subMenu.map(subItem => {
          subItem.isActive = false;
          return subItem;
        });
      }
      
      return item;
    });
    
    this.menuItemsSubject.next(updatedMenuItems);
  }

  /**
   * Add a new menu item
   */
  addMenuItem(menuItem: MenuItem): void {
    const menuItems = this.getCurrentMenuItems();
    menuItems.push(menuItem);
    this.menuItemsSubject.next([...menuItems]);
  }

  /**
   * Remove a menu item by link
   */
  removeMenuItem(link: string): void {
    const menuItems = this.getCurrentMenuItems();
    const updatedMenuItems = menuItems.filter(item => item.link !== link);
    this.menuItemsSubject.next(updatedMenuItems);
  }

  /**
   * Update menu items
   */
  updateMenuItems(menuItems: MenuItem[]): void {
    this.menuItemsSubject.next([...menuItems]);
  }

  /**
   * Check if a menu item is active
   */
  isMenuItemActive(link: string): boolean {
    const menuItems = this.getCurrentMenuItems();
    
    for (const item of menuItems) {
      if (item.link === link && item.isActive) {
        return true;
      }
      
      if (item.subMenu) {
        for (const subItem of item.subMenu) {
          if (subItem.link === link && subItem.isActive) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  /**
   * Toggle expansion of a menu item by link, ensuring only one is expanded at a time
   */
  toggleMenuExpansion(link: string): void {
    const menuItems = this.getCurrentMenuItems();
    const updatedMenuItems = menuItems.map(item => {
      if (item.subMenu && item.link === link) {
        // Toggle the clicked menu
        item.expanded = !item.expanded;
      } else if (item.subMenu) {
        // Collapse all other menus with submenus
        item.expanded = false;
      }
      return item;
    });
    this.menuItemsSubject.next(updatedMenuItems);
  }

  /**
   * Set active menu item based on current route
   */
  setActiveMenuByRoute(currentUrl: string): void {
    const menuItems = this.getCurrentMenuItems();
    let foundActiveMenu = false;

    const updatedMenuItems = menuItems.map(item => {
      // Reset all active states first
      item.isActive = false;
      
      // Check if this main menu item matches the current URL
      if (this.isRouteMatch(currentUrl, item.link)) {
        item.isActive = true;
        foundActiveMenu = true;
      }
      
      // Handle submenu items
      if (item.subMenu) {
        let hasActiveSubmenu = false;
        
        item.subMenu = item.subMenu.map(subItem => {
          subItem.isActive = false;
          
          // Check if submenu item matches current URL
          if (this.isRouteMatch(currentUrl, subItem.link)) {
            subItem.isActive = true;
            hasActiveSubmenu = true;
            foundActiveMenu = true;
          }
          
          return subItem;
        });
        
        // If a submenu item is active, also activate and expand the parent
        if (hasActiveSubmenu) {
          item.isActive = true;
          item.expanded = true;
        }
      }
      
      return item;
    });
    
    this.menuItemsSubject.next(updatedMenuItems);
  }

  /**
   * Check if current route matches menu item route
   */
  private isRouteMatch(currentUrl: string, menuLink: string): boolean {
    // Remove query parameters and fragments from current URL
    const cleanCurrentUrl = currentUrl.split('?')[0].split('#')[0];
    
    // Handle exact matches
    if (cleanCurrentUrl === menuLink) {
      return true;
    }
    
    // Handle parent route matches (e.g., /accounts should match /accounts/list)
    if (menuLink !== '/' && cleanCurrentUrl.startsWith(menuLink + '/')) {
      return true;
    }
    
    // Handle root/dashboard special case
    if (menuLink === '/dashboard' && (cleanCurrentUrl === '/' || cleanCurrentUrl === '/dashboard')) {
      return true;
    }
    
    return false;
  }
}
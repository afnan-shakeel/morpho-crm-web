import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService, MenuItem, MenuService } from '../../../core';
import { AuthUserInfo } from '../../../core/models/auth.model';
import { Avatar } from '../../../shared/components/avatar/avatar';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, RouterLink, Avatar],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './side-bar.html', 
  styleUrl: './side-bar.css'
})
export class SideBar implements OnInit, OnDestroy {
  menuItems$: Observable<MenuItem[]>;
  private subscription: Subscription = new Subscription();
  userDetails: AuthUserInfo | null = null;
  private menuService = inject(MenuService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  constructor() {
    this.menuItems$ = this.menuService.getMenuItems();
  }

  ngOnInit(): void {
    this.userDetails = this.authService.getUserInfo();
    
    // Set active menu based on current route
    this.updateActiveMenuFromCurrentRoute();
    
    // Listen to route changes and update active menu
    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.updateActiveMenuFromCurrentRoute();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Handle menu item click
   */
  onMenuItemClick(link: string): void {
    // Navigation is handled by routerLink, active state will be updated automatically by router events
    // No need to manually activate menu item
  }

  /**
   * Handle submenu item click
   */
  onSubMenuItemClick(link: string, event: Event): void {
    event.stopPropagation(); // Prevent parent menu item click
    // Navigation is handled by routerLink, active state will be updated automatically by router events
    // No need to manually activate menu item
  }

  /**
   * Handle menu expansion toggle
   */
  onMenuToggle(link: string, event: Event): void {
    event.preventDefault(); // Prevent navigation
    event.stopPropagation(); // Prevent other handlers
    this.menuService.toggleMenuExpansion(link);
  }

  /**
   * Update active menu based on current route
   */
  private updateActiveMenuFromCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.menuService.setActiveMenuByRoute(currentUrl);
  }

}

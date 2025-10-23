import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Observable, Subscription } from 'rxjs';
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
  
  constructor() {
    this.menuItems$ = this.menuService.getMenuItems();
  }

  ngOnInit(): void {
    this.userDetails = this.authService.getUserInfo();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Handle menu item click
   */
  onMenuItemClick(link: string): void {
    this.menuService.activateMenuItem(link);
  }

  /**
   * Handle submenu item click
   */
  onSubMenuItemClick(link: string, event: Event): void {
    event.stopPropagation(); // Prevent parent menu item click
    this.menuService.activateMenuItem(link);
  }

}

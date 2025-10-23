import { Avatar } from "@/shared/components/avatar/avatar";
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../../../core';
import { AuthUserInfo } from '../../../core/models/auth.model';

@Component({
  selector: 'app-top-bar',
  imports: [Avatar],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css'
})
export class TopBar {

    private router = inject(Router);
    private authService = inject(AuthService);
    userDetails: AuthUserInfo | null = null;
    constructor() {
      this.userDetails = this.authService.getUserInfo();
    }

    logout(): void {
      console.log('Logging out user:', this.userDetails);
      this.authService.logout();
      this.router.navigate(['/login']);
      
    }


  
}

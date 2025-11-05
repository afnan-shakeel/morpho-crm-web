import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../../user/users.service';
import { Account } from '../../types';
import { StatusBadge } from '../status-badge/status-badge';

@Component({
  selector: 'app-account-header-box',
  imports: [ReactiveFormsModule, CommonModule, StatusBadge],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './account-header-box.html',
  styleUrl: './account-header-box.css',
})
export class AccountHeaderBox {
  private fb = inject(FormBuilder);
  private userService = inject(UsersService);

  @Input() account: Account | null = null;
  userList: any[] = [];

  quickActions = [
    {
      label: 'Action One',
      handler: () => {},
    },
  ];
  
  ngOnInit(): void {
    this.loadUserList();
  }

  headerForm = this.fb.group({});

  loadUserList(searchTerm: string = ''): void {
    this.userService.getUsers(searchTerm, 5, 0).subscribe((users) => {
      this.userList = users;
    });
  }
}

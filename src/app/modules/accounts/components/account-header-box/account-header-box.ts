import { UserSelectionInput } from "@/shared/components/user-selection-input/user-selection-input";
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { User } from "../../../user/user.types";
import { UsersService } from '../../../user/users.service';
import { Account } from '../../types/account';
import { StatusBadge } from '../status-badge/status-badge';

@Component({
  selector: 'app-account-header-box',
  imports: [ReactiveFormsModule, CommonModule, StatusBadge, UserSelectionInput],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './account-header-box.html',
  styleUrl: './account-header-box.css',
})
export class AccountHeaderBox {
  private fb = inject(FormBuilder);
  private userService = inject(UsersService);

  @Input() account: Account | null = null;
  @Output() openEditAccountModal: EventEmitter<void> = new EventEmitter<void>();
  userList: User[] = [];

  quickActions = [
    {
      label: 'Edit Account',
      handler: () => {
        this.openEditAccountModal.emit();
      },
    },
  ];
  
  ngOnInit(): void {
    this.loadUserList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const accountChange: SimpleChange = changes['account'];
    if (accountChange && !accountChange.firstChange) {
      this.populateForm();
    }
  }

  headerForm = this.fb.group({
    ownerId: [''],
  });

  loadUserList(searchTerm: string = ''): void {
    this.userService.getUsers(searchTerm, 5, 0).subscribe((users) => {
      this.userList = users.data;
    });
  }

  populateForm(): void {
    if (this.account) {
      this.headerForm.patchValue({
        ownerId: this.account.accountOwnerId,
      });
    }
  }

}

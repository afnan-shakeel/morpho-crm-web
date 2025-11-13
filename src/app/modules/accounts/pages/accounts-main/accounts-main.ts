import { ContactInfoBox } from "@/modules/contacts/components/contact-info-box/contact-info-box";
import { PageHeading } from '@/shared/components/page-heading/page-heading';
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from "../../../../core";
import { ModalMedium } from "../../../../shared/components/modal-medium/modal-medium";
import { Contact } from '../../../contacts/types';
import { AccountsService } from '../../accounts.service';
import { AccountForm } from "../../components/account-form/account-form";
import { AccountHeaderBox } from '../../components/account-header-box/account-header-box';
import { AccountSummary } from "../../components/account-summary/account-summary";
import { Account, createAccountRequest } from '../../types/account';

@Component({
  selector: 'app-accounts-main',
  imports: [PageHeading, AccountHeaderBox, CommonModule, AccountSummary, ContactInfoBox, ModalMedium, AccountForm],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './accounts-main.html',
  styleUrl: './accounts-main.css',
})
export class AccountsMain {
  @ViewChild('accountForm') accountForm!: ModalMedium;
  

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private accountsService = inject(AccountsService);
  private toastService = inject(ToastService);

  accountId: string = '';
  account: Account | null = null;
  primaryContact: Contact | null = null;
  pageBreadcrumbs = [{ label: 'Accounts', path: '/accounts/list' }];

  tabs = signal([
    { label: 'Summary', content: 'Summary' },
    { label: 'Tasks', content: 'Tasks' },
    { label: 'File Attachments', content: 'Files' },
    { label: 'Related', content: 'Related' },
  ]);
  activeTabIndex = signal(0);
  setActiveTab(index: number): void {
    this.activeTabIndex.set(index);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.accountId = id;
        this.getAccountDetails();
      }
    });
  }

  getAccountDetails(): void {
    if (!this.accountId) return;
    this.accountsService.getAccountById(this.accountId, true).subscribe((account) => {
      this.account = account;
      this.primaryContact = account?.contacts?.find((contact) => contact.isPrimary) || null;
      this.pageBreadcrumbs.push({
        label: `${this.account?.companyName}`,
        path: `/accounts/${this.accountId}/view`,
      });
    });
  }


  // start: accounts form modal
  resetFormEvent = signal<boolean>(false);
  openAccountFormModal() {
    this.accountForm.open();
  }
  closeAccountFormModal() {
    this.accountForm.close();
  }
  onAccountFormSubmit(formData: any) {
    if (!formData) {
      this.closeAccountFormModal();
      return;
    }
    if (formData.accountId) {
      this.updateAccount(formData.accountId, formData);
    }
  }
  // end: accounts form modal

  updateAccount(accountId: string, accountData: createAccountRequest) {
    this.accountsService.updateAccount(accountId, accountData).subscribe({
      next: (response) => {
        if (response && response.accountId) {
          this.toastService.success('Account updated successfully!');
          this.resetFormEvent.set(true);
          this.getAccountDetails();
          this.closeAccountFormModal();
        }
      },
      error: (error) => {
        console.error('Error updating account:', error);
      }
    });

  }
}

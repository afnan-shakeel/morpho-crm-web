import { ContactInfoBox } from "@/modules/contacts/components/contact-info-box/contact-info-box";
import { PageHeading } from '@/shared/components/page-heading/page-heading';
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../../../contacts/types';
import { AccountsService } from '../../accounts.service';
import { AccountHeaderBox } from '../../components/account-header-box/account-header-box';
import { AccountSummary } from "../../components/account-summary/account-summary";
import { AccountsActivityLog } from "../../components/accounts-activity-log/accounts-activity-log";
import { Account } from '../../types';

@Component({
  selector: 'app-accounts-main',
  imports: [PageHeading, AccountHeaderBox, CommonModule, AccountSummary, AccountsActivityLog, ContactInfoBox],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './accounts-main.html',
  styleUrl: './accounts-main.css',
})
export class AccountsMain {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private accountsService = inject(AccountsService);

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
}

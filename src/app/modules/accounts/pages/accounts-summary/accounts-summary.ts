import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsActivityLog } from "../../components/accounts-activity-log/accounts-activity-log";
import { Account, AccountAddress, AccountPrimaryContact } from '../../types';

@Component({
  selector: 'app-accounts-summary',
  imports: [ AccountsActivityLog],
  templateUrl: './accounts-summary.html',
  styleUrl: './accounts-summary.css'
})
export class AccountsSummary {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  accountId: string = '';
  account: Account | null = null;
  accountAddressDetails: AccountAddress | null = null;
  accountContactDetails: AccountPrimaryContact | null = null;

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.accountId = params['id'];
    });
  }

}
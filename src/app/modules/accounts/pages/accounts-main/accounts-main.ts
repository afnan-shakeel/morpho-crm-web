import { PageHeading } from "@/shared/components/page-heading/page-heading";
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AccountsService } from '../../accounts.service';
import { Account } from "../../types";

@Component({
  selector: 'app-accounts-main',
  imports: [RouterOutlet, PageHeading],
  templateUrl: './accounts-main.html',
  styleUrl: './accounts-main.css'
})
export class AccountsMain {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private accountsService = inject(AccountsService);

  accountId: string = '';
  account: Account | null = null;
  pageBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Accounts', path: '/accounts/list' },
  ];

  // get account id from route params
  // and update breadcrumbs
  // this is just a placeholder, actual implementation may vary
  // depending on how routing is set up in the application
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.accountId = id;
        this.getAccountDetails();
      }
    });
  }
  
  getAccountDetails(): void {
    if (!this.accountId) return;
    this.accountsService.getAccountById(this.accountId).subscribe(account => {
      this.account = account;
      this.pageBreadcrumbs.push({ label: `Account ${this.account?.companyName}`, path: `/accounts/${this.accountId}/view` });
    });
  }


}

import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { AccountsService } from '../../accounts.service';
import { AccountActivityLog } from '../../types';

@Component({
  selector: 'app-accounts-activity-log',
  imports: [CommonModule],
  templateUrl: './accounts-activity-log.html',
  styleUrl: './accounts-activity-log.css'
})
export class AccountsActivityLog {

  private accountService = inject(AccountsService);
  @Input() accountId: string = '';
  accountActivities: AccountActivityLog[] = [];

  ngOnInit(): void {
    this.fetchActivityLogs();
  }

  fetchActivityLogs(): void {
    if (!this.accountId) return;
    this.accountService.getActivityLogs(this.accountId).subscribe(logs => {
      this.accountActivities = logs;
    });
  }
}

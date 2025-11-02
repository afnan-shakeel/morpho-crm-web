import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input } from '@angular/core';
import { AccountsService } from '../../accounts.service';
import { AccountActivityLog } from '../../types';

@Component({
  selector: 'app-accounts-activity-log',
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './accounts-activity-log.html',
  styleUrl: './accounts-activity-log.css'
})
export class AccountsActivityLog {

  private accountService = inject(AccountsService);
  @Input() accountId: string = '';
  accountActivities: AccountActivityLog[] = [];

  activityTypeMapper: { [key: string]: string } = {
    'EVENT_LOGGED': 'Event Logged',
    'CALL_LOGGED': 'Call',
    'EMAIL_SENT': 'Email',
    'MEETING_SCHEDULED': 'Meeting',
    'MEETING': 'Meeting', 
    'TASK_COMPLETED': 'Task Completed',
    'NOTE_ADDED': 'Note Added'
  };
  getActivityTypeLabel(type: string): string {
    return this.activityTypeMapper[type] || 'Activity';
  }

  ngOnInit(): void {
    this.fetchActivityLogs();
  }

  ngOnChanges(): void {
    this.fetchActivityLogs();
  }

  fetchActivityLogs(): void {
    if (!this.accountId) return;
    this.accountService.getActivityLogs(this.accountId).subscribe(logs => {
      this.accountActivities = logs;
    });
  }
}

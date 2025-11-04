import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, signal, ViewChild } from '@angular/core';
import { ModalSmall } from '../../../../shared/components/modal-small/modal-small';
import { AccountsService } from '../../accounts.service';
import { AccountActivityLog } from '../../types';
import { ActivityForm } from '../activity-form/activity-form';

@Component({
  selector: 'app-accounts-activity-log',
  imports: [CommonModule, ActivityForm, ModalSmall],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './accounts-activity-log.html',
  styleUrl: './accounts-activity-log.css',
})
export class AccountsActivityLog {
  @ViewChild('activityForm') activityForm!: ModalSmall;

  private accountService = inject(AccountsService);
  @Input() accountId: string = '';
  accountActivities: AccountActivityLog[] = [];
  selectedActivityIdToUpdate = signal<string | null>(null);

  activityTypeMapper: { [key: string]: string } = {
    EVENT_LOGGED: 'Event Logged',
    CALL_LOGGED: 'Call',
    EMAIL_SENT: 'Email',
    MEETING_SCHEDULED: 'Meeting',
    MEETING: 'Meeting',
    TASK_COMPLETED: 'Task Completed',
    NOTE_ADDED: 'Note Added',
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
    this.accountService.getActivityLogs(this.accountId).subscribe((logs) => {
      this.accountActivities = logs;
    });
  }

  // start: contact form modal
  onActivityToEdit(activityId: string) {
    this.selectedActivityIdToUpdate.set(activityId);
    this.openActivityFormModal();
  }
  resetFormEvent = signal<boolean>(false);
  openActivityFormModal() {
    this.resetFormEvent.set(false);
    this.activityForm.open();
  }
  closeActivityFormModal() {
    this.activityForm.close();
    this.resetFormEvent.set(true);
    this.selectedActivityIdToUpdate.set(null);
  }
  onActivityFormSubmit(formData: any) {
    console.log('Activity form submitted with data:', formData);
    if (!formData) {
      this.closeActivityFormModal();
      return;
    }
    // call the create/update service
    if (formData.activityId) {
      this.updateActivity(formData.activityId, formData);
    } else {
      this.createActivity(formData);
    }
  }
  // end: contacts form modal

  createActivity(formData: any) {}
  updateActivity(activityId: string, formData: any) {}
}

import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, signal, ViewChild } from '@angular/core';
import { ToastService } from '../../../../core';
import { ModalSmall } from '../../../../shared/components/modal-small/modal-small';
import { AccountsService } from '../../accounts.service';
import { AccountActivityLog, AccountActivityRelatedToEnum, AccountActivityTypeEnum, CreateAccountActivityPayload, UpdateAccountActivityPayload } from '../../types';
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
  private toastService = inject(ToastService);
  @Input() accountId: string = '';
  @Input() activityRelatedTo: string = AccountActivityRelatedToEnum.ACCOUNT;
  @Input() activityRelatedEntityId: string = '';
  accountActivities: AccountActivityLog[] = [];
  selectedActivityIdToUpdate = signal<string | null>(null);

  getActivityTypeLabel(type: string): string {
    switch (type) {
      case AccountActivityTypeEnum.EVENT:
        return 'Event';
      case AccountActivityTypeEnum.CALL:
        return 'Call';
      case AccountActivityTypeEnum.EMAIL:
        return 'Email';
      case AccountActivityTypeEnum.MEETING:
        return 'Meeting';
      case AccountActivityTypeEnum.TASK:
        return 'Task';
      case AccountActivityTypeEnum.NOTE:
        return 'Note';
      default:
        return 'Activity';
    }
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

  // start: activity form modal
  onActivityToEdit(activityId: string) {
    this.selectedActivityIdToUpdate.set(activityId);
    this.openActivityFormModal();
  }
  // resetFormEvent is used as a child to parent event trigger
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
      this.updateActivity(formData.activityId, {
        accountId: formData.accountId,
        relatedTo: formData.relatedTo,
        relatedEntityId: formData.relatedEntityId,
        activityType: formData.activityType,
        activityHeader: formData.activityHeader,
        activityLog: formData.activityLog,
        performedById: formData.performedById,
        timestamp: formData.timestamp ? new Date(formData.timestamp).toISOString() : undefined,
      });
    } else {
      this.createActivity({
        accountId: formData.accountId,
        relatedTo: formData.relatedTo,
        relatedEntityId: formData.relatedEntityId,
        activityType: formData.activityType,
        activityHeader: formData.activityHeader,
        activityLog: formData.activityLog,
        performedById: formData.performedById,
        timestamp: new Date().toISOString(),
      });
    }
  }
  // end: activity form modal

  createActivity(data: CreateAccountActivityPayload) {
    this.accountService.createActivityLog(data).subscribe({
      next: (response) => {
        if (response.activityId) {
          this.toastService.success('Activity created successfully');
          this.fetchActivityLogs();
          this.closeActivityFormModal();
          return;
        }
        this.toastService.error('Failed to create activity');
      },
    });
  }

  updateActivity(activityId: string, data: Partial<UpdateAccountActivityPayload>) {
    this.accountService.updateActivityLog(activityId, data).subscribe({
      next: (response) => {
        if (response.activityId) {
          this.toastService.success('Activity updated successfully');
          this.fetchActivityLogs();
          this.closeActivityFormModal();
          return;
        }
        this.toastService.error('Failed to update activity');
      },
    });
  }
}

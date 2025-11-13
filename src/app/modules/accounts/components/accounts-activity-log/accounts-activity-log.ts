import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, signal, ViewChild } from '@angular/core';
import { ToastService } from '../../../../core';
import { ModalSmall } from '../../../../shared/components/modal-small/modal-small';
import { AccountsService } from '../../accounts.service';
import { AccountActivitiesFormTypes, AccountActivitiesTypes } from '../../types';
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
  @Input() activityRelatedTo: string = AccountActivitiesTypes.AccountActivityRelatedToEnum.ACCOUNT;
  @Input() activityRelatedEntityId: string = '';
  accountActivities: AccountActivitiesTypes.AccountActivity[] = [];
  selectedActivityIdToUpdate = signal<string | null>(null);

  getActivityTypeLabel(type: string): string {
    switch (type) {
      case AccountActivitiesTypes.AccountActivityDefaultTypes.EVENT:
        return 'Event';
      case AccountActivitiesTypes.AccountActivityDefaultTypes.NOTE:
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
      this.updateActivity(formData.activityId, formData);
    } else {
      this.createActivity(formData);
    }
  }
  // end: activity form modal

  createActivity(formData: AccountActivitiesFormTypes.AccountActivitiesFormData) {
    this.accountService.createActivityLog({
      accountId: formData.accountId,
      relatedTo: formData.relatedTo,
      relatedEntityId: formData.relatedEntityId,
      activityTypeId: formData.activityTypeId,
      activityHeader: formData.activityHeader,
      activityLog: formData.activityLog,
      performedById: formData.performedById,
      timestamp: new Date().toISOString(),
    }).subscribe({
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

  updateActivity(activityId: string, formData: AccountActivitiesFormTypes.AccountActivitiesFormData) {
    this.accountService.updateActivityLog(activityId, {
      accountId: formData.accountId,
      relatedTo: formData.relatedTo,
      relatedEntityId: formData.relatedEntityId,
      activityTypeId: formData.activityTypeId,
      activityHeader: formData.activityHeader,
      activityLog: formData.activityLog,
      performedById: formData.performedById,
      timestamp: formData.timestamp ? new Date(formData.timestamp).toISOString() : undefined,
    }).subscribe({
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

  getPerformedByFullName(activity: AccountActivitiesTypes.AccountActivity): string | null {
    return `${activity.performedBy?.firstName} ${activity.performedBy?.lastName}`;
  }
}



import { ConfirmationBox } from '@/shared/components/confirmation-box/confirmation-box';
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import flatpickr from 'flatpickr';
import { ToastService } from '../../../../core';
import { AutocompleteDirective } from '../../../../shared';
import { UsersService } from '../../../user/users.service';
import { OpportunityService } from '../../opportunity.service';
import { Opportunity } from '../../types';

@Component({
  selector: 'app-opportunity-header-box',
  imports: [CommonModule, ConfirmationBox, FormsModule, ReactiveFormsModule, AutocompleteDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './opportunity-header-box.html',
  styleUrl: './opportunity-header-box.css',
})
export class OpportunityHeaderBox {
  @ViewChild('changeConfirmation') changeConfirmationModal!: ConfirmationBox;

  private fb = inject(FormBuilder);
  private userService = inject(UsersService);
  private opportunityService = inject(OpportunityService);
  private toastService = inject(ToastService);
  @Input() opportunity: Opportunity | null = null;
  userList: any[] = [];

  // Pending change data
  private pendingChange: {
    field: string;
    oldValue: any;
    newValue: any;
  } | null = null;

  quickActions = [
    {
      label: 'Close As Won',
      action: 'close_won',
      handler: () => {
        console.log('Close As Won action triggered');
      },
    },
    {
      label: 'Close As Lost',
      action: 'close_lost',
      handler: () => {
        console.log('Close As Lost action triggered');
      },
    },
    {
      label: 'Add Activity',
      action: 'add_activity',
      handler: () => {
        console.log('Add Activity action triggered');
      },
    },
  ];
  confirmationTitle: string = 'Confirm Change';
  confirmationMessage: string = 'Are you sure you want to change?';
  headerForm = this.fb.group({
    ownerId: [0],
    ownerName: [''],
    expectedCloseDate: [''],
  });

  ngOnChanges() {
    {
      // populate header form when opportunity input changes
      if (this.opportunity) {
        this.headerForm.patchValue({
          ownerId: this.opportunity.opportunityOwner?.Id || 0,
          ownerName: this.opportunity.opportunityOwner?.Name,
          expectedCloseDate: this.opportunity.expectedCloseDate
            ? new Date(this.opportunity.expectedCloseDate).toISOString().substring(0, 16)
            : '',
        });
      }
    }
  }
  ngOnInit() {
    this.setupFormChangeListeners();
  }
  ngAfterViewInit() {
    // Basic
    flatpickr('#expected-close-date-time', {
      enableTime: true,
      dateFormat: 'Y-m-d H:i'
    })
  }

  private setupFormChangeListeners() {
    // Listen to expected close date changes
    this.headerForm.get('expectedCloseDate')?.valueChanges.subscribe((newValue) => {
      if (this.opportunity && newValue !== this.getOriginalFieldValue('expectedCloseDate')) {
        this.requestFieldChangeConfirmation(
          'expectedCloseDate',
          this.getOriginalFieldValue('expectedCloseDate'),
          new Date(newValue || '').toISOString()
        );
      }
    });

    // Listen to owner ID changes
    this.headerForm.get('ownerId')?.valueChanges.subscribe((newValue) => {
      if (this.opportunity && newValue !== this.getOriginalFieldValue('ownerId')) {
        this.requestFieldChangeConfirmation(
          'ownerId',
          this.getOriginalFieldValue('ownerId'),
          newValue
        );
      }
    });
  }

  private getOriginalFieldValue(fieldName: string): any {
    if (!this.opportunity) return null;

    switch (fieldName) {
      case 'expectedCloseDate':
        return this.opportunity.expectedCloseDate
          ? new Date(this.opportunity.expectedCloseDate).toISOString().substring(0, 16)
          : '';
      case 'ownerName':
        return this.opportunity.opportunityOwner?.Name || '';
      case 'ownerId':
        return this.opportunity.opportunityOwner?.Id || 0;
      default:
        return null;
    }
  }

  private requestFieldChangeConfirmation(fieldName: string, oldValue: any, newValue: any) {
    // Store pending change
    this.pendingChange = {
      field: fieldName,
      oldValue,
      newValue,
    };

    // Set confirmation dialog content based on field
    switch (fieldName) {
      case 'expectedCloseDate':
        this.confirmationTitle = 'Confirm Change';
        this.confirmationMessage = `Are you sure you want to change the expected close date?`;
        break;
      case 'ownerName':
      case 'ownerId':
        this.confirmationTitle = 'Change Opportunity Owner';
        this.confirmationMessage = `Are you sure you want to change the opportunity owner?`;
        break;
      default:
        this.confirmationTitle = 'Confirm Change';
        this.confirmationMessage = 'Are you sure you want to make this change?';
    }

    // Open confirmation modal
    this.changeConfirmationModal.open();
  }

  // load user list for opportunity owner display
  loadUserList(searchTerm: string = ''): void {
    this.userService.getUsers(searchTerm, 5, 0).subscribe((users) => {
      this.userList = users;
    });
  }

  // Generic confirmation handlers for all field changes
  onChangeConfirmed() {
    if (!this.pendingChange) return;

    console.log(`${this.pendingChange.field} change confirmed`);

    // Process the change based on field type
    switch (this.pendingChange.field) {
      case 'expectedCloseDate':
        this.updateExpectedCloseDate();
        break;
      case 'ownerName':
      case 'ownerId':
        this.updateOwner();
        break;
    }

    // Clear pending change
    this.pendingChange = null;
  }

  onChangeCancelled() {
    if (!this.pendingChange) return;

    console.log(`${this.pendingChange.field} change cancelled`);

    // Revert the form field to original value
    this.headerForm.patchValue(
      {
        [this.pendingChange.field]: this.pendingChange.oldValue,
      },
      { emitEvent: false }
    ); // emitEvent: false prevents triggering valueChanges again

    // Clear pending change
    this.pendingChange = null;
  }

  onOwnerSelected(event: any) {
    console.log('Owner selected from autocomplete:', event);
    // The valueChanges listener will handle the confirmation
  }

  // Update methods for different field types
  updateExpectedCloseDate() {
    if (!this.opportunity) return;
    if (!this.headerForm.value.expectedCloseDate) return;

    const updateData = {
      opportunityId: this.opportunity.opportunityId || '',
      expectedCloseDate: new Date(this.headerForm.value.expectedCloseDate).toISOString(),
    };

    this.opportunityService
      .updateOpportunity(this.opportunity.opportunityId, updateData)
      .subscribe({
        next: (updatedOpportunity) => {
          if (updatedOpportunity.opportunityId) {
            this.toastService.success('Opportunity updated successfully!');
            this.opportunity = updatedOpportunity;
            return;
          }
          this.toastService.error('Failed to update opportunity.');
        },
        error: (error) => {
          console.error('Error updating expected close date:', error);
          // Revert the form on error
          this.headerForm.patchValue(
            {
              expectedCloseDate: this.opportunity?.expectedCloseDate,
            },
            { emitEvent: false }
          );
        },
      });
  }

  updateOwner() {
    if (!this.opportunity) return;

    const newOwnerId = this.headerForm.value.ownerId;
    const newOwnerName = this.headerForm.value.ownerName;

    const updateData = {
      opportunityOwnerId: newOwnerId || undefined,
    };

    console.log('Updating opportunity owner:', updateData);
    this.opportunityService
      .updateOpportunity(this.opportunity.opportunityId, updateData)
      .subscribe({
        next: (updatedOpportunity) => {
          console.log('Opportunity owner updated successfully:', updatedOpportunity);
          this.opportunity = updatedOpportunity;
        },
        error: (error) => {
          console.error('Error updating opportunity owner:', error);
          // Revert the form on error
          this.headerForm.patchValue(
            {
              ownerId: this.opportunity?.opportunityOwner?.Id || 0,
              ownerName: this.opportunity?.opportunityOwner?.Name || '',
            },
            { emitEvent: false }
          );
        },
      });
  }

  // start: standard confirmation modal handlers

  // end: standard confirmation modal handlers
}

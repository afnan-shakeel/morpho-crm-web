import { ConfirmationBox } from '@/shared/components/confirmation-box/confirmation-box';
import { UserSelectionInput } from "@/shared/components/user-selection-input/user-selection-input";
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../../../core';
import { UsersService } from '../../../user/users.service';
import { OpportunityService } from '../../opportunity.service';
import { Opportunity } from '../../types';
import { StatusBadgeComponent } from '../status-badge/status-badge';

@Component({
  selector: 'app-opportunity-header-box',
  imports: [CommonModule, ConfirmationBox, FormsModule, ReactiveFormsModule, StatusBadgeComponent, UserSelectionInput],
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
  @Output() markAsLost: EventEmitter<void> = new EventEmitter<void>();
  @Output() markAsWon: EventEmitter<void> = new EventEmitter<void>();
  @Output() ownerChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() expectedCloseDateChanged: EventEmitter<string> = new EventEmitter<string>();

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
        this.markAsWon.emit();
      },
    },
    {
      label: 'Close As Lost',
      action: 'close_lost',
      handler: () => {
        this.markAsLost.emit();
      },
    },
  ];
  confirmationTitle: string = 'Confirm Change';
  confirmationMessage: string = 'Are you sure you want to change?';
  headerForm = this.fb.group({
    ownerId: [''],
    ownerName: [''],
    stageId: [''],
    expectedCloseDate: [''],
  });

  ngOnChanges() {
    {
      // populate header form when opportunity input changes
      if (this.opportunity) {
          this.headerForm.patchValue({
            ownerId: this.opportunity.opportunityOwner?.id || '',
            ownerName: this.opportunity.opportunityOwner?.fullName || '',
            // Only date part (YYYY-MM-DD) for input
            expectedCloseDate: this.opportunity.expectedCloseDate
              ? new Date(this.opportunity.expectedCloseDate).toISOString().substring(0, 10)
              : '',
          });
      }
    }
  }
  ngOnInit() {
    this.setupFormChangeListeners();
    this.loadUserList()
  }
  ngAfterViewInit() {
  }

  private setupFormChangeListeners() {
    // Listen to expected close date changes
    this.headerForm.get('expectedCloseDate')?.valueChanges.subscribe((newValue) => {
      if (this.opportunity && newValue !== this.getOriginalFieldValue('expectedCloseDate')) {
        // newValue is now just 'YYYY-MM-DD', convert to ISO datetime for API
        this.requestFieldChangeConfirmation(
          'expectedCloseDate',
          this.getOriginalFieldValue('expectedCloseDate'),
          newValue // keep as date for confirmation, conversion for API happens later
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
          ? new Date(this.opportunity.expectedCloseDate).toISOString().substring(0, 10)
          : '';
      case 'ownerName':
        return this.opportunity.opportunityOwner?.fullName || '';
      case 'ownerId':
        return this.opportunity?.opportunityOwner?.id || '';
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
      case 'ownerId':
        this.confirmationTitle = 'Change Opportunity Owner';
        this.confirmationMessage = `Are you sure you want to change the opportunity owner?`;
        break;
      default:
        this.confirmationTitle = 'Confirm Change';
        this.confirmationMessage = 'Are you sure you want to make this change?';
    }

    // open confirmation modal
    this.changeConfirmationModal.open();
  }

  // load user list for opportunity owner display
  loadUserList(searchTerm: string = ''): void {
    this.userService.getUsers(searchTerm, 5, 0).subscribe((users) => {
      this.userList = users.data
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
    this.headerForm.patchValue({
      ownerId: event.id,
      ownerName: event.fullName,
    });
    
  }

  // Update methods for different field types
  updateExpectedCloseDate() {
    if (!this.opportunity) return;
    if (!this.headerForm.value.expectedCloseDate) return;

    // Convert date (YYYY-MM-DD) to ISO datetime (YYYY-MM-DDT00:00:00.000Z)
    const dateValue = this.headerForm.value.expectedCloseDate;
    const isoDateTime = new Date(dateValue + 'T00:00:00Z').toISOString();

    const updateData = {
      opportunityId: this.opportunity.opportunityId || '',
      expectedCloseDate: isoDateTime,
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
              expectedCloseDate: this.opportunity?.expectedCloseDate
                ? new Date(this.opportunity.expectedCloseDate).toISOString().substring(0, 10)
                : '',
            },
            { emitEvent: false }
          );
        },
      });
  }

  updateOwner() {
    if (!this.opportunity) return;

    const newOwnerId = this.headerForm.value.ownerId;
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
              ownerId: this.opportunity?.opportunityOwner?.id || '',
              ownerName: this.opportunity?.opportunityOwner?.fullName || '',
            },
            { emitEvent: false }
          );
        },
      });
  }


}

import { CustomDatatable } from "@/shared/components/custom-datatable/custom-datatable";
import { PageHeading } from "@/shared/components/page-heading/page-heading";
import { Component, inject, ViewChild } from '@angular/core';
import { ToastService } from '../../../../../core';
import { Tab, TabChangeEvent, TabsComponent } from '../../../../../shared';
import { CellTemplate, ColorBadgeColor, DataTableColumn, DataTableRowAction } from '../../../../../shared/components/custom-datatable/types';
import { ModalSmall } from '../../../../../shared/components/modal-small/modal-small';
import { AccountActivityTypeForm } from "../../components/account-activity-type-form/account-activity-type-form";
import { AccountActivityTypesService } from '../../services/account-activity-types.service';
import { AccountActivityTypeMasterTypes } from '../../types/account-activity-types';

@Component({
  selector: 'app-account-master-listing',
  imports: [PageHeading, CustomDatatable, TabsComponent, ModalSmall, AccountActivityTypeForm],
  templateUrl: './account-master-listing.html',
  styleUrl: './account-master-listing.css'
})
export class AccountMasterListing {

  private toastService = inject(ToastService);
  private accountActivityTypeService = inject(AccountActivityTypesService);

  pageBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Account Master', path: '/admin/account-master' },
  ];
  contentTabs: Tab[] = [
    { id: 'account-activity-type', label: 'Account Activity Type', active: true },
  ];
  currentContent = 'account-activity-type';

  accountActivityTypes: AccountActivityTypeMasterTypes.AccountActivityType[] = [];
  accountActivityTypeListColumns: DataTableColumn[] = [
    { field: 'activityTypeId', label: 'Activity Type ID', hidden: true },
    { field: 'activityTypeName', label: 'Activity Type Name' },
    {
      field: 'isSystemDefined', label: 'System Defined', cellTemplate: CellTemplate.COLOR_BADGE, colorBadgeMapper: {
        'true': ColorBadgeColor.GREEN,
        'false': ColorBadgeColor.RED
      }, valueMapper: {
        'true': 'Yes',
        'false': 'No'
      }
    },
    { field: 'createdAt', label: 'Created Time', cellTemplate: CellTemplate.DATETIME },
  ];
  leadSourceRowActions: DataTableRowAction[] = [
    {
      label: 'Edit',
      actionCallback: (rowData: AccountActivityTypeMasterTypes.AccountActivityType) => {
        this.openAccountActivityTypeFormModal(rowData);
      }
    }
  ];

  ngOnInit(): void {
    // initial load
    this.loadAccountActivityTypes();
  }

  onContentTabChange(event: TabChangeEvent) {
    this.currentContent = event.tab.id;
    if (event.tab.id === 'account-activity-type') {
      this.loadAccountActivityTypes();
    }
  }

  loadAccountActivityTypes() {
    this.accountActivityTypeService.getAccountActivityTypes().subscribe({
      next: (types) => {
        this.accountActivityTypes = types;
      },
      error: (error) => {
        console.error('Error fetching account activity types:', error);
      }
    });
  }

  onCreateMasterData() {
    if (this.currentContent === 'account-activity-type') {
      this.openAccountActivityTypeFormModal();
    }
  }

  // start: open modals for account activity type create/edit
  accountActivityTypeToEdit: AccountActivityTypeMasterTypes.AccountActivityType | null = null;
  accountActivityTypeFormTitle: string = 'Create Account Activity Type';
  @ViewChild('accountActivityTypeFormModal') accountActivityTypeFormModal!: ModalSmall;

  openAccountActivityTypeFormModal(accountActivityType?: AccountActivityTypeMasterTypes.AccountActivityType) {
    if (accountActivityType && accountActivityType.activityTypeId) {
      this.accountActivityTypeToEdit = accountActivityType;
      this.accountActivityTypeFormTitle = 'Edit Account Activity Type';
    } else {
      this.accountActivityTypeToEdit = null;
      this.accountActivityTypeFormTitle = 'Create Account Activity Type';
    }
    this.accountActivityTypeFormModal.open();
  }
  closeAccountActivityTypeFormModal() {
    this.accountActivityTypeFormModal.close();
    this.accountActivityTypeToEdit = null;
  }
  onAccountActivityTypeFormSubmit(formData: { activityTypeName: string }) {
    if (this.accountActivityTypeToEdit) {
      // Update existing account activity type
      this.accountActivityTypeService.updateAccountActivityType(this.accountActivityTypeToEdit.activityTypeId, {
        activityTypeName: formData.activityTypeName
      }).subscribe({
        next: (response) => {
          if (response && response.activityTypeId) {
            this.toastService.success('Account Activity Type updated successfully!');
            this.loadAccountActivityTypes();
            this.closeAccountActivityTypeFormModal()
            return;
          }
        },
        error: (error) => {
          console.error('Error updating account activity type:', error);
        }
      });
    } else {
      // Create new account activity type
      this.accountActivityTypeService.createAccountActivityType({
        activityTypeName: formData.activityTypeName
      }).subscribe({
        next: (response) => {
          if (response && response.activityTypeId) {
            this.toastService.success('Account Activity Type created successfully!');
            this.loadAccountActivityTypes();
            this.closeAccountActivityTypeFormModal();
            return;
          }
        },
        error: (error) => {
          console.error('Error creating account activity type:', error);
        }
      });
    }
  }  
  // end: open modals for account activity type create/edit


}

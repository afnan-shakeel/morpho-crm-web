import { ModalMedium } from "@/shared/components/modal-medium/modal-medium";
import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core';
import { CustomDatatable } from '../../../../shared/components/custom-datatable/custom-datatable';
import { CellTemplate, ColorBadgeColor, DataTableColumn } from '../../../../shared/components/custom-datatable/types';
import { PageHeading } from '../../../../shared/components/page-heading/page-heading';
import { AccountsService } from '../../accounts.service';
import { AccountForm } from "../../components/account-form/account-form";
import { Account } from '../../types';

@Component({
  selector: 'app-accounts-listing',
  imports: [PageHeading, CustomDatatable, AccountForm, ModalMedium],
  templateUrl: './accounts-listing.html',
  styleUrl: './accounts-listing.css'
})
export class AccountsListing {
   @ViewChild('accountForm') accountForm!: ModalMedium;

  private router = inject(Router);
  private accountsService = inject(AccountsService);
  private toastService = inject(ToastService);
  pageBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Accounts', path: '/accounts/list' },
  ];

  accounts: Account[] = [];
  selectedAccountIdToUpdate: string | null = null;
  columns: DataTableColumn[] = [
    { field: 'accountId', label: 'Account ID', hidden: true },
    { field: 'companyName', label: 'Company Name', cellTemplate: CellTemplate.LINK, hrefField: 'accounts/:accountId/view' },
    {
      field: 'accountStatus',
      label: 'Account Status',
      cellTemplate: CellTemplate.COLOR_BADGE,
      colorBadgeMapper: {
        'Active': ColorBadgeColor.GREEN,
        'Inactive': ColorBadgeColor.RED,
        'Pending': ColorBadgeColor.ORANGE,
      },
    },
    { field: 'createdAt', label: 'Created Time', cellTemplate: CellTemplate.DATETIME },
  ];
  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  searchQuery: string = '';
  accountStatusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Pending', value: 'Pending' },
  ];
  filters: Filters[] = [
    {
      field: 'accountStatus',
      label: 'Account Status',
      value: '',
      type: 'select',
      options: this.accountStatusOptions,
    },
    { field: 'createdAt', label: 'Created At', value: null, type: 'date' },
  ];
  filterData: FilterData = {
    filters: this.filters,
    config: {},
  };
  apiReadyFilterData: any[] = [];

  tableRowActions = [
    {
      label: 'View',
      actionCallback: (rowData: Account) => {
      },
    },
    {
      label: 'Edit',
      actionCallback: (rowData: Account) => {
        this.selectedAccountIdToUpdate = rowData.accountId;
        this.openAccountFormModal();
      },
    },
    {
      label: 'Update Status',
      actionCallback: (rowData: Account) => {
      },
    },
  ];


  ngOnInit() {
    this.loadAccounts();

  }

  loadAccounts() {
    this.loading = true;

    const sort = {
      'field': 'createdAt',
      'order': 'desc'
    };
    const filters = this.apiReadyFilterData;
    // Call your service to fetch accounts here using the above parameters
    this.accountsService.getAccounts(this.searchQuery, filters, sort, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          let data = response.data || [];

          // use the columns to map the data correctly
          this.accounts = data.map((account: any) => {
            let mappedAccount: any = {};
            this.columns.forEach((column) => {
              mappedAccount[column.field] = account[column.field];
            });
            return mappedAccount;
          });
          this.totalRecords = response.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching accounts:', error);
          this.loading = false;
        }
      });
  }

  
  onPageChangeHandler(event: any) {
    this.currentPage = event;
    this.loadAccounts();
  }

  onSearchChange(event: any) {
    this.searchQuery = event;
    this.currentPage = 1;
    this.loadAccounts();
  }

    onFilterChange(event: Filters[]) {

    if (!event || event.length === 0) {
      this.apiReadyFilterData = [];
      this.currentPage = 1;
      this.loadAccounts();
      return;
    }
    // remove items with empty value
    const _filters = event.filter((filter) => filter.value);
    // map it to the format required by the API
    const filters = _filters.map((filter) => {
      let _apiType = 'contains';
      if (filter.type === 'select') _apiType = 'equals';
      if (filter.type === 'date') _apiType = 'equals';
      if (filter.type === 'multiselect') _apiType = 'list';

      return {
        field: filter.field,
        value: filter.value,
        type: _apiType,
      };
    });
    this.apiReadyFilterData = filters;

    this.currentPage = 1;
    this.loadAccounts();
  }

  onCreateAccount() {
    this.openAccountFormModal();
  }

  // start: accounts form modal
  openAccountFormModal() {
    this.accountForm.open();
  }
  closeAccountFormModal() {
    this.accountForm.close();
  }
  onAccountFormSubmit() {
    // call the create/update service
    this.closeAccountFormModal();
    this.loadAccounts();
  }
  // end: accounts form modal


}

import { CustomDatatable } from "@/shared/components/custom-datatable/custom-datatable";
import { PageHeading } from "@/shared/components/page-heading/page-heading";
import { DataMappingUtils } from "@/shared/utils/data-mapping";
import { Component, inject } from '@angular/core';
import { CellTemplate, ColorBadgeColor, DataTableColumn } from '../../../../shared/components/custom-datatable/types';
import { ContactsService } from '../../contacts.service';
import { Contact } from '../../types';

@Component({
  selector: 'app-contacts-listing',
  imports: [CustomDatatable, PageHeading],
  templateUrl: './contacts-listing.html',
  styleUrl: './contacts-listing.css'
})
export class ContactsListing {

  private contactsService = inject(ContactsService);
  pageBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Contacts', path: '/contacts/list' },
  ];
  contacts: Contact[] = [];
  columns: DataTableColumn[] = [
    { field: 'contactId', label: 'Contact ID', hidden: true },
    { field: 'fullName', label: 'Full Name', cellTemplate: CellTemplate.LINK, hrefField: 'contacts/:contactId/view' },
    { field: 'account.companyName', label: 'Company' },
    { field: 'jobTitle', label: 'Job Title' },
    { field: 'phone', label: 'phone' },
    {
      field: 'isPrimary',
      label: 'Primary Contact',
      cellTemplate: CellTemplate.COLOR_BADGE,
      colorBadgeMapper: {
        'true': ColorBadgeColor.BLUE,
        'false': ColorBadgeColor.GRAY,
      },
    },
    { field: 'createdAt', label: 'Created Time', cellTemplate: CellTemplate.DATETIME },
  ];

  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  searchQuery: string = '';
  eagerFetch: boolean = true;
  filters: Filters[] = [
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
      actionCallback: (rowData: Contact) => {
      },
    },
    {
      label: 'Edit',
      actionCallback: (rowData: Contact) => {
      },
    },
  ];

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.loading = true;
    const sort = {
      'field': 'createdAt',
      'order': 'desc'
    };
    this.contactsService.getContacts(this.searchQuery, this.apiReadyFilterData, sort, this.currentPage, this.pageSize, this.eagerFetch).subscribe({
      next: (response) => {
        let data = response.data || [];
        // use the columns to map the data correctly
        this.contacts = DataMappingUtils.mapDataToColumns<Contact>(data, this.columns);
        this.totalRecords = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching contacts:', error);
        this.loading = false;
      }
    });
  }

  onPageChangeHandler(event: any) {
    this.currentPage = event;
    this.loadContacts();
  }

  onSearchChange(event: any) {
    this.searchQuery = event;
    this.currentPage = 1;
    this.loadContacts();
  }

  onFilterChange(event: Filters[]) {

    if (!event || event.length === 0) {
      this.apiReadyFilterData = [];
      this.currentPage = 1;
      this.loadContacts();
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
    this.loadContacts();
  }


}

import { CustomDatatable } from "@/shared/components/custom-datatable/custom-datatable";
import { PageHeading } from "@/shared/components/page-heading/page-heading";
import { DataMappingUtils } from "@/shared/utils/data-mapping";
import { Component, inject, signal, ViewChild } from '@angular/core';
import { ToastService } from "../../../../core";
import { CellTemplate, ColorBadgeColor, DataTableColumn } from '../../../../shared/components/custom-datatable/types';
import { ModalMedium } from "../../../../shared/components/modal-medium/modal-medium";
import { ContactForm } from "../../components/contact-form/contact-form";
import { ContactsService } from '../../contacts.service';
import { Contact, CreateContactPayload, UpdateContactPayload } from '../../types';

@Component({
  selector: 'app-contacts-listing',
  imports: [CustomDatatable, PageHeading, ModalMedium, ContactForm],
  templateUrl: './contacts-listing.html',
  styleUrl: './contacts-listing.css'
})
export class ContactsListing {
  @ViewChild('contactForm') contactForm!: ModalMedium;

  private contactsService = inject(ContactsService);
  private toastService = inject(ToastService);
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
      valueMapper: {
        'true': 'Yes',
        'false': 'No',
      }
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

  selectedContactIdToUpdate = signal<string | null>(null);
  tableRowActions = [
    {
      label: 'View',
      actionCallback: (rowData: Contact) => {
      },
    },
    {
      label: 'Edit',
      actionCallback: (rowData: Contact) => {
        this.selectedContactIdToUpdate.set(rowData.contactId);
        this.openContactFormModal();
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

  // start: contact form modal
  resetFormEvent = signal<boolean>(false);
  openContactFormModal() {
    this.contactForm.open();
  }
  closeContactFormModal() {
    this.contactForm.close();
    this.resetFormEvent.set(true);
    this.selectedContactIdToUpdate.set(null);
  }
  onContactFormSubmit(formData: any) {
    console.log('Contact form submitted with data:', formData);
    if (!formData) {
      this.closeContactFormModal();
      return;
    }
    // call the create/update service
    if (formData.contactId) {
      this.updateContact(formData.contactId, formData)

    } else {
      this.createContact(formData);
    }
  }
  // end: contacts form modal

  createContact(formData: CreateContactPayload) {
    this.contactsService.createContact(formData).subscribe({
      next: (response) => {
        if (response.contactId) {
          this.closeContactFormModal();
          this.toastService.success('Contact created successfully!');
          this.resetFormEvent.set(true);
          this.loadContacts();
        } else {
          this.toastService.error('Failed to create contact. Please try again.');
        }
      },
      error: (error) => {
        console.error('Error creating contact:', error);
      }
    });
  }
  updateContact(contactId: string, formData: UpdateContactPayload) {
    this.contactsService.updateContact(contactId, formData).subscribe({
      next: (response) => {
        if (response.contactId) {
          this.closeContactFormModal();
          this.toastService.success('Contact updated successfully!');
          this.resetFormEvent.set(true);
          this.loadContacts();
          return;
        }
        else {
          this.toastService.error('Failed to update contact. Please try again.');
        }
      },
      error: (error) => {
        console.error('Error updating contact:', error);
      }
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccountsService } from '../../../accounts/accounts.service';
import { Account } from '../../../accounts/types';
import { ContactsService } from '../../../contacts/contacts.service';
import { Contact } from '../../../contacts/types';
import { LeadsService } from '../../leads.service';
import { Lead } from '../../types';

export interface LeadData {
  id: string;
  leadName: string;
  companyName: string;
  leadTopic?: string;
  email?: string;
  phone?: string;
  status?: string;
  leadOwnerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadConversionFormData {
  // Company/Account Selection
  useExistingAccount: boolean;
  companyName: string;
  accountName: string;

  // Lead/Contact Selection
  useExistingContact: boolean;
  leadName: string;
  contactName: string;
}

@Component({
  selector: 'app-lead-conversion-review',
  imports: [CommonModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lead-conversion-review.html',
  styleUrl: './lead-conversion-review.css'
})
export class LeadConversionReview implements OnInit, OnChanges {
  @Input() leadId: string | null = null;
  leadData: Lead | null = null;
  @Output() formSubmit = new EventEmitter<LeadConversionFormData>();

  conversionForm!: FormGroup;

  accounts: Account[] = [];
  contacts: Contact[] = [];

  selectedAccountIdForContactDropdown: string | null = null;

  private fb = inject(FormBuilder);
  private leadService = inject(LeadsService);
  private accountsService = inject(AccountsService);
  private contactsService = inject(ContactsService);

  ngOnInit(): void {
    this.initializeForm();
    if (this.leadId) {
      this.fetchLeadData(this.leadId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['leadId'] && !changes['leadId'].firstChange) {
      const newLeadId = changes['leadId'].currentValue;
      this.fetchLeadData(newLeadId);
      this.initializeForm();
    }

    // changes for the form field account name to load contacts based on selected account
    if (changes['conversionForm']) {
      const accountNameControl = this.conversionForm.get('accountName');
      if (accountNameControl) {
        accountNameControl.valueChanges.subscribe(value => {
          const selectedAccount = this.accounts.find(acc => acc.companyName === value);
          this.selectedAccountIdForContactDropdown = selectedAccount ? selectedAccount.accountId : null;
          this.loadContacts('');
        });
      }
    }
  }

  private initializeForm(): void {
    this.conversionForm = this.fb.group({
      useExistingAccount: [false],
      companyName: [''],
      accountName: [''],

      useExistingContact: [false],
      leadName: [''],
      contactName: ['']
    }, { validators: [this.customValidator.bind(this)] });
    this.loadAccounts('');
    this.loadContacts('');
  }

  private fetchLeadData(leadId: string): void {
    this.leadService.getLeadById(leadId).subscribe({
      next: (lead) => {
        this.leadData = lead;
        this.populateFormWithLeadData();
      },
      error: (error) => {
        console.error('Error fetching lead data:', error);
      }
    });
  }

  loadAccounts(searchTerm: string): void {
    this.accountsService.searchAccountsForAutocomplete(searchTerm).subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      }
    });
  }

  loadContacts(searchTerm: string): void {
    this.contactsService.searchContactsForAutocomplete(searchTerm, 10, this.selectedAccountIdForContactDropdown).subscribe({
      next: (contacts) => {
        this.contacts = contacts;
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
      }
    });
  }

  private populateFormWithLeadData(): void {
    if (this.leadData && this.conversionForm) {
      this.conversionForm.patchValue({
        companyName: this.leadData.companyName || '',
        leadName: this.leadData.firstName || '',
        // Set default to use lead data (not existing system data)
        useExistingAccount: false,
        useExistingContact: false
      });
    }
  }

  onSubmit(): void {
    if (this.conversionForm.valid) {
      const formData: LeadConversionFormData = this.conversionForm.value;
      this.formSubmit.emit(formData);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.conversionForm.controls).forEach(key => {
        this.conversionForm.get(key)?.markAsTouched();
      });
    }
  }

  cancel(): void {
    this.initializeForm();
    this.formSubmit.emit();
  }

  // Helper method to check if field has error
  hasError(fieldName: string): boolean {
    const field = this.conversionForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Helper method to get error message
  getErrorMessage(fieldName: string): string {
    const field = this.conversionForm.get(fieldName);
    if (field?.errors?.['required']) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      leadName: 'Lead Name',
      companyName: 'Company Name',
      accountName: 'Account Name',
      contactName: 'Contact Name'
    };
    return labels[fieldName] || fieldName;
  }

  // Custom validator to ensure required fields based on radio selection
  private customValidator(form: FormGroup): { [key: string]: any } | null {
    const errors: { [key: string]: any } = {};

    // Validate Company/Account selection
    const useExistingAccount = form.get('useExistingAccount')?.value;
    const companyName = form.get('companyName')?.value;
    const accountName = form.get('accountName')?.value;

    if (useExistingAccount) {
      if (!accountName || accountName.trim() === '') {
        errors['accountNameRequired'] = true;
      }
    } else {
      if (!companyName || companyName.trim() === '') {
        errors['companyNameRequired'] = true;
      }
    }

    // Validate Lead/Contact selection
    const useExistingContact = form.get('useExistingContact')?.value;
    const leadName = form.get('leadName')?.value;
    const contactName = form.get('contactName')?.value;

    if (useExistingContact) {
      if (!contactName || contactName.trim() === '') {
        errors['contactNameRequired'] = true;
      }
    } else {
      if (!leadName || leadName.trim() === '') {
        errors['leadNameRequired'] = true;
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Helper methods for specific field validation
  isCompanyNameRequired(): boolean {
    return !this.conversionForm?.get('useExistingAccount')?.value;
  }

  isAccountNameRequired(): boolean {
    return this.conversionForm?.get('useExistingAccount')?.value;
  }

  isLeadNameRequired(): boolean {
    return !this.conversionForm?.get('useExistingContact')?.value;
  }

  isContactNameRequired(): boolean {
    return this.conversionForm?.get('useExistingContact')?.value;
  }

  // Check if specific field has validation error
  hasCustomError(fieldName: string): boolean {
    const errors = this.conversionForm?.errors;
    return !!(errors && errors[fieldName + 'Required']);
  }
}

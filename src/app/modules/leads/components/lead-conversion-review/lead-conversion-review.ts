import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
  templateUrl: './lead-conversion-review.html',
  styleUrl: './lead-conversion-review.css'
})
export class LeadConversionReview implements OnInit, OnChanges {
  @Input() leadId: string = '';
  @Input() leadData: LeadData | null = null;
  @Output() formSubmit = new EventEmitter<LeadConversionFormData>();

  conversionForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.populateFormWithLeadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['leadData'] && !changes['leadData'].firstChange) {
      this.populateFormWithLeadData();
    }
  }

  private initializeForm(): void {
    this.conversionForm = this.fb.group({
      // Company/Account Selection
      useExistingAccount: [false],
      companyName: [''],
      accountName: [''],
      
      // Lead/Contact Selection
      useExistingContact: [false],
      leadName: [''],
      contactName: ['']
    }, { validators: [this.customValidator.bind(this)] });
  }



  private populateFormWithLeadData(): void {
    if (this.leadData && this.conversionForm) {
      // Pre-populate form with lead data
      this.conversionForm.patchValue({
        companyName: this.leadData.companyName || '',
        leadName: this.leadData.leadName || '',
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

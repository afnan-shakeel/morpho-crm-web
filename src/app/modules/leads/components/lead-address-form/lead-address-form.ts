import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../../core';
import { LeadsService } from '../../leads.service';
import { LeadAddressForm as LeadAddressFormType } from '../../types';

@Component({
  selector: 'app-lead-address-form',
  imports: [ReactiveFormsModule],
  templateUrl: './lead-address-form.html',
  styleUrl: './lead-address-form.css'
})
export class LeadAddressForm {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private leadsService = inject(LeadsService);

  public leadId: string | null = null;
  @Input() set setLeadId(value: string | null) {
    this.leadId = value;
  }
  isEditMode: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() saveButtonText: string = 'Save';
  @Input() saveAndExitButtonText: string = 'Save and Exit';
  @Output() submitAddress: EventEmitter<{data: LeadAddressFormType, action: 'save' | 'saveAndExit'}> = new EventEmitter();
  @Output() cancelAddress: EventEmitter<void> = new EventEmitter();


  ngOnInit() {
    this.getLeadAddress();
  }
  leadInformationErrorMessage: string = 'Please fill and save lead information before adding an address.';
  addressForm = this.fb.group({
    addressId: [''],
    addressLine1: [''],
    addressLine2: [''],
    city: [''],
    postalCode: [''],
    state: ['', Validators.required],
    country: ['Oman', Validators.required]
  });

  onSubmit(action: 'save' | 'saveAndExit' = 'save') {
    if (!this.leadId) {
      this.toastService.error('Please fill and save lead information before adding an address.');
      return;
    }
    if (this.addressForm.valid) {
      this.submitAddress.emit({ data: this.addressForm.value as LeadAddressFormType, action });
    }
  }

  onCancel() {
    this.cancelAddress.emit();
  }

  getLeadAddress() {
    if (!this.leadId) return;
    this.leadsService.getLeadAddress(this.leadId).subscribe({
      next: (response) => {
        // if address data exists, populate the form and consider edit mode
        if (response && response.addressId) {
          this.populateAddressForm(response);
          this.isEditMode = true;
        }
        else {
          this.isEditMode = false;
          // this.addressForm.reset();
        }
      }
    });
  }

  populateAddressForm(addressData: LeadAddressFormType) {
    this.addressForm.patchValue(addressData);
  }
}

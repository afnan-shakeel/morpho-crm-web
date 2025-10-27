import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../../core';

@Component({
  selector: 'app-lead-address-form',
  imports: [ReactiveFormsModule],
  templateUrl: './lead-address-form.html',
  styleUrl: './lead-address-form.css'
})
export class LeadAddressForm {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  private leadId: string | null = null;
  @Input() set setLeadId(value: string | null) {
    this.leadId = value;
  }
  @Output() submitAddress: EventEmitter<any> = new EventEmitter<any>();


  ngOnInit() {
    if(!this.leadId) {
      // disable the form if no leadId is provided
      this.addressForm.disable();
    }
  }
  leadInformationErrorMessage: string = 'Please fill and save lead information before adding an address.';
  addressForm = this.fb.group({
    addressId: [''],
    addressLine1: [''],
    addressLine2: [''],
    city: [''],
    pincode: [''],
    state: ['', Validators.required],
    country: ['Oman', Validators.required]
  });

  onSubmit() {
    if (!this.leadId) {
      this.toastService.error('Please fill and save lead information before adding an address.');
      return;
    }
    if (this.addressForm.valid) {
      this.submitAddress.emit(this.addressForm.value);
    }
  }

  getLeadAddress() {
    // Simulate fetching address data for the given leadId
    if (!this.leadId) return;
    const addressData = {
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      city: 'Metropolis',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    };
    this.populateAddress(addressData);
  }

  // Method to populate the form with existing address data
  populateAddress(addressData: any) {
    this.addressForm.patchValue(addressData);
  }
}

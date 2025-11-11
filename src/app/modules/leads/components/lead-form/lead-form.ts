import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { AutocompleteDirective } from '../../../../shared';
import { User } from '../../../user/user.types';
import { UsersService } from '../../../user/users.service';
import { LeadsService } from '../../leads.service';
import {
  Lead,
  LeadAddressForm as LeadAddressFormType,
  LeadFormData,
  LeadOwnerOption,
  LeadSource,
  LeadStatus,
  LeadStatusOption
} from '../../types';
import { LeadAddressForm } from "../lead-address-form/lead-address-form";

@Component({
  selector: 'app-lead-form',
  imports: [LeadAddressForm, ɵInternalFormsSharedModule, ReactiveFormsModule, CommonModule, AutocompleteDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lead-form.html',
  styleUrl: './lead-form.css'
})
export class LeadForm {

  private fb = inject(FormBuilder);
  private userService = inject(UsersService);
  private leadsService = inject(LeadsService);

  @Input() isEditMode: boolean = false;
  @Input() formTitle: string = 'Create Lead';
  @Input() leadId: string | null = null;
  @Input() leadSourceOptions: LeadSource[] = [];
  @Input() leadStatusOptions: LeadStatusOption[] = [];
  @Input() isLoading: boolean = false;
  @Input() showAddressForm: boolean = false;
  @Input() saveButtonText: string = 'Save';
  @Input() saveAndExitButtonText: string = 'Save and Exit';

  @Output() formSubmit = new EventEmitter<{data: LeadFormData, action: 'next' | 'saveAndExit'}>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() addressFormSubmit = new EventEmitter<{data: LeadAddressFormType, action: 'save' | 'saveAndExit'}>();

  leadInfoForm = this.fb.group({
    leadId: [''],
    leadTopic: ['', Validators.required],
    leadOwnerId: ['', Validators.required], // is a string UUID
    leadOwnerName: ['', Validators.required],
    leadSourceId: [''],
    leadStatus: [LeadStatus.NEW, Validators.required],
    leadConversionDate: [new Date().toISOString().slice(0, 16)],
    firstName: ['', Validators.required],
    lastName: [''],
    phoneNumber: [''],
    email: ['', [Validators.email]],
    companyName: [''],
  });

  userList: User[] = []

  ngOnInit() {
    if (this.isEditMode && this.leadId) {
      // fetch lead data by leadId and populate the form
      this.populateLeadData(this.leadId);
    }
    this.loadUserList();

    // Watch for leadStatus changes to set leadConversionDate
    this.leadInfoForm.get('leadStatus')?.valueChanges.subscribe(status => {
      if (status === LeadStatus.CONVERTED) {
        this.leadInfoForm.get('leadConversionDate')?.setValue(new Date().toISOString().slice(0, 16));
      } else {
        this.leadInfoForm.get('leadConversionDate')?.setValue(null);
      }
    });
  }

  ngAfterViewInit() {
  }

  loadUserList(_searchTerm: string = '') {
    const searchTerm = _searchTerm ? _searchTerm.trim() : '';
    const maxResults = 20;
    this.userService.getUsers(searchTerm, null, null, 1, maxResults).subscribe(res => {
      this.userList = res.data
    });
  }

  private populateLeadData(leadId: string) {
    this.leadsService.getLeadById(leadId).subscribe({
      next: (response: Lead) => {
        const leadData = response;
        this.leadInfoForm.patchValue({
          leadId: leadData.leadId,
          leadOwnerId: leadData.leadOwnerId,
          leadOwnerName: leadData.leadOwner?.fullName || '',
          leadSourceId: leadData.leadSourceId,
          leadStatus: leadData.leadStatus,
          leadTopic: leadData.leadTopic,
          leadConversionDate: leadData.convertedAt ? new Date(leadData.convertedAt).toISOString().slice(0, 16) : null,
          firstName: leadData.firstName,
          lastName: leadData.lastName,
          phoneNumber: leadData.phone,
          email: leadData.email,
          companyName: leadData.companyName
        });
        this.leadInfoForm.patchValue({ leadOwnerName: "admin admin" });
      },
      error: (error) => {
        console.error('Error fetching lead data:', error);
      }
    });
  }

  setOwnerName(user: LeadOwnerOption) {
    this.leadInfoForm.patchValue({ leadOwnerName: user.fullName });
  }

  onSubmit(action: 'next' | 'saveAndExit' = 'next') {
    if (this.leadInfoForm.valid) {
      const leadData = this.leadInfoForm.value;

      const submissionData: LeadFormData = {
        leadOwnerId: leadData.leadOwnerId || '',
        leadOwnerName: leadData.leadOwnerName || '',
        leadSourceId: leadData.leadSourceId || null,
        leadStatus: leadData.leadStatus || LeadStatus.NEW,
        leadTopic: leadData.leadTopic || null,
        leadConversionDate: leadData.leadConversionDate,
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        phoneNumber: leadData.phoneNumber,
        email: leadData.email,
        companyName: leadData.companyName,
        leadId: this.leadId || undefined,
      };

      this.formSubmit.emit({ data: submissionData, action });
    } else {
      // Mark all fields as touched to show validation errors
      this.leadInfoForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

  handleLeadAddressSubmit(addressData: LeadAddressFormType, action: 'save' | 'saveAndExit' = 'save') {
    this.addressFormSubmit.emit({ data: addressData, action });
  }
}

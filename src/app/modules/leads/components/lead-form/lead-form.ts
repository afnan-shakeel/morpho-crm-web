import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { UsersService } from '../../../user/users.service';
import { LeadsService } from '../../leads.service';
import {
  Lead,
  LeadAddressForm as LeadAddressFormType,
  LeadFormData,
  LeadOwnerOption,
  LeadSourceOption,
  LeadStatus,
  LeadStatusOption
} from '../../types';
import { LeadAddressForm } from "../lead-address-form/lead-address-form";

@Component({
  selector: 'app-lead-form',
  imports: [LeadAddressForm, ɵInternalFormsSharedModule, ReactiveFormsModule, CommonModule],
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
  @Input() leadSourceOptions: LeadSourceOption[] = [];
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
    leadOwnerId: [0, Validators.required], // is a integer
    leadOwnerName: ['', Validators.required],
    leadSource: [''],
    leadStatus: [LeadStatus.NEW, Validators.required],
    leadConversionDate: [new Date().toISOString().slice(0, 16)],
    firstName: ['', Validators.required],
    lastName: [''],
    phoneNumber: [''],
    email: ['', [Validators.email]],
    company: [''],
  });

  userList: LeadOwnerOption[] = []

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

    // [custom event] handle input event for lead owner autocomplete
    const leadOwnerElement = document.getElementById('leadOwner');
    if (leadOwnerElement) {
      leadOwnerElement.addEventListener('input', (event: any) => {
        const optionsContainer = leadOwnerElement.querySelector('el-options');
        const optionElements = optionsContainer?.getElementsByTagName('el-option');
        if (optionElements) {
          // filter elements based on user search
          for (let i = 0; i < optionElements.length; i++) {
            const option = optionElements[i];
            const selectedUserName = this.leadInfoForm.get('leadOwnerName')?.value?.toLowerCase() || '';
            const optionUserName = option.getAttribute('value')?.toLowerCase() || '';
            if (optionUserName.includes(selectedUserName)) {
              const selectedUserId = option.getAttribute('id');
              this.leadInfoForm.patchValue({ leadOwnerId: isNaN(Number(selectedUserId)) ? 0 : Number(selectedUserId) });
              break;
            }
          }
        }

        // if the input is cleared, reset leadOwnerId
        if (!this.leadInfoForm.get('leadOwnerName')?.value) {
          this.leadInfoForm.patchValue({ leadOwnerId: 0 });
        }

      });
    }
  }

  private loadUserList(_searchTerm: string = '') {
    const searchTerm = _searchTerm ? _searchTerm.trim() : '';
    const maxResults = 20;
    const skipCount = 0;
    this.userService.getUsers(searchTerm, maxResults, skipCount).subscribe(users => {
      this.userList = users.map((user: any): LeadOwnerOption => ({
        fullName: `${user.fullName}`,
        id: user.id,
        userName: user.userName,
      }));
    });
  }

  private populateLeadData(leadId: string) {
    this.leadsService.getLeadById(leadId).subscribe({
      next: (response: Lead) => {
        const leadData = response;
        this.leadInfoForm.patchValue({
          leadId: leadData.leadId,
          leadOwnerId: leadData.leadOwnerId,
          leadOwnerName: leadData.leadOwnerName,
          leadSource: leadData.leadSource,
          leadStatus: leadData.leadStatus,
          leadConversionDate: leadData.leadConversionDate,
          firstName: leadData.firstName,
          lastName: leadData.lastName,
          phoneNumber: leadData.phoneNumber,
          email: leadData.email,
          company: leadData.company
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
        leadOwnerId: leadData.leadOwnerId as number,
        leadOwnerName: leadData.leadOwnerName || '',
        leadSource: leadData.leadSource,
        leadStatus: leadData.leadStatus || LeadStatus.NEW,
        leadConversionDate: leadData.leadConversionDate,
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        phoneNumber: leadData.phoneNumber,
        email: leadData.email,
        company: leadData.company,
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

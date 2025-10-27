import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { UsersService } from '../../../../core/services/business/users.service';
import { LeadsService } from '../../leads.service';
import {
  Lead,
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

  @Output() formSubmit = new EventEmitter<LeadFormData>();
  @Output() formCancel = new EventEmitter<void>();

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
      this.fetchLeadData(this.leadId);
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

    // handle input event for lead owner autocomplete
    const leadOwnerElement = document.getElementById('leadOwner');
    if (leadOwnerElement) {
      leadOwnerElement.addEventListener('input', (event: any) => {
        const searchTerm = event.target.value;
        const optionsContainer = leadOwnerElement.querySelector('el-options');
        const optionElements = optionsContainer?.getElementsByTagName('el-option');
        if (optionElements) {
          // filter elements based on search term
          for (let i = 0; i < optionElements.length; i++) {
            const option = optionElements[i];
            const fullName = option.textContent || '';
            if (fullName.toLowerCase().includes(searchTerm.toLowerCase())) {
              const userId = isNaN(Number(option.getAttribute('id'))) ? 0 : Number(option.getAttribute('id'));
              this.leadInfoForm.patchValue({ leadOwnerId: userId });
            }
          }
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

  private fetchLeadData(leadId: string) {
    this.leadsService.getLeadById(leadId).subscribe({
      next: (response: Lead) => {
        const leadData = response;
        // Populate the form with the fetched lead data
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
      },
      error: (error) => {
        console.error('Error fetching lead data:', error);
      }
    });
  }

  setOwnerId(user: LeadOwnerOption) {
    console.log('Setting Owner ID:', user.id);
    this.leadInfoForm.patchValue({ leadOwnerId: user.id });
    console.log('Selected Owner ID:', this.leadInfoForm.get('leadOwnerId')?.value);
  }

  onSubmit() {
    if (this.leadInfoForm.valid) {
      const leadData = this.leadInfoForm.value;

      // Prepare the data for submission
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

      // Emit the form data to the parent component
      this.formSubmit.emit(submissionData);
    } else {
      // Mark all fields as touched to show validation errors
      this.leadInfoForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}

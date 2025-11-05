import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core';
import { LeadForm } from "../../components/lead-form/lead-form";
import { LeadsService } from '../../leads.service';
import {
  CreateLeadPayload,
  LeadAddressForm,
  LeadFormData,
  LeadSource,
  LeadStatus,
  LeadStatusOption,
  UpdateLeadPayload
} from '../../types';

@Component({
  selector: 'app-leads-create-or-update',
  imports: [LeadForm],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './leads-create-or-update.html',
  styleUrl: './leads-create-or-update.css'
})
export class LeadsCreateOrUpdate {

  private leadService = inject(LeadsService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  // get the leadId from query params to determine if it's create or update
  private fb = inject(FormBuilder);
  leadId = signal<string | null>(null);
  isEditMode = signal<boolean>(false);
  formTitle = signal<string>('Create Lead');
  showAddressForm = signal<boolean>(false);

  leadSources: LeadSource[] = [];
  leadStatuses: LeadStatusOption[] = [];
  isLoading = signal<boolean>(false);

  // Button text based on mode
  get saveButtonText(): string {
    return this.isEditMode() ? 'Update' : 'Save';
  }

  get saveAndExitButtonText(): string {
    return this.isEditMode() ? 'Update and Exit' : 'Save and Exit';
  }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    this.leadId.set(urlParams.get('leadId'));
    console.log('Lead ID from query params:', this.leadId());
    this.isEditMode.set(this.leadId() !== null);

    if (this.isEditMode()) {
      this.formTitle.set('Edit Lead');
      this.showAddressForm.set(true); // Show address form immediately in edit mode
    }
    this.setLeadsLookupData();
  }

  setLeadsLookupData() {
    this.getLeadSources();
    this.getLeadStatuses();
  }
  getLeadSources() {
    this.leadService.getLeadSources().subscribe({
      next: (sources) => {
        this.leadSources = sources;
      },
      error: (error) => {
        console.error('Error fetching lead sources:', error);
      },
    });
  }

  getLeadStatuses() {
    this.leadService.getLeadsLookupData().subscribe({
      next: (response) => {
        this.leadStatuses = response.leadStatuses.map(status => ({ label: status.label, value: status.value }));
      },
      error: (error) => {
        console.error('Error fetching lead statuses:', error);
      },
    });
  }

  onFormSubmit(formData: LeadFormData, action: 'next' | 'saveAndExit' = 'next') {
    if (this.isLoading()) return; // Prevent multiple submissions

    this.isLoading.set(true);

    if (formData.leadId) {
      this.updateLead(formData, action);
    } else {
      this.createLead(formData, action);
    }
  }

  onFormCancel() {
    // Navigate back to leads listing page
    this.router.navigate(['/leads']);
  }

  private createLead(leadData: LeadFormData, action: 'next' | 'saveAndExit') {
    // Remove unnecessary fields before sending to API
    const { leadId, ...cleanData } = leadData;

    const createPayload: CreateLeadPayload = {
      leadOwnerId: cleanData.leadOwnerId,
      leadOwnerName: cleanData.leadOwnerName,
      leadSourceId: cleanData.leadSourceId || null,
      leadStatus: cleanData.leadStatus || LeadStatus.NEW,
      leadTopic: cleanData.leadTopic || null,
      leadConversionDate: cleanData.leadConversionDate,
      firstName: cleanData.firstName || '',
      lastName: cleanData.lastName || null,
      phone: cleanData.phoneNumber || null,
      email: cleanData.email || null,
      companyName: cleanData.companyName || null
    };

    this.leadService.createLead(createPayload).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response) {
          this.leadId.set(response.leadId);
          this.isEditMode.set(true);
          this.formTitle.set('Edit Lead');
          this.toastService.success('Lead saved successfully');

          if (action === 'next') {
            this.showAddressForm.set(true);
            // wait 2 seconds and then scroll down to address section
            setTimeout(() => {
              const addressSection = document.getElementById('lead-address-form');
              if (addressSection) {
                addressSection.scrollIntoView({ behavior: 'smooth' });
              }
            }, 2000);
          } else if (action === 'saveAndExit') {
            this.router.navigate(['/leads']);
          }
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error creating lead:', error);
      }
    });
  }

  private updateLead(leadData: LeadFormData, action: 'next' | 'saveAndExit') {
    // Remove unnecessary fields before sending to API
    const { ...cleanData } = leadData;

    const updatePayload: UpdateLeadPayload = {
      leadId: cleanData.leadId!,
      leadOwnerId: cleanData.leadOwnerId || undefined,
      leadOwnerName: cleanData.leadOwnerName || undefined,
      leadSourceId: cleanData.leadSourceId || undefined,
      leadStatus: cleanData.leadStatus || undefined,
      leadTopic: cleanData.leadTopic || undefined,
      leadConversionDate: cleanData.leadConversionDate || undefined,
      firstName: cleanData.firstName || undefined,
      lastName: cleanData.lastName || undefined,
      phone: cleanData.phoneNumber || undefined,
      email: cleanData.email || undefined,
      companyName: cleanData.companyName || undefined
    };

    this.leadService.updateLead(updatePayload).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response) {
          this.toastService.success('Lead updated successfully');

          if (action === 'next') {
            this.showAddressForm.set(true);
            // Scroll to address section
            setTimeout(() => {
              const addressSection = document.getElementById('lead-address-form');
              if (addressSection) {
                addressSection.scrollIntoView({ behavior: 'smooth' });
              }
            }, 500);
          } else if (action === 'saveAndExit') {
            this.router.navigate(['/leads']);
          }
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error updating lead:', error);
      }
    });
  }

  onAddressFormSubmit(addressData: LeadAddressForm, action: 'save' | 'saveAndExit' = 'save') {
    addressData.isPrimary = true; // ensure primary flag is set
    this.leadService.createLeadAddress(this.leadId()!, addressData).subscribe({
      next: (response) => {
        if (response.addressId) {
          this.toastService.success('Lead address saved successfully');

          if (action === 'saveAndExit') {
            this.router.navigate(['/leads']);
          }
        }
      },
      error: (error) => {
        console.error('Error creating lead address:', error);
      }
    });
  }

  onAddressFormCancel() {
    // Navigate back to leads listing page
    this.router.navigate(['/leads']);
  }
}

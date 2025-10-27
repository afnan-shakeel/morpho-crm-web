import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LeadForm } from "../../components/lead-form/lead-form";
import { LeadsService } from '../../leads.service';
import {
  CreateLeadPayload,
  LeadFormData,
  LeadLookupData,
  LeadSourceOption,
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

  // get the leadId from query params to determine if it's create or update
  private fb = inject(FormBuilder);
  leadId: string | null = null;
  isEditMode: boolean = false;
  formTitle: string = 'Create Lead';

  leadSources: LeadSourceOption[] = [];
  leadStatuses: LeadStatusOption[] = [];
  isLoading: boolean = false;

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    this.leadId = urlParams.get('leadId');
    this.isEditMode = this.leadId !== null;
    
    if (this.isEditMode) {
      this.formTitle = 'Edit Lead';
    }
    this.setLeadsLookupData();
  }

  setLeadsLookupData() {
    this.leadService.getLeadsLookupData().subscribe({
      next: (response: LeadLookupData) => {
        this.leadSources = response?.leadSources || [];
        this.leadStatuses = response?.leadStatuses || [];
      },
      error: (err) => {
        console.error('Error fetching lead lookup data:', err);
      }
    })
  }

  onFormSubmit(formData: LeadFormData) {
    if (this.isLoading) return; // Prevent multiple submissions
    
    this.isLoading = true;
    
    if (formData.leadId) {
      this.updateLead(formData);
    } else {
      this.createLead(formData);
    }
  }

  onFormCancel() {
    // Navigate back to leads listing page
    this.router.navigate(['/leads']);
  }

  private createLead(leadData: LeadFormData) {
    // Remove unnecessary fields before sending to API
    const { leadId, ...cleanData } = leadData;
    
    const createPayload: CreateLeadPayload = {
      leadOwnerId: cleanData.leadOwnerId,
      leadOwnerName: cleanData.leadOwnerName,
      leadSource: cleanData.leadSource || null,
      leadStatus: cleanData.leadStatus || LeadStatus.NEW,
      leadConversionDate: cleanData.leadConversionDate,
      firstName: cleanData.firstName || '',
      lastName: cleanData.lastName || null,
      phone: cleanData.phoneNumber || null,
      email: cleanData.email || null,
      companyName: cleanData.company || null
    };
    
    this.leadService.createLead(createPayload).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response) {
          console.log('Lead created successfully:', response);
          // Navigate to leads listing or show success message
          // this.router.navigate(['/leads']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating lead:', error);
      }
    });
  }

  private updateLead(leadData: LeadFormData) {
    // Remove unnecessary fields before sending to API
    const { ...cleanData } = leadData;
    
    const updatePayload: UpdateLeadPayload = {
      leadId: cleanData.leadId!,
      leadOwnerId: cleanData.leadOwnerId || undefined,
      leadOwnerName: cleanData.leadOwnerName || undefined,
      leadSource: cleanData.leadSource || undefined,
      leadStatus: cleanData.leadStatus || undefined,
      leadConversionDate: cleanData.leadConversionDate || undefined,
      firstName: cleanData.firstName || undefined,
      lastName: cleanData.lastName || undefined,
      phone: cleanData.phoneNumber || undefined,
      email: cleanData.email || undefined,
      companyName: cleanData.company || undefined
    };
    
    this.leadService.updateLead(updatePayload).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response) {
          console.log('Lead updated successfully:', response);
          // Navigate to leads listing or show success message
          // this.router.navigate(['/leads']);
        }
      }, 
      error: (error) => {
        this.isLoading = false;
        console.error('Error updating lead:', error);
      }
    });
  }
}

import { ModalLarge } from "@/shared/components/modal-large/modal-large";
import { ModalSmall } from "@/shared/components/modal-small/modal-small";
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core';
import { ModalMedium } from "../../../../shared/components/modal-medium/modal-medium";
import { PageHeading } from '../../../../shared/components/page-heading/page-heading';
import { LeadsInteractionMasterService } from '../../../admin/leads-master/services/lead-interaction-master.service';
import { LeadInteractionTypeTypes } from '../../../admin/leads-master/types';
import { LeadAddressForm } from "../../components/lead-address-form/lead-address-form";
import { LeadConversionReview } from "../../components/lead-conversion-review/lead-conversion-review";
import { LeadForm } from '../../components/lead-form/lead-form';
import { LeadInteractionForm } from "../../components/lead-interaction-form/lead-interaction-form";
import { LeadInteractionsTable } from "../../components/lead-interactions-table/lead-interactions-table";
import { LeadLogsTimeline } from "../../components/lead-logs-timeline/lead-logs-timeline";
import { LeadStatusChangeBox } from "../../components/lead-status-change-box/lead-status-change-box";
import { LeadStatusBadgeComponent } from "../../components/status-badge/status-badge";
import { LeadsService } from '../../leads.service';
import { CreateLeadAddressPayload, Lead, LeadAddress, LeadAddressForm as LeadAddressFormType, LeadFormData, LeadSource, LeadStatus, LeadStatusOption, UpdateLeadAddressPayload, UpdateLeadPayload } from '../../types';

@Component({
  selector: 'app-lead-detail-view',
  imports: [CommonModule, PageHeading, LeadLogsTimeline, LeadInteractionsTable, LeadForm, LeadStatusBadgeComponent, ModalMedium, ModalSmall, LeadStatusChangeBox, LeadConversionReview, LeadInteractionForm, LeadAddressForm],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lead-detail-view.html',
  styleUrl: './lead-detail-view.css'
})
export class LeadDetailView {
  @ViewChild('leadUpdateFormModal') leadUpdateFormModal!: ModalLarge;
  @ViewChild('leadAddressUpdateFormModal') leadAddressUpdateFormModal!: ModalMedium;
  @ViewChild('leadStatusChangeModal') leadStatusChangeModal!: ModalSmall;
  @ViewChild('leadConversionReviewModal') leadConversionReviewModal!: ModalMedium;
  @ViewChild('leadInteractionModal') leadInteractionModal!: ModalMedium;

  private router = inject(Router)
  private leadsService = inject(LeadsService)
  private toastService = inject(ToastService)
  private leadsInteractionMasterService = inject(LeadsInteractionMasterService);

  pageBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Leads', path: '/leads' },
    { label: '#', path: '/leads/#' },
  ];

  @Input() leadId: string | null = null;
  leadDetails: Lead | null = null;
  leadAddressDetails: LeadAddress | null = null;
  leadSources!: LeadSource[];
  leadStatuses!: LeadStatusOption[];
  isLoading = signal<boolean>(false);

  leadActivityLogRefreshTrigger = signal<number>(0);

  leadQuickActions: any[] = [
    {
      label: 'Edit Lead', handler: () => {
        this.openLeadUpdateFormModal();
      }
    },
    {
      label: 'Update Status', handler: () => {
        this.openLeadStatusChangeDialog();

      }
    },
    { label: 'Convert Lead', handler: () => { } },
  ];

  leadInteractionTypes: LeadInteractionTypeTypes.LeadInteractionType[] = [];

  ngOnInit() {
    this.loadLeadInteractionTypes();

    // extract leadId from the URL
    const urlSegments = this.router.url.split('/');
    this.leadId = urlSegments[urlSegments.length - 1];
    if (!this.leadId) {
      // handle missing leadId, maybe redirect or show error
      this.toastService.error('Could not find the specified lead.');
      this.router.navigate(['/leads']);
    }

    // set page breadcrumb last item label to leadId
    this.pageBreadcrumbs[2].label = this.leadId;
    this.pageBreadcrumbs[2].path = `/leads/${this.leadId}`;


    this.getLeadStatuses();
    this.getLeadSources();
    this.fetchLeadDetails();
  }

  ngOnDestroy() {
  }

  getLeadStatuses() {
    this.leadsService.getLeadsLookupData().subscribe({
      next: (response) => {
        this.leadStatuses = response.leadStatuses.map(status => ({ label: status.label, value: status.value }));
      },
      error: (error) => {
        console.error('Error fetching lead statuses:', error);
      },
    });
  }
  getLeadSources() {
    this.leadsService.getLeadSources().subscribe({
      next: (sources) => {
        this.leadSources = sources;
      },
    });
  }

  // method to fetch lead details
  fetchLeadDetails() {
    if (!this.leadId) return;

    this.leadsService.getLeadById(this.leadId, true).subscribe({
      next: (leads) => {
        if (leads) {
          this.leadDetails = leads;
        }
      },
      error: (err) => {
        console.error('Unexpected error:', err);
        this.toastService.error('An unexpected error occurred.');
      }
    });

    this.fetchLeadAddressDetails();
  }

  // method to fetch lead address details
  fetchLeadAddressDetails() {
    if (!this.leadId) return;
    this.leadsService.getLeadAddress(this.leadId).subscribe({
      next: (address) => {
        this.leadAddressDetails = address;
      },
      error: (err) => {
        console.error('Error fetching lead address details:', err);
        this.toastService.error('Failed to load lead address details.');
      }
    });
  }

  loadLeadInteractionTypes() {
    this.leadsInteractionMasterService.getLeadInteractionTypes().subscribe((types) => {
      this.leadInteractionTypes = types;
    });
  }

  // start: lead update form modal
  openLeadUpdateFormModal() {
    this.leadUpdateFormModal.open();
  }
  closeLeadUpdateFormModal() {
    this.leadUpdateFormModal.close();
  }
  onLeadUpdateSubmit(data: any) {
    const formData = data.data as LeadFormData;
    if (!formData) {
      this.closeLeadUpdateFormModal();
      return;
    }

    if (formData.leadId) {
      this.updateLead(formData);
    }
  }
  private updateLead(leadData: LeadFormData) {

    const updatePayload: UpdateLeadPayload = {
      leadId: leadData.leadId!,
      leadOwnerId: leadData.leadOwnerId || undefined,
      leadOwnerName: leadData.leadOwnerName || undefined,
      leadSourceId: leadData.leadSourceId || undefined,
      leadStatus: leadData.leadStatus || undefined,
      leadTopic: leadData.leadTopic || undefined,
      leadConversionDate: leadData.leadConversionDate || undefined,
      firstName: leadData.firstName || undefined,
      lastName: leadData.lastName || undefined,
      phone: leadData.phoneNumber || undefined,
      email: leadData.email || undefined,
      companyName: leadData.companyName || undefined
    };

    this.leadsService.updateLead(updatePayload).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response && response.leadId) {
          this.toastService.success('Lead updated successfully');
          this.closeLeadUpdateFormModal();
          this.fetchLeadDetails();
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error updating lead:', error);
      }
    });
  }
  // end: lead update form modal

  // start: lead address update form modal
  openLeadAddressUpdateFormModal() {
    this.leadAddressUpdateFormModal.open();
  }
  closeLeadAddressUpdateFormModal() {
    this.leadAddressUpdateFormModal.close();
  }
  onLeadAddressUpdateSubmit(data: any) {
    // data is of type { data: LeadFormData, action: 'save' | 'saveAndExit' }
    console.log('Lead address form submitted with data:', data);
    const formData = data.data as LeadAddressFormType;
    if (!formData) {
      this.closeLeadAddressUpdateFormModal();
      return;
    }

    if (formData.addressId) {
      this.updateLeadAddress(formData);
    } else {
      this.createLeadAddress(formData);
    }
  }
  private updateLeadAddress(leadAddressData: LeadAddressFormType) {
    const updatePayload: UpdateLeadAddressPayload = {
      addressId: this.leadAddressDetails?.addressId!,
      addressLine1: leadAddressData.addressLine1 || undefined,
      addressLine2: leadAddressData.addressLine2 || undefined,
      city: leadAddressData.city || undefined,
      state: leadAddressData.state || undefined,
      postalCode: leadAddressData.postalCode || undefined,
      leadId: this.leadDetails?.leadId!,
      country: leadAddressData.country || undefined,
      isPrimary: leadAddressData.isPrimary
    };

    this.leadsService.updateLeadAddress(this.leadDetails?.leadId!, updatePayload).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response && response.addressId) {
          this.toastService.success('Lead address updated successfully');
          this.closeLeadAddressUpdateFormModal();
          this.fetchLeadDetails();
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error updating lead address:', error);
      }
    });
  }
  private createLeadAddress(leadAddressData: LeadAddressFormType) {
    const createPayload: CreateLeadAddressPayload = {
      addressLine1: leadAddressData.addressLine1 || undefined,
      addressLine2: leadAddressData.addressLine2 || undefined,
      city: leadAddressData.city || undefined,
      state: leadAddressData.state || undefined,
      postalCode: leadAddressData.postalCode || undefined,
      leadId: this.leadDetails?.leadId!,
      country: leadAddressData.country || undefined,
      isPrimary: true
    };

    this.leadsService.createLeadAddress(this.leadDetails?.leadId!, createPayload).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response && response.addressId) {
          console.log('Lead address created successfully:', response);
          this.toastService.success('Lead address created successfully');
          this.closeLeadAddressUpdateFormModal();
          this.fetchLeadDetails();
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error creating lead address:', error);
      }
    });
  }
  // end: lead address update form modal

  // start: lead status change modal
  openLeadStatusChangeDialog() {
    this.leadStatusChangeModal.open();
  }
  closeLeadStatusChangeDialog() {
    this.leadStatusChangeModal.close();
  }
  handleLeadStatusUpdate(status: LeadStatus | null) {
    if (!this.leadDetails) {
      this.toastService.error('No lead selected for status update.');
      return;
    }
    if (!status) {
      this.toastService.error('Please select a valid status.');
      return;
    }

    this.leadsService
      .updateLeadStatus(
        this.leadDetails.leadId,
        status
      )
      .subscribe({
        next: (response) => {
          if (response && response.leadId) {
            this.closeLeadStatusChangeDialog();
            this.fetchLeadDetails(); // refresh the leads list
            this.leadActivityLogRefreshTrigger.set(this.leadActivityLogRefreshTrigger() + 1);
            return;
          }
        },
        error: (error) => {
          console.error('Error updating lead status:', error);
        },
      });
  }
  // end: lead status change modal

  // start: lead conversion review modal
  openLeadConversionReviewModal() {
    this.leadConversionReviewModal.open();
  }
  closeLeadConversionReviewModal() {
    this.leadConversionReviewModal.close();
  }
  onLeadConversionSubmit(formData: any) {
  }
  // end: lead conversion review modal

  // start: lead interaction modal
  interactionRefreshTrigger = signal<number>(0);
  openLeadInteractionModal() {
    this.leadInteractionModal.open();
  }

  closeLeadInteractionModal() {
    this.leadInteractionModal.close();
  }

  onInteractionSubmit(data: any) {
    if (!this.leadDetails) {
      this.toastService.error('No lead selected for adding interaction.');
      return;
    }
    this.leadsService.createLeadInteraction(this.leadDetails?.leadId, data).subscribe({
      next: (response) => {
        if (response.interactionId) {
          this.toastService.success('Lead interaction created successfully.');
          this.interactionRefreshTrigger.set(this.interactionRefreshTrigger() + 1);
          this.leadActivityLogRefreshTrigger.set(this.leadActivityLogRefreshTrigger() + 1);
          this.closeLeadInteractionModal();
          return;
        }
        this.toastService.error('Failed to create lead interaction. Please try again later.');
      },
      error: (error) => {
        console.error('Error creating lead interaction:', error);
      },
    });
  }
  // end: lead interaction modal

}

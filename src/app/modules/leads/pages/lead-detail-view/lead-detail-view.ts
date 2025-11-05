import { ModalLarge } from "@/shared/components/modal-large/modal-large";
import { ModalSmall } from "@/shared/components/modal-small/modal-small";
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core';
import { ModalMedium } from "../../../../shared/components/modal-medium/modal-medium";
import { PageHeading } from '../../../../shared/components/page-heading/page-heading';
import { LeadConversionReview } from "../../components/lead-conversion-review/lead-conversion-review";
import { LeadForm } from '../../components/lead-form/lead-form';
import { LeadInteractionForm } from "../../components/lead-interaction-form/lead-interaction-form";
import { LeadInteractionsTable } from "../../components/lead-interactions-table/lead-interactions-table";
import { LeadLogsTimeline } from "../../components/lead-logs-timeline/lead-logs-timeline";
import { LeadStatusChangeBox } from "../../components/lead-status-change-box/lead-status-change-box";
import { LeadStatusBadgeComponent } from "../../components/status-badge/status-badge";
import { LeadsService } from '../../leads.service';
import { Lead, LeadAddress, LeadSource, LeadStatus, LeadStatusOption } from '../../types';

@Component({
  selector: 'app-lead-detail-view',
  imports: [CommonModule, PageHeading, LeadLogsTimeline, LeadInteractionsTable, LeadForm, LeadStatusBadgeComponent, ModalLarge, ModalMedium, ModalSmall, LeadStatusChangeBox, LeadConversionReview, LeadInteractionForm],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lead-detail-view.html',
  styleUrl: './lead-detail-view.css'
})
export class LeadDetailView {
  @ViewChild('leadUpdateFormModal') leadUpdateFormModal!: ModalLarge;
  @ViewChild('leadStatusChangeModal') leadStatusChangeModal!: ModalSmall;
  @ViewChild('leadConversionReviewModal') leadConversionReviewModal!: ModalMedium;
  @ViewChild('leadInteractionModal') leadInteractionModal!: ModalMedium;

  private router = inject(Router)
  private leadsService = inject(LeadsService)
  private toastService = inject(ToastService)
  pageBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Leads', path: '/leads' },
    { label: '#', path: '/leads/#' },
  ];

  @Input() leadId: string | null = null;
  leadDetails: Lead | null = null;
  leadAddressDetails: LeadAddress | null = null;
  leadSources: LeadSource[] = [];
  leadStatuses: LeadStatusOption[] = [];
  isLoading = signal<boolean>(false);

  leadStatusOptions: Array<{ label: string; value: string }> = [];

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
  ngOnInit() {
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
    this.fetchLeadDetails();
  }

  ngOnDestroy() {
  }

  getLeadStatuses() {
    this.leadsService.getLeadsLookupData().subscribe({
      next: (response) => {
        this.leadStatusOptions = response.leadStatuses.map(status => ({ label: status.label, value: status.value }));
      },
      error: (error) => {
        console.error('Error fetching lead statuses:', error);
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


  // start: lead update form modal
  openLeadUpdateFormModal() {
    this.leadUpdateFormModal.open();
    console.log('Lead details to update:', this.leadDetails);
  }
  closeLeadUpdateFormModal() {
    this.leadUpdateFormModal.close();
  }
  onLeadUpdateSubmit(formData: any) {
    if (!formData) {
      this.closeLeadUpdateFormModal();
      return;
    }

    if (formData.leadId) {
      // this.updateLead(formData.leadId, formData);
    }
  }
  // end: lead update form modal

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

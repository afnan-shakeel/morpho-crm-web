import { ModalMedium } from "@/shared/components/modal-medium/modal-medium";
import { PageHeading } from "@/shared/components/page-heading/page-heading";
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from "../../../../core";
import { OpportunityDocumentsComponent } from '../../components/opportunity-documents/opportunity-documents.component';
import { OpportunityForm } from "../../components/opportunity-form/opportunity-form";
import { OpportunityHeaderBox } from "../../components/opportunity-header-box/opportunity-header-box";
import { OpportunityStageProgress } from "../../components/opportunity-stage-progress/opportunity-stage-progress";
import { OpportunitySummary } from "../../components/opportunity-summary/opportunity-summary";
import { OpportunityService } from '../../opportunity.service';
import { Opportunity, OpportunityStatus, UpdateOpportunityPayload } from '../../types';

@Component({
  selector: 'app-opportunity-main',
  imports: [OpportunityHeaderBox, OpportunityStageProgress, CommonModule, OpportunitySummary, PageHeading, ModalMedium, OpportunityForm, OpportunityDocumentsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './opportunity-main.html',
  styleUrl: './opportunity-main.css'
})
export class OpportunityMain {
  @ViewChild('opportunityForm') opportunityForm!: ModalMedium;

  private toastService = inject(ToastService);
  private opportunityService = inject(OpportunityService);
  private route = inject(ActivatedRoute);
  pageBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Opportunities', path: '/opportunities/list' },
    { label: '#', path: '/opportunities/#' },
  ];
  opportunityId: string = '';
  opportunity = signal<Opportunity | null>(null);

  tabs = signal([
    { label: 'Summary', content: 'Summary' },
    { label: 'File Attachments', content: 'Files' },
  ]);
  activeTabIndex = signal(0);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.opportunityId = params['id'];
      this.fetchOpportunityDetails();
      this.pageBreadcrumbs[2].label = this.opportunityId || '#';
      this.pageBreadcrumbs[2].path = `/opportunities/${this.opportunityId}`;
    });
  }

  setActiveTab(index: number): void {
    this.activeTabIndex.set(index);
  }

  private fetchOpportunityDetails(): void {
    this.opportunityService.getOpportunityById(this.opportunityId, true).subscribe({
      next: (opportunity) => {
        this.opportunity.set(opportunity);
      },
      error: (error) => {
        console.error('Error fetching opportunity details:', error);
      }
    });
  }

  makeOpportunityCloseWon() {
  const opportunity = this.opportunity();
    if (!opportunity) return;

    this.opportunityService.markOpportunityAsClosed(opportunity.opportunityId, OpportunityStatus.Won).subscribe({
      next: (updatedOpportunity) => {
        if (updatedOpportunity.opportunityId) {
          this.toastService.success('Opportunity stage updated successfully!');
          this.opportunity.set(updatedOpportunity);
        } else {
          this.toastService.error('Failed to update opportunity stage.');
        }
      },
      error: (error) => {
        console.error('Error updating opportunity stage:', error);
      },
    });
  }

  makeOpportunityCloseLost() {
  const opportunity = this.opportunity();
    if (!opportunity) return;

    this.opportunityService.markOpportunityAsClosed(opportunity.opportunityId, OpportunityStatus.Lost).subscribe({
      next: (updatedOpportunity) => {
        if (updatedOpportunity.opportunityId) {
          this.toastService.success('Opportunity stage updated successfully!');
          this.opportunity.set(updatedOpportunity);
        } else {
          this.toastService.error('Failed to update opportunity stage.');
        }
      },
      error: (error) => {
        console.error('Error updating opportunity stage:', error);
      },
    });
  }

  // start: contact form modal
  openOpportunityFormModal() {
    this.opportunityForm.open();
  }
  closeOpportunityFormModal() {
    this.opportunityForm.close();
  }
  onOpportunityFormSubmit(formData: any) {
    if (!formData) {
      this.closeOpportunityFormModal();
      return;
    }
    // call the create/update service
    if (formData.opportunityId) {
      this.updateOpportunity(formData.opportunityId, formData);
    }
  }
  updateOpportunity(opportunityId: string, formData: UpdateOpportunityPayload) {
    this.opportunityService
      .updateOpportunity(opportunityId, {
        accountId: formData.accountId,
        contactId: formData.contactId,
        opportunityName: formData.opportunityName,
        opportunityOwnerId: formData.opportunityOwnerId,
        stageId: formData.stageId,
        status: formData.status,
        closedDate: formData.closedDate ? new Date(formData.closedDate).toISOString() : null,
        expectedCloseDate: formData.expectedCloseDate
          ? new Date(formData.expectedCloseDate).toISOString()
          : null,
        notes: formData.notes,
      })
      .subscribe({
        next: (response) => {
          if (response.opportunityId) {
            this.closeOpportunityFormModal();
            this.toastService.success('Opportunity updated successfully!');
            this.opportunity.set(response);
            return;
          } else {
            this.toastService.error('Failed to update opportunity. Please try again.');
          }
        },
        error: (error) => {
          console.error('Error updating opportunity:', error);
        },
      });
  }
  // end: contacts form modal


}

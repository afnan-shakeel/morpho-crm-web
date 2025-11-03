import { PageHeading } from "@/shared/components/page-heading/page-heading";
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OpportunityHeaderBox } from "../../components/opportunity-header-box/opportunity-header-box";
import { OpportunityStageProgress } from "../../components/opportunity-stage-progress/opportunity-stage-progress";
import { OpportunitySummary } from "../../components/opportunity-summary/opportunity-summary";
import { OpportunityService } from '../../opportunity.service';
import { Opportunity } from '../../types';

@Component({
  selector: 'app-opportunity-main',
  imports: [OpportunityHeaderBox, OpportunityStageProgress, CommonModule, OpportunitySummary, PageHeading],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './opportunity-main.html',
  styleUrl: './opportunity-main.css'
})
export class OpportunityMain {

  private opportunityService = inject(OpportunityService);
  private route = inject(ActivatedRoute);
  pageBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Opportunities', path: '/opportunities' },
    { label: '#', path: '/opportunities/#' },
  ];
  opportunityId: string = '';
  opportunity: Opportunity | null = null;

  tabs = signal([
    { label: 'Summary', content: 'Summary' },
    { label: 'File Attachments', content: 'Files' },
    { label: 'Related', content: 'Related' },
  ]);
  activeTabIndex = signal(0);

  quickActions = [
    {
      label: 'Close As Won', action: 'close_won', handler: () => {
        console.log('Close As Won action triggered');
      }
    },
    {
      label: 'Close As Lost', action: 'close_lost', handler: () => {
        console.log('Close As Lost action triggered');
      }
    },
    {
      label: 'Add Activity', action: 'add_activity', handler: () => {
        console.log('Add Activity action triggered');
      }
    },
  ];

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
        this.opportunity = opportunity;
      },
      error: (error) => {
        console.error('Error fetching opportunity details:', error);
      }
    });
  }
}

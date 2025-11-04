import { AccountsActivityLog } from "@/modules/accounts/components/accounts-activity-log/accounts-activity-log";
import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { AccountActivityRelatedToEnum } from "../../../accounts/types";
import { Opportunity } from '../../types';
import { OpportunityStageProgress } from "../opportunity-stage-progress/opportunity-stage-progress";

@Component({
  selector: 'app-opportunity-summary',
  imports: [CommonModule, OpportunityStageProgress, AccountsActivityLog],
  templateUrl: './opportunity-summary.html',
  styleUrl: './opportunity-summary.css'
})
export class OpportunitySummary {

  @Input() opportunity: Opportunity | null = null;
  @Input() activityRelatedTo: string = AccountActivityRelatedToEnum.OPPORTUNITY;
  @Input() activityRelatedEntityId: string = '';

  ngOnInit(): void {
    this.activityRelatedEntityId = this.opportunity ? this.opportunity.opportunityId : '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['opportunity']) {
      this.activityRelatedEntityId = this.opportunity ? this.opportunity.opportunityId : '';
    }
  }
}

import { AccountsActivityLog } from "@/modules/accounts/components/accounts-activity-log/accounts-activity-log";
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
}

import { AccountsActivityLog } from "@/modules/accounts/components/accounts-activity-log/accounts-activity-log";
import { ContactInfoBox } from "@/modules/contacts/components/contact-info-box/contact-info-box";
import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { AccountActivitiesTypes } from "../../../accounts/types";
import { Opportunity } from '../../types';

@Component({
  selector: 'app-opportunity-summary',
  imports: [CommonModule, AccountsActivityLog, ContactInfoBox],
  templateUrl: './opportunity-summary.html',
  styleUrl: './opportunity-summary.css'
})
export class OpportunitySummary {

  @Input() opportunity: Opportunity | null = null;
  @Input() activityRelatedTo: string = AccountActivitiesTypes.AccountActivityRelatedToEnum.OPPORTUNITY;
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

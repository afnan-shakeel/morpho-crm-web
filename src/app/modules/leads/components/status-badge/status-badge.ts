import { Component, Input } from '@angular/core';
import { LeadStatus } from '../../types';
import { getLeadStatusCssClasses } from '../../utils';

@Component({
  selector: 'app-lead-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css'
})
export class LeadStatusBadgeComponent {
  @Input() status: LeadStatus = LeadStatus.NEW;

  get badgeClasses(): string {
    return getLeadStatusCssClasses(this.status);
  }

  get statusText(): string {
    return this.status;
  }
}

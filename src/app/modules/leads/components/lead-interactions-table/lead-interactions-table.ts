import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { UsersService } from '../../../user/users.service';
import { LeadsService } from '../../leads.service';
import { Lead, LeadInteraction } from '../../types';

@Component({
  selector: 'app-lead-interactions-table',
  imports: [CommonModule],
  templateUrl: './lead-interactions-table.html',
  styleUrl: './lead-interactions-table.css'
})
export class LeadInteractionsTable {

  private leadService = inject(LeadsService);
  private userService = inject(UsersService);

  @Input() lead: Lead | null = null;
  @Input() leadId: string | null = null;

  leadInteractions: LeadInteraction[] = [];

  ngOnInit() {
    this.loadLeadInteractions();
  }

  private loadLeadInteractions() {
    if (this.leadId) {
      this.leadService.getLeadInteractions(this.leadId, true).subscribe(interactions => {
        this.leadInteractions = interactions;
      });
    }
  }
}

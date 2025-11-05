import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { UsersService } from '../../../user/users.service';
import { LeadsService } from '../../leads.service';
import { LeadLogs } from '../../types';

@Component({
  selector: 'app-lead-logs-timeline',
  imports: [CommonModule],
  templateUrl: './lead-logs-timeline.html',
  styleUrl: './lead-logs-timeline.css'
})
export class LeadLogsTimeline {

  private leadService = inject(LeadsService);
  private userService = inject(UsersService);
  @Input() leadId: string | null = null;

  leadLogs: LeadLogs[] = []; // Replace 'any' with the actual type of lead logs when available

  ngOnInit() {
    this.loadLeadLogs();
  }

  private loadLeadLogs() {
    if (this.leadId) {
      this.leadService.getLeadLogs(this.leadId, true).subscribe(logs => {
        this.leadLogs = logs;
      });
    }
  }
}

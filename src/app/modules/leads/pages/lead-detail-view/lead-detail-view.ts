import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { ToastService } from '../../../../core';
import { PageHeading } from '../../../../shared/components/page-heading/page-heading';
import { UsersService } from '../../../user/users.service';
import { LeadInteractionsTable } from "../../components/lead-interactions-table/lead-interactions-table";
import { LeadLogsTimeline } from "../../components/lead-logs-timeline/lead-logs-timeline";
import { LeadSummaryBox } from "../../components/lead-summary-box/lead-summary-box";
import { LeadsService } from '../../leads.service';
import { Lead, LeadAddress } from '../../types';

@Component({
  selector: 'app-lead-detail-view',
  imports: [PageHeading, LeadLogsTimeline, LeadInteractionsTable, LeadSummaryBox],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lead-detail-view.html',
  styleUrl: './lead-detail-view.css'
})
export class LeadDetailView {
  private router = inject(Router)
  private leadsService = inject(LeadsService)
  private userService = inject(UsersService)
  private toastService = inject(ToastService)
  pageBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Leads', path: '/leads' },
    { label: '#', path: '/leads/#' },
  ];

  @Input() leadId: string | null = null;
  leadDetails: Lead | null = null;
  leadAddressDetails: LeadAddress | null = null;

  ngOnInit() {
    // extract leadId from the URL
    const urlSegments = this.router.url.split('/');
    this.leadId = urlSegments[urlSegments.length - 1];

    // set page breadcrumb last item label to leadId
    this.pageBreadcrumbs[2].label = this.leadId || '#';
    this.pageBreadcrumbs[2].path = `/leads/${this.leadId}`;

    if (!this.leadId) {
      // handle missing leadId, maybe redirect or show error
      this.toastService.error('Could not find the specified lead.');
      this.router.navigate(['/leads']);
    }

    this.fetchLeadDetails();
  }

  ngOnDestroy() {
  }

  // method to fetch lead details
  fetchLeadDetails() {
    if (!this.leadId) return;
    
    this.leadsService.getLeadById(this.leadId, true).pipe(
      switchMap((lead) => {
        if (!lead) return of(null);
        
        const leadOwner$ = this.userService.getUserById(lead.leadOwnerId).pipe(
          map(user => user?.fullName || null),
          catchError(() => of(null))
        );
        
        // Use forkJoin to execute both requests in parallel
        return forkJoin({
          leadOwnerName: leadOwner$
        }).pipe(
          map(({ leadOwnerName }) => ({
            ...lead,
            leadSourceName: lead.leadSource?.sourceName || undefined,
            leadOwnerName: leadOwnerName || undefined
          }))
        );
      }),
      catchError((err) => {
        console.error('Error fetching lead details:', err);
        this.toastService.error('Failed to load lead details.');
        return of(null);
      })
    ).subscribe({
      next: (enrichedLead) => {
        if (enrichedLead) {
          console.log('Fetched enriched lead details:', enrichedLead);
          this.leadDetails = enrichedLead;
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
        console.log('Fetched lead address details:', address);
        this.leadAddressDetails = address;
      },
      error: (err) => {
        console.error('Error fetching lead address details:', err);
        this.toastService.error('Failed to load lead address details.');
      }
    });
  }

}

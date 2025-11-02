import { CustomDatatable } from '@/shared/components/custom-datatable/custom-datatable';
import { PageHeading } from '@/shared/components/page-heading/page-heading';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core';
import {
  CellTemplate,
  ColorBadgeColor,
  DataTableColumn,
} from '../../../../shared/components/custom-datatable/types';
import { ModalMedium } from '../../../../shared/components/modal-medium/modal-medium';
import { ModalSmall } from '../../../../shared/components/modal-small/modal-small';
import { LeadConversionReview } from "../../components/lead-conversion-review/lead-conversion-review";
import { LeadInteractionForm } from "../../components/lead-interaction-form/lead-interaction-form";
import { LeadsService } from '../../leads.service';
import { Lead } from '../../types';

@Component({
  selector: 'app-lead-listing',
  imports: [PageHeading, CustomDatatable, ModalSmall, ModalMedium, FormsModule, LeadInteractionForm, LeadConversionReview],
  templateUrl: './lead-listing.html',
  styleUrl: './lead-listing.css',
})
export class LeadListing {
  @ViewChild('leadStatusChangeModal') leadStatusChangeModal!: ModalSmall;
  @ViewChild('leadInteractionModal') leadInteractionModal!: ModalSmall;
  @ViewChild('leadConversionReviewModal') leadConversionReviewModal!: ModalMedium;

  constructor() {
    this.setLeadLookupData();
  }

  private router = inject(Router);
  private leadsService = inject(LeadsService);
  private toastService = inject(ToastService);
  pageBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Leads', path: '/leads' },
  ];

  leads: any[] = [];
  columns: DataTableColumn[] = [
    { field: 'leadId', label: 'Lead ID', hidden: true },
    { field: 'firstName', label: 'Name', cellTemplate: CellTemplate.LINK, hrefField: '/leads/detail/:leadId' },
    { field: 'email', label: 'Email' },
    { field: 'phone', label: 'Phone' },
    {
      field: 'leadStatus',
      label: 'Lead Status',
      cellTemplate: CellTemplate.COLOR_BADGE,
      colorBadgeMapper: {
        New: ColorBadgeColor.BLUE,
        Contacted: ColorBadgeColor.ORANGE,
        Interested: ColorBadgeColor.TEAL,
        Converted: ColorBadgeColor.GREEN,
        Disqualified: ColorBadgeColor.RED,
      },
    },
    { field: 'createdAt', label: 'Created At', cellTemplate: CellTemplate.DATETIME },
  ];
  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  searchQuery: string = '';
  leadSourcesOptions: Array<{ label: string; value: string }> = [];
  leadStatusOptions: Array<{ label: string; value: string }> = [];
  filters: Filters[] = [
    {
      field: 'leadStatus',
      label: 'Lead Status',
      value: '',
      type: 'select',
      options: this.leadStatusOptions,
    },
    {
      field: 'leadSource',
      label: 'Lead Source',
      value: '',
      type: 'select',
      options: this.leadSourcesOptions,
    },
    { field: 'ConvertedAt', label: 'Converted At', value: null, type: 'date' },
    { field: 'createdAt', label: 'Created At', value: null, type: 'date' },
  ];
  filterData: FilterData = {
    filters: this.filters,
    config: {},
  };
  apiReadyFilterData: any[] = [];

  tableRowActions = [
    {
      label: 'View',
      actionCallback: (rowData: any) => {
        console.log('View Details clicked for:', rowData);
        // navigate to the lead detail view page, add in route path
        this.router.navigate(['/leads/detail', rowData.leadId]);
      },
    },
    {
      label: 'Edit',
      actionCallback: (rowData: Lead) => {
        console.log('Edit clicked for:', rowData);
        // navigate to the lead edit page
        this.router.navigate(['/leads/form'], { queryParams: { leadId: rowData.leadId } });
      },
    },
    {
      label: 'Update Status',
      actionCallback: (rowData: Lead) => {
        console.log('clicked for:', rowData);
        this.leadStatusUpdateFormData.leadId = rowData.leadId;
        this.leadStatusUpdateFormData.newStatus = rowData.leadStatus;
        this.openLeadStatusChangeDialog();
      },
    },
    {
      label: 'Add Interaction',
      actionCallback: (rowData: Lead) => {
        console.log('clicked for:', rowData);
        this.selectedLeadIdForInteraction = rowData.leadId;
        this.openLeadInteractionForm(rowData.leadId);
      },
    },
    {
      label: 'Convert to Opportunity',
      actionCallback: (rowData: any) => {
        console.log('Convert to Opportunity clicked for:', rowData);
        this.openLeadConversionReviewModal(rowData);
      },
    },
  ];

  leadStatusUpdateFormData = {
    leadId: '',
    newStatus: '',
  };

  ngOnInit() {
    this.loadLeads();
  }

  

  setLeadLookupData() {
    this.getLeadStatuses();
    this.getLeadSources();
  }

  getLeadSources() {
    this.leadsService.getLeadSources().subscribe({
      next: (sources) => {
        this.leadSourcesOptions = sources.map(source => ({ label: source.sourceName, value: source.sourceId }));
        // update the filters with the fetched options
        this.filters = this.filters.map((filter) => {
          if (filter.field === 'leadSource') {
            return { ...filter, options: this.leadSourcesOptions };
          }
          return filter;
        });
        this.filterData = {
          filters: this.filters,
          config: {},
        };
        console.log('Lead Sources Options:', this.leadSourcesOptions);
      },
      error: (error) => {
        console.error('Error fetching lead sources:', error);
      },
    });
  }

  getLeadStatuses() {
    this.leadsService.getLeadsLookupData().subscribe({
      next: (response) => {
        this.leadStatusOptions = response.leadStatuses.map(status => ({ label: status.label, value: status.value }));
        // update the filters with the fetched options
        this.filters = this.filters.map((filter) => {
          if (filter.field === 'leadStatus') {
            return { ...filter, options: this.leadStatusOptions };
          }
          return filter;
        });
        this.filterData = {
          filters: this.filters,
          config: {},
        };
      },
      error: (error) => {
        console.error('Error fetching lead statuses:', error);
      },
    });
  }

  loadLeads() {
    this.loading = true;

    // TEMP: hardcoded sort
    const sort: any = {
      field: 'createdAt',
      order: 'desc',
    };
    this.leadsService
      .getLeads(this.searchQuery, this.apiReadyFilterData, sort, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          let data = response?.data || [];
          this.totalRecords = response?.total || data.length;

          // use the columns to map the data
          this.leads = data.map((lead: any) => {
            let mappedLead: any = {};
            this.columns.forEach((column) => {
              mappedLead[column.field] = lead[column.field];
            });
            return mappedLead;
          });
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
        },
      });
  }

  onPageChangeHandler(event: any) {
    this.currentPage = event;
    this.loadLeads();
  }

  onSearchChange(event: any) {
    this.searchQuery = event;
    this.currentPage = 1;
    this.loadLeads();
  }

  onFilterChange(event: Filters[]) {

    if (!event || event.length === 0) {
      this.apiReadyFilterData = [];
      this.currentPage = 1;
      this.loadLeads();
      return;
    }
    // remove items with empty value
    const _filters = event.filter((filter) => filter.value);
    // map it to the format required by the API
    const filters = _filters.map((filter) => {
      let _apiType = 'contains';
      if (filter.type === 'select') _apiType = 'equals';
      if (filter.type === 'date') _apiType = 'equals';
      if (filter.type === 'multiselect') _apiType = 'list';

      return {
        field: filter.field,
        value: filter.value,
        type: _apiType,
      };
    });
    this.apiReadyFilterData = filters;

    this.currentPage = 1;
    this.loadLeads();
  }

  onCreateLead() {
    this.router.navigate(['/leads/form']);
  }

  // start: lead status update modal methods
  openLeadStatusChangeDialog() {
    this.leadStatusChangeModal.open();
  }
  closeLeadStatusChangeDialog() {
    this.leadStatusChangeModal.close();
  }
  handleLeadStatusUpdate() {
    this.leadsService
      .updateLeadStatus(
        this.leadStatusUpdateFormData.leadId,
        this.leadStatusUpdateFormData.newStatus
      )
      .subscribe({
        next: (response) => {
          console.log('Lead status updated successfully:', response);
          this.leadStatusChangeModal.close();
          this.loadLeads(); // refresh the leads list
        },
        error: (error) => {
          console.error('Error updating lead status:', error);
        },
      });
  }
  // end: lead status update modal methods

  // start: lead interaction methods
  selectedLeadIdForInteraction: string = '';

  onInteractionSubmit(interactionData: any) {
    this.leadsService.createLeadInteraction(this.selectedLeadIdForInteraction, interactionData).subscribe({
      next: (response) => {
        if(response.interactionId) {
          this.toastService.success('Lead interaction created successfully.');
          this.leadInteractionModal.close();
          return;
        }
        this.toastService.error('Failed to create lead interaction. Please try again later.');
      },
      error: (error) => {
        console.error('Error creating lead interaction:', error);
        this.toastService.error('Failed to create lead interaction. Please try again later.');        
      },
    });
  }

  openLeadInteractionForm(leadId: string) {
    this.selectedLeadIdForInteraction = leadId;
    this.leadInteractionModal.open();
  }
  closeLeadInteractionForm() {
    this.leadInteractionModal.close();
  }
  // end: lead interaction methods

  // start: lead conversion review methods
  selectedLeadForConversion: Lead | null = null;

  openLeadConversionReviewModal(lead: Lead) {
    this.selectedLeadForConversion = lead;
    this.leadConversionReviewModal.open();
  }
  
  closeLeadConversionReviewModal() {
    this.leadConversionReviewModal.close();
  }
  // end: lead conversion review methods
}

import { CustomDatatable } from '@/shared/components/custom-datatable/custom-datatable';
import { PageHeading } from '@/shared/components/page-heading/page-heading';
import { DataMappingUtils } from '@/shared/utils/data-mapping';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core';
import {
  CellTemplate,
  DataTableColumn,
} from '../../../../shared/components/custom-datatable/types';
import { ModalMedium } from '../../../../shared/components/modal-medium/modal-medium';
import { ModalSmall } from '../../../../shared/components/modal-small/modal-small';
import { LeadsInteractionMasterService } from '../../../admin/leads-master/services/lead-interaction-master.service';
import { LeadInteractionTypeTypes } from '../../../admin/leads-master/types';
import { LeadConversionReview } from "../../components/lead-conversion-review/lead-conversion-review";
import { LeadInteractionForm } from "../../components/lead-interaction-form/lead-interaction-form";
import { LeadStatusChangeBox } from "../../components/lead-status-change-box/lead-status-change-box";
import { LeadsService } from '../../leads.service';
import { Lead, LeadStatus, UpdateLeadPayload } from '../../types';
import { LEAD_STATUS_COLOR_MAPPING } from '../../utils';

@Component({
  selector: 'app-lead-listing',
  imports: [PageHeading, CustomDatatable, ModalSmall, ModalMedium, FormsModule, LeadInteractionForm, LeadConversionReview, LeadStatusChangeBox],
  templateUrl: './lead-listing.html',
  styleUrl: './lead-listing.css',
})
export class LeadListing {
  @ViewChild('leadStatusChangeModal') leadStatusChangeModal!: ModalSmall;
  @ViewChild('leadInteractionModal') leadInteractionModal!: ModalSmall;
  @ViewChild('leadConversionReviewModal') leadConversionReviewModal!: ModalMedium;

  private leadsInteractionMasterService = inject(LeadsInteractionMasterService);

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
    { field: 'leadTopic', label: 'Lead Topic', cellTemplate: CellTemplate.LINK, hrefField: '/leads/detail/:leadId' },
    { field: 'leadOwner.FirstName', label: 'Name' },
    // { field: 'email', label: 'Email' },
    { field: 'phone', label: 'Phone' },
    {
      field: 'leadStatus',
      label: 'Lead Status',
      cellTemplate: CellTemplate.COLOR_BADGE,
      colorBadgeMapper: LEAD_STATUS_COLOR_MAPPING,
    },
    { field: 'createdAt', label: 'Created Time', cellTemplate: CellTemplate.DATETIME },
  ];
  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  searchQuery: string = '';
  eagerFetch: boolean = true;
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

  selectedLeadForAction: Lead | null = null;
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
        this.selectedLeadForAction = rowData;
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

  leadInteractionTypes: LeadInteractionTypeTypes.LeadInteractionType[] = [];

  ngOnInit() {
    this.loadLeadInteractionTypes();
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
      .getLeads(this.searchQuery, this.apiReadyFilterData, sort, this.currentPage, this.pageSize, this.eagerFetch)
      .subscribe({
        next: (response) => {
          let data = response?.data || [];
          this.totalRecords = response?.total || data.length;

          // use the columns to map the data
          this.leads = DataMappingUtils.mapDataToColumns<Lead>(data, this.columns);
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
        },
      });
  }

  loadLeadInteractionTypes() {
    this.leadsInteractionMasterService.getLeadInteractionTypes().subscribe((types) => {
      this.leadInteractionTypes = types;
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
    this.selectedLeadForAction = null;
  }
  handleLeadStatusUpdate(status: LeadStatus | null) {
    if(!this.selectedLeadForAction) {
      this.toastService.error('No lead selected for status update.');
      return;
    }
    if (!status) {
      this.toastService.error('Please select a valid status.');
      return;
    }

    this.leadsService
      .updateLeadStatus(
        this.selectedLeadForAction.leadId,
        status
      )
      .subscribe({
        next: (response) => {
          if(response && response.leadId){
            this.closeLeadStatusChangeDialog();
            this.loadLeads(); // refresh the leads list
            return;
          }
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
        if (response.interactionId) {
          this.toastService.success('Lead interaction created successfully.');
          this.leadInteractionModal.close();
          return;
        }
        this.toastService.error('Failed to create lead interaction. Please try again later.');
      },
      error: (error) => {
        console.error('Error creating lead interaction:', error);
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

  onLeadConversionSubmit(conversionData: any) {
    if (!this.selectedLeadForConversion) {
      this.toastService.error('No lead selected for conversion.');
      return;
    }

    if (!this.selectedLeadForConversion.leadId) {
      this.toastService.error('Invalid lead selected for conversion. Sorry for the inconvenience.');
      return;
    }

    const updatePayload: UpdateLeadPayload = {
      leadId: this.selectedLeadForConversion.leadId,
    };

    if (conversionData.useExistingAccount) updatePayload.companyName = conversionData.accountName;
    else updatePayload.companyName = conversionData.companyName;
    
    if (conversionData.useExistingContact) updatePayload.firstName = conversionData.contactName;
    else updatePayload.firstName = conversionData.leadName;

    this.leadsService.updateLead(updatePayload).subscribe({
      next: (response) => {
        console.log('Lead update before conversion response:', response);
        if(!response || !response.leadId) {
          console.error('Lead update failed or invalid response:', response);
          return;
        }
        // after successful update, call the convert service
        if (!this.selectedLeadForConversion) {
          this.toastService.error('No lead selected for conversion.');
          return;
        }
        this.leadsService.convertLeadToCustomer(this.selectedLeadForConversion.leadId, true).subscribe({
          next: (response) => {
            console.log('Lead convert response:', response);
            const isMergeConfirmationRequired = response?.isMergeConfirmedRequired;
            if (isMergeConfirmationRequired) {
              this.toastService.error('Lead conversion requires merge confirmation. Please try again.');
              return;
            }
            if(response?.converted) {
              this.toastService.success('Lead converted to customer successfully.');
            }
            else {
              this.toastService.error('Lead conversion failed. Please try again later.');
              return;
            }
            this.leadConversionReviewModal.close();
            this.loadLeads();
          },
          error: (error) => {
            console.error('Error converting lead:', error);
            this.toastService.error('Failed to convert lead. Please try again later.');
          },
        });
      },
      error: (error) => {
        console.error('Error updating lead:', error);
        this.toastService.error('Failed to update lead. Please try again later.');
      },
    });
  }
  // end: lead conversion review methods
}

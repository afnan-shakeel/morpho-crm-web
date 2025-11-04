import { CustomDatatable } from '@/shared/components/custom-datatable/custom-datatable';
import { ModalMedium } from '@/shared/components/modal-medium/modal-medium';
import { PageHeading } from '@/shared/components/page-heading/page-heading';
import { DataMappingUtils } from '@/shared/utils/data-mapping';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { ToastService } from '../../../../core';
import {
  CellTemplate,
  DataTableColumn,
} from '../../../../shared/components/custom-datatable/types';
import { OpportunityForm } from '../../components/opportunity-form/opportunity-form';
import { OpportunityService } from '../../opportunity.service';
import {
  CreateOpportunityPayload,
  Opportunity,
  OpportunityStage,
  UpdateOpportunityPayload,
} from '../../types';

@Component({
  selector: 'app-opportunity-listing',
  imports: [PageHeading, CustomDatatable, ModalMedium, OpportunityForm],
  templateUrl: './opportunity-listing.html',
  styleUrl: './opportunity-listing.css',
})
export class OpportunityListing {
  @ViewChild('opportunityForm') opportunityForm!: ModalMedium;

  private toastService = inject(ToastService);
  private opportunitiesService = inject(OpportunityService);

  pageBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Opportunities', path: '/opportunities/list' },
  ];

  opportunities: Opportunity[] = [];
  columns: DataTableColumn[] = [
    { field: 'opportunityId', label: 'Opportunity ID', hidden: true },
    {
      field: 'opportunityName',
      label: 'Opportunity Name',
      cellTemplate: CellTemplate.LINK,
      hrefField: '/opportunities/:opportunityId/view',
    },
    { field: 'opportunityStage.name', label: 'Opportunity Stage' },
    { field: 'contact.fullName', label: 'Contact Name' },
    { field: 'createdAt', label: 'Created Time', cellTemplate: CellTemplate.DATETIME },
  ];

  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  searchQuery: string = '';
  eagerFetch: boolean = true;
  opportunitystagOptions: Array<{ label: string; value: string }> = [];
  filters: Filters[] = [
    {
      field: 'stageId',
      label: 'Opportunity Stage',
      value: null,
      type: 'select',
      options: this.opportunitystagOptions,
    },
    { field: 'createdAt', label: 'Created At', value: null, type: 'date' },
  ];
  filterData: FilterData = {
    filters: this.filters,
    config: {},
  };
  apiReadyFilterData: any[] = [];
  opportunitystages: OpportunityStage[] = [];

  selectedOpportunityIdToUpdate = signal<string | null>(null);
  tableRowActions = [
    {
      label: 'View',
      actionCallback: (rowData: Opportunity) => {},
    },
    {
      label: 'Edit',
      actionCallback: (rowData: Opportunity) => {
        this.selectedOpportunityIdToUpdate.set(rowData.opportunityId);
        this.openOpportunityFormModal();
      },
    },
  ];

  ngOnInit() {
    this.loadOpportunityStages();
    this.loadOpportunities();
  }

  loadOpportunityStages() {
    this.opportunitiesService.getOpportunityStages().subscribe((stages) => {
      this.opportunitystages = stages;
      this.opportunitystagOptions = stages.map((stage) => ({
        label: stage.name,
        value: stage.stageId,
      }));
      this.filters = this.filters.map((filter) => {
        if (filter.field === 'stageId') {
          return { ...filter, options: this.opportunitystagOptions };
        }
        return filter;
      });
      this.filterData = {
        filters: this.filters,
        config: {},
      };
    });
  }
  loadOpportunities() {
    this.loading = true;
    const sort = {
      field: 'createdAt',
      order: 'desc',
    };
    this.opportunitiesService
      .getOpportunities(
        this.searchQuery,
        this.apiReadyFilterData,
        sort,
        this.currentPage,
        this.pageSize,
        this.eagerFetch
      )
      .subscribe({
        next: (response) => {
          let data = response.data || [];
          // use the columns to map the data correctly
          this.opportunities = DataMappingUtils.mapDataToColumns<Opportunity>(data, this.columns);
          this.totalRecords = response.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching contacts:', error);
          this.loading = false;
        },
      });
  }

  onPageChangeHandler(event: any) {
    this.currentPage = event;
    this.loadOpportunities();
  }

  onSearchChange(event: any) {
    this.searchQuery = event;
    this.currentPage = 1;
    this.loadOpportunities();
  }

  onFilterChange(event: Filters[]) {
    if (!event || event.length === 0) {
      this.apiReadyFilterData = [];
      this.currentPage = 1;
      this.loadOpportunities();
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
    this.loadOpportunities();
  }

  // start: contact form modal
  resetFormEvent = signal<boolean>(false);
  openOpportunityFormModal() {
    this.resetFormEvent.set(false);
    this.opportunityForm.open();
  }
  closeOpportunityFormModal() {
    this.opportunityForm.close();
    this.resetFormEvent.set(true);
    this.selectedOpportunityIdToUpdate.set(null);
  }
  onOpportunityFormSubmit(formData: any) {
    console.log('Opportunity form submitted with data:', formData);
    if (!formData) {
      this.closeOpportunityFormModal();
      return;
    }
    // call the create/update service
    if (formData.opportunityId) {
      this.updateOpportunity(formData.opportunityId, formData);
    } else {
      this.createOpportunity(formData);
    }
  }
  // end: contacts form modal

  createOpportunity(formData: CreateOpportunityPayload) {
    this.opportunitiesService
      .createOpportunity({
        accountId: formData.accountId,
        contactId: formData.contactId,
        opportunityName: formData.opportunityName,
        opportunityOwnerId: formData.opportunityOwnerId,
        stageId: formData.stageId,
        status: formData.status,
        closedDate: formData.closedDate ? new Date(formData.closedDate).toISOString() : null,
        expectedCloseDate: formData.expectedCloseDate
          ? new Date(formData.expectedCloseDate).toISOString()
          : null,
        notes: formData.notes,
      })
      .subscribe({
        next: (response) => {
          if (response.opportunityId) {
            this.closeOpportunityFormModal();
            this.toastService.success('Opportunity created successfully!');
            this.resetFormEvent.set(true);
            this.loadOpportunities();
          } else {
            this.toastService.error('Failed to create opportunity. Please try again.');
          }
        },
        error: (error) => {
          console.error('Error creating opportunity:', error);
        },
      });
  }
  updateOpportunity(opportunityId: string, formData: UpdateOpportunityPayload) {
    this.opportunitiesService
      .updateOpportunity(opportunityId, {
        accountId: formData.accountId,
        contactId: formData.contactId,
        opportunityName: formData.opportunityName,
        opportunityOwnerId: formData.opportunityOwnerId,
        stageId: formData.stageId,
        status: formData.status,
        closedDate: formData.closedDate ? new Date(formData.closedDate).toISOString() : null,
        expectedCloseDate: formData.expectedCloseDate
          ? new Date(formData.expectedCloseDate).toISOString()
          : null,
        notes: formData.notes,
      })
      .subscribe({
        next: (response) => {
          if (response.opportunityId) {
            this.closeOpportunityFormModal();
            this.toastService.success('Opportunity updated successfully!');
            this.resetFormEvent.set(true);
            this.loadOpportunities();
            return;
          } else {
            this.toastService.error('Failed to update opportunity. Please try again.');
          }
        },
        error: (error) => {
          console.error('Error updating opportunity:', error);
        },
      });
  }
}

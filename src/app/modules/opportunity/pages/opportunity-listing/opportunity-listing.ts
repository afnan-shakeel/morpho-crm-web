import { CustomDatatable } from "@/shared/components/custom-datatable/custom-datatable";
import { PageHeading } from "@/shared/components/page-heading/page-heading";
import { DataMappingUtils } from "@/shared/utils/data-mapping";
import { Component, inject } from '@angular/core';
import { CellTemplate, DataTableColumn } from '../../../../shared/components/custom-datatable/types';
import { OpportunityService } from '../../opportunity.service';
import { Opportunity } from '../../types';

@Component({
  selector: 'app-opportunity-listing',
  imports: [PageHeading, CustomDatatable],
  templateUrl: './opportunity-listing.html',
  styleUrl: './opportunity-listing.css'
})
export class OpportunityListing {
  private opportunitiesService = inject(OpportunityService);

  pageBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Opportunities', path: '/opportunities/list' },
  ];

  opportunities: Opportunity[] = [];
  columns: DataTableColumn[] = [
    { field: 'opportunityId', label: 'Opportunity ID', hidden: true },
    { field: 'opportunityName', label: 'Opportunity Name', cellTemplate: CellTemplate.LINK, hrefField: '/opportunities/:opportunityId/view' },
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
  filters: Filters[] = [
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
      actionCallback: (rowData: Opportunity) => {
      },
    },
    {
      label: 'Edit',
      actionCallback: (rowData: Opportunity) => {
      },
    },
  ];

  ngOnInit() {
    this.loadOpportunities();
  }



  loadOpportunities() {
    this.loading = true;
    const sort = {
      'field': 'createdAt',
      'order': 'desc'
    };
    this.opportunitiesService.getOpportunities(this.searchQuery, this.apiReadyFilterData, sort, this.currentPage, this.pageSize, this.eagerFetch).subscribe({
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
      }
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

}

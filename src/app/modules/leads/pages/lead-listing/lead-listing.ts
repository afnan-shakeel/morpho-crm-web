import { CustomDatatable } from "@/shared/components/custom-datatable/custom-datatable";
import { PageHeading } from "@/shared/components/page-heading/page-heading";
import { Component, inject } from '@angular/core';
import { Router } from "@angular/router";
import { LeadsService } from "../../../../core";
import { DataTableColumn } from "../../../../shared/components/custom-datatable/types";

@Component({
  selector: 'app-lead-listing',
  imports: [PageHeading, CustomDatatable],
  templateUrl: './lead-listing.html',
  styleUrl: './lead-listing.css'
})
export class LeadListing {
  constructor() {
    this.setLeadLookupData();
  }

  private router = inject(Router)
  private leadsService = inject(LeadsService)
  pageBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Leads', path: '/leads' },
  ];

  leads: any[] = [];
  columns: DataTableColumn[] = [
    { field: 'firstName', label: 'Name' },
    { field: 'email', label: 'Email' },
    { field: 'phone', label: 'Phone' },
  ];
  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  searchQuery: string = '';
  leadSourcesOptions: Array<{ label: string; value: string }> = [];
  leadStatusOptions: Array<{ label: string; value: string }> = [];
  filters: Filters[] =[
    {
      field: 'leadStatus', label: 'Lead Status', value: '',
      type: 'select', options: this.leadStatusOptions
    },
    {
      field: 'leadSource', label: 'Lead Source', value: '',
      type: 'select', options: this.leadSourcesOptions
    },
    { field: 'ConvertedAt', label: 'Converted At', value: null, type: 'date' },
    { field: 'createdAt', label: 'Created At', value: null, type: 'date' },
  ];
  filterData: FilterData = {
    filters: this.filters,
    config: {}
  };
  apiReadyFilterData: any[] = [];


  tableRowActions = [
    {
      label: 'View',
      actionCallback: (rowData: any) => {
        console.log("View Details clicked for:", rowData);
      }
    },
    {
      label: 'Edit',
      actionCallback: (rowData: any) => {
        console.log("Edit clicked for:", rowData);
        // navigate to the lead edit page
        this.router.navigate(['/leads/form'], { queryParams: { leadId: rowData.id } });
      }
    },
    {
      label: 'Convert to Customer',
      actionCallback: (rowData: any) => {
        console.log("Convert to Customer clicked for:", rowData);
      }
    }
  ];


  ngOnInit() {
    this.loadLeads();
  }

  setLeadLookupData() {
    this.leadsService.getLeadsLookupData().subscribe({
      next: (response) => {
        if (response) {
          this.leadSourcesOptions = response.data?.leadSources || [];
          this.leadStatusOptions = response.data?.leadStatuses || [];
          console.log("Fetched lead lookup data:", this.leadStatusOptions);
          // update the filters with the fetched options
          this.filters = this.filters.map(filter => {
            if (filter.field === 'leadSource') {
              return { ...filter, options: this.leadSourcesOptions };
            }
            if (filter.field === 'leadStatus') {
              return { ...filter, options: this.leadStatusOptions };
            }
            return filter;
          });
        }
        this.filterData = {
          filters: this.filters,
          config: {}
        };
        console.log("Lead filter options set:", this.filters);
      },

      error: (error) => {
        console.error("Error fetching lead lookup data:", error);
      }
    });
  }

  loadLeads() {
    this.loading = true;

    // TEMP: hardcoded sort
    const sort: any = {
      "field": "createdAt",
      "order": "desc"
    }
    this.leadsService.getLeads(
      this.searchQuery,
      this.apiReadyFilterData,
      sort,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response) => {

        let data = response.data?.data || []
        this.totalRecords = response.data?.total || data.length;

        // use the columns to map the data
        this.leads = data.map((lead: any) => {
          let mappedLead: any = {}
          this.columns.forEach(column => {
            mappedLead[column.field] = lead[column.field]
          })
          return mappedLead
        })
        this.loading = false;
      },
      error: (error) => {
        this.loading = false
      }
    })
  }

  onPageChangeHandler(event: any) {
    console.log("Page change event:", event);
    this.currentPage = event;
    this.loadLeads();
  }

  onSearchChange(event: any) {
    console.log("Search change event:", event);
    this.searchQuery = event;
    this.currentPage = 1;
    this.loadLeads();
  }

  onFilterChange(event: Filters[]) {
    console.log("Filter change event:", event);

    if(!event || event.length === 0) {
      this.apiReadyFilterData = [];
      this.currentPage = 1;
      this.loadLeads();
      return;
    }
    // remove items with empty value
    const _filters = event.filter(filter => filter.value);
    // map it to the format required by the API
    const filters = _filters.map(filter => {
      let _apiType = 'contains';
      if (filter.type === 'select') _apiType = 'equals';
      if (filter.type === 'date') _apiType = 'equals';
      if (filter.type === 'multiselect') _apiType = 'list';

      return {
        field: filter.field,
        value: filter.value,
        type: _apiType
      };
    });
    this.apiReadyFilterData = filters;

    this.currentPage = 1;
    this.loadLeads();
  }
}

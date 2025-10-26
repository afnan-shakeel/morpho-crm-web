import { CustomDatatable } from "@/shared/components/custom-datatable/custom-datatable";
import { PageHeading } from "@/shared/components/page-heading/page-heading";
import { Component, inject } from '@angular/core';
import { LeadsService } from "../../../../core";
import { DataTableColumn } from "../../../../shared/components/custom-datatable/types";

@Component({
  selector: 'app-lead-listing',
  imports: [PageHeading, CustomDatatable],
  templateUrl: './lead-listing.html',
  styleUrl: './lead-listing.css'
})
export class LeadListing {

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
  searchQuery: any = [];
  
  ngOnInit() {
    this.loadLeads();
  }

  loadLeads() {
    this.loading = true;

    const filters: any = []
    const sort: any = {
        "field": "createdAt",
        "order": "desc"
    }
     this.leadsService.getLeads(
      this.searchQuery,
      filters,
      sort,
      this.currentPage,
      this.pageSize
     ).subscribe({
      next :(response)=>{

        let data = response.data?.data || []
        // Capture total records from response
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

        console.log("Leads loaded:", this.leads.length);
      },
      error: (error)=>{
        this.loading = false
      }
     })
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.loadLeads();
  }

  onPageChangeHandler(event: any) {
    console.log("Page change event:", event);
    this.currentPage = event;
    this.loadLeads();
  }
}

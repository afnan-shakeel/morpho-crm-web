import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ɵInternalFormsSharedModule } from "@angular/forms";
import { FilterBox } from "../filter-box/filter-box";
import { TablePagination } from "../table-pagination/table-pagination";
import { DataTableColumn } from './types';

interface RowAction {
  label: string;
  actionCallback: (rowData: any) => void;
}


@Component({
  selector: 'app-custom-datatable',
  imports: [TablePagination, ɵInternalFormsSharedModule, FormsModule, FilterBox],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './custom-datatable.html',
  styleUrl: './custom-datatable.css'
})
export class CustomDatatable {

  @Input() records: any[] = [];
  @Input() columns: DataTableColumn[] = [];
  @Input() loading: boolean = false;

  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Input() totalRecords: number = 0;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() searchQuery: string = '';
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  @Input() filterData: FilterData | null = null;
  @Output() filterChange: EventEmitter<Filters[]> = new EventEmitter<Filters[]>();
  
  @Input() rowActions: RowAction[] = [];
  @Output() rowActionTriggered: EventEmitter<{ action: RowAction; rowData: any }> = new EventEmitter();

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.pageChange.emit(this.currentPage);
  }

  onSearchChange(newSearchQuery: string) {
    this.searchQuery = newSearchQuery;
    if (newSearchQuery && newSearchQuery.length >= 3) {
      this.search.emit(newSearchQuery);
    }
    // emit empty string if cleared
    if (!newSearchQuery) {
      this.search.emit('');
    }
  }

  onFilterChange(newFilters: Filters[]) {
    this.filterChange.emit(newFilters);

    // close the filter box after applying filters (desktop view)
    const filterBoxElement = document.getElementById('desktop-datatable-filter');
    if (filterBoxElement) {
      filterBoxElement.hidePopover();
    }
  }
}

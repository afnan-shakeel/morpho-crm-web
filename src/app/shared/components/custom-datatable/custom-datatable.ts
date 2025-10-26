import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TablePagination } from "../table-pagination/table-pagination";
import { DataTableColumn } from './types';

@Component({
  selector: 'app-custom-datatable',
  imports: [TablePagination],
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


  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.pageChange.emit(this.currentPage);
  }
}

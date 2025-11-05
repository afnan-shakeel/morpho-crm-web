import { TablePagination } from "@/shared/components/table-pagination/table-pagination";
import { Component } from '@angular/core';

@Component({
  selector: 'app-lead-table',
  imports: [TablePagination],
  templateUrl: './lead-table.html',
  styleUrl: './lead-table.css'
})
export class LeadTable {

  columns: string[] = ['name', 'email', 'phone', 'status', 'actions'];

}

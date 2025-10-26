import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

interface PageItem {
  number: number;
  isEllipsis: boolean;
  isActive: boolean;
}

@Component({
  selector: 'app-table-pagination',
  imports: [CommonModule],
  templateUrl: './table-pagination.html',
  styleUrl: './table-pagination.css'
})
export class TablePagination implements OnInit, OnChanges {

  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Input() totalRecords: number = 0;
  @Input() siblingCount: number = 1; // Number of pages to show on each side of current page

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  totalPages: number = 0;
  pages: PageItem[] = [];
  readonly MAX_PAGES_SHOWN = 7; // including ellipsis
  Math = Math; // Expose Math object for template

  ngOnInit() {
    this.calculatePages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageSize'] || changes['currentPage'] || changes['totalRecords']) {
      this.calculatePages();
    }
  }

  calculatePages() {
    this.totalPages = this.totalRecords > 0 ? Math.ceil(this.totalRecords / this.pageSize) : 0;
    this.pages = this.generatePageNumbers();
  }

  private generatePageNumbers(): PageItem[] {
    if (this.totalPages <= 1) {
      return [];
    }

    const pages: PageItem[] = [];
    const leftSiblingIndex = Math.max(this.currentPage - this.siblingCount, 1);
    const rightSiblingIndex = Math.min(this.currentPage + this.siblingCount, this.totalPages);

    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < this.totalPages - 1;

    // Always show first page
    pages.push({
      number: 1,
      isEllipsis: false,
      isActive: this.currentPage === 1
    });

    // Add left ellipsis
    if (shouldShowLeftEllipsis) {
      pages.push({
        number: 0,
        isEllipsis: true,
        isActive: false
      });
    }

    // Add left sibling pages
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i > 1 && i < this.totalPages) {
        pages.push({
          number: i,
          isEllipsis: false,
          isActive: this.currentPage === i
        });
      }
    }

    // Add right ellipsis
    if (shouldShowRightEllipsis) {
      pages.push({
        number: 0,
        isEllipsis: true,
        isActive: false
      });
    }

    // Always show last page
    if (this.totalPages > 1) {
      pages.push({
        number: this.totalPages,
        isEllipsis: false,
        isActive: this.currentPage === this.totalPages
      });
    }

    return pages;
  }

  onPageChange(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages && newPage !== this.currentPage) {
      this.pageChange.emit(newPage);
    }
  }

  onPageSizeChange(newPageSize: number) {
    this.pageSize = newPageSize;
    this.pageChange.emit(1); // Reset to first page on page size change
  }

  onPrevious() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  onNext() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  isDisabledPrevious(): boolean {
    return this.currentPage === 1;
  }

  isDisabledNext(): boolean {
    return this.currentPage === this.totalPages || this.totalPages === 0;
  }

}

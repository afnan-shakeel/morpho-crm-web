# Custom Datatable with No Data Placeholder - Usage Example

## Basic Usage

```html
<app-custom-datatable
  [records]="leads"
  [columns]="columns"
  [loading]="isLoading"
  [totalRecords]="totalLeads"
  [currentPage]="currentPage"
  [pageSize]="pageSize"
  [searchQuery]="searchQuery"
  [filterData]="filterData"
  [rowActions]="rowActions"
  [tableConfig]="tableConfig"
  
  <!-- Empty State Configuration -->
  [emptyStateTitle]="'No leads found'"
  [emptyStateMessage]="'Start by adding your first lead to get organized.'"
  [showAddButton]="true"
  [addButtonLabel]="'Add New Lead'"
  
  (pageChange)="onPageChange($event)"
  (search)="onSearch($event)"
  (filterChange)="onFilterChange($event)"
  (addButtonClick)="navigateToCreateLead()">
</app-custom-datatable>
```

## Component Example

```typescript
export class LeadsListingComponent {
  leads: Lead[] = [];
  isLoading = false;
  totalLeads = 0;
  currentPage = 1;
  pageSize = 10;
  searchQuery = '';

  // Handle add button click
  navigateToCreateLead() {
    this.router.navigate(['/leads/create']);
  }

  // Other methods...
}
```

## Features Added

### 1. **No Data Placeholder**
- Shows when `records.length === 0 && !loading`
- Displays custom title and message
- Different message for search results vs empty state

### 2. **Loading State**
- Shows spinner when `loading = true`
- Displays "Loading data..." message

### 3. **Configurable Empty State**
- `emptyStateTitle`: Custom title for empty state
- `emptyStateMessage`: Custom message for empty state
- `showAddButton`: Whether to show the "Add" button
- `addButtonLabel`: Custom label for the add button

### 4. **Search-Aware Messages**
- Shows different message when search query exists
- "No results match your search query" vs "Get started by adding..."

### 5. **Conditional Pagination**
- Pagination only shows when `totalRecords > 0`

## Visual States

1. **Loading**: Spinner + "Loading data..."
2. **No Data (Empty)**: Icon + Title + Message + Optional Add Button
3. **No Search Results**: Icon + Title + Search-specific message
4. **Data Present**: Normal table with data and pagination

## Styling

The placeholder uses Tailwind CSS classes and follows the same design system:
- Gray color scheme for empty states
- Primary color for action buttons
- Responsive design
- Dark mode support
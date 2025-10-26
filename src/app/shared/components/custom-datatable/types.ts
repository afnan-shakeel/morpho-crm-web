export interface DataTableColumn {
    field: string;
    label: string;
    sortable?: boolean;
    width?: string;
    cellTemplate?: string; // Optional custom cell template identifier. eg: 'link', 'badge', etc.
}
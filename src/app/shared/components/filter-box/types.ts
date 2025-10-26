interface Filters {
    field: string;
    label: string;
    value: any | null;
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'multiselect' | 'date-range' | 'range';
    options?: { label: string; value: any }[];
    placeholder?: string;
    defaultValue?: any;
}

interface FilterData {
    filters: Filters[];
    config?: any;
}
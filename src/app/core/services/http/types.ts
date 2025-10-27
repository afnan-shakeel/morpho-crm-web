/**
 * Search search/filter payload
 */

export interface SearchApiPayload {
  globalSearch: {
    value: string;
  };
  filters: SearchFilter[];
  sort: SearchSort;
  pagination: SearchPagination;
}

/**
 * Search filter interface
 */
export interface SearchFilter {
  field: string;
  operator: FilterOperator;
  value: any;
}

/**
 * Filter operator enumeration
 */
export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  IN = 'in',
  NOT_IN = 'not_in',
  IS_NULL = 'is_null',
  IS_NOT_NULL = 'is_not_null'
}

/**
 * Search sort interface
 */
export interface SearchSort {
  field: string;
  direction: SortDirection;
}

/**
 * Sort direction enumeration
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

/**
 * Search pagination interface
 */
export interface SearchPagination {
  page: number;
  limit: number;
}


export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

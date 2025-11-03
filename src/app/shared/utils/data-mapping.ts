import { DataTableColumn } from '../components/custom-datatable/types';

/**
 * Utility functions for mapping and transforming data
 */
export class DataMappingUtils {
  
  /**
   * Helper function to get nested property value from object using dot notation
   * @param obj - The object to get the value from
   * @param path - The dot-separated path (e.g., 'user.profile.name')
   * @returns The value at the nested path or undefined
   */
  static getNestedValue(obj: any, path: string): any {
    if (!obj || !path) return undefined;
    
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Maps raw data array to column-based structure for datatable display
   * @param data - Array of raw data objects from API
   * @param columns - Array of DataTableColumn configurations
   * @returns Array of mapped objects with only the fields defined in columns
   */
  static mapDataToColumns<T = any>(data: any[], columns: DataTableColumn[]): T[] {
    if (!data || !Array.isArray(data)) return [];
    if (!columns || !Array.isArray(columns)) return data;

    return data.map((item: any) => {
      const mappedItem: any = {};
      
      columns.forEach((column) => {
        // Handle nested properties using dot notation
        if (column.field.includes('.')) {
          mappedItem[column.field] = this.getNestedValue(item, column.field);
        } else {
          mappedItem[column.field] = item[column.field];
        }
      });
      
      return mappedItem as T;
    });
  }

  /**
   * Maps a single object to column-based structure
   * @param item - Single data object
   * @param columns - Array of DataTableColumn configurations
   * @returns Mapped object with only the fields defined in columns
   */
  static mapItemToColumns<T = any>(item: any, columns: DataTableColumn[]): T {
    if (!item) return {} as T;
    if (!columns || !Array.isArray(columns)) return item;

    const mappedItem: any = {};
    
    columns.forEach((column) => {
      // Handle nested properties using dot notation
      if (column.field.includes('.')) {
        mappedItem[column.field] = this.getNestedValue(item, column.field);
      } else {
        mappedItem[column.field] = item[column.field];
      }
    });
    
    return mappedItem as T;
  }

  /**
   * Extracts all field paths from columns, including nested ones
   * @param columns - Array of DataTableColumn configurations
   * @returns Array of field paths
   */
  static getColumnFields(columns: DataTableColumn[]): string[] {
    if (!columns || !Array.isArray(columns)) return [];
    
    return columns
      .filter(column => !column.hidden) // Optionally exclude hidden columns
      .map(column => column.field);
  }

  /**
   * Checks if a field path represents a nested property
   * @param fieldPath - The field path to check
   * @returns True if the field is nested (contains dots)
   */
  static isNestedField(fieldPath: string): boolean {
    return Boolean(fieldPath && fieldPath.includes('.'));
  }

  /**
   * Safely sets a nested property value in an object
   * @param obj - The object to set the value in
   * @param path - The dot-separated path
   * @param value - The value to set
   */
  static setNestedValue(obj: any, path: string, value: any): void {
    if (!obj || !path) return;
    
    const keys = path.split('.');
    const lastKey = keys.pop();
    
    if (!lastKey) return;
    
    // Navigate to the parent object
    const parent = keys.reduce((current, key) => {
      if (!current[key]) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    
    // Set the final value
    parent[lastKey] = value;
  }
}
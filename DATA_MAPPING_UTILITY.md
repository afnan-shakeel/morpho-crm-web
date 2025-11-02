# Data Mapping Utility Documentation

## Overview

The `DataMappingUtils` class provides utility functions for mapping API response data to datatable column structures, with support for nested object properties using dot notation.

## Location

```typescript
import { DataMappingUtils } from '@/shared/utils/data-mapping';
```

## Key Features

- ✅ **Nested Property Support**: Handles dot notation paths like `user.profile.name`
- ✅ **Type Safety**: Generic type support for better TypeScript integration  
- ✅ **Null Safety**: Graceful handling of undefined/null values
- ✅ **Performance Optimized**: Efficient property access and mapping
- ✅ **Reusable**: Single utility for all listing components

## Methods

### `mapDataToColumns<T>(data: any[], columns: DataTableColumn[]): T[]`

Maps an array of raw API data to column-based structure for datatables.

**Parameters:**
- `data`: Array of raw objects from API response
- `columns`: Array of DataTableColumn configurations

**Returns:** Array of mapped objects with only the fields defined in columns

**Example:**
```typescript
// API Response
const apiData = [
  {
    id: 1,
    name: "John Doe",
    account: { companyName: "Acme Corp" },
    createdAt: "2025-11-02T10:00:00Z"
  }
];

// Column Configuration
const columns: DataTableColumn[] = [
  { field: 'id', label: 'ID' },
  { field: 'name', label: 'Name' },
  { field: 'account.companyName', label: 'Company' }, // Nested field
  { field: 'createdAt', label: 'Created' }
];

// Usage
const mappedData = DataMappingUtils.mapDataToColumns<Contact>(apiData, columns);
// Result: [{ id: 1, name: "John Doe", "account.companyName": "Acme Corp", createdAt: "2025-11-02T10:00:00Z" }]
```

### `mapItemToColumns<T>(item: any, columns: DataTableColumn[]): T`

Maps a single object to column-based structure.

**Example:**
```typescript
const singleItem = { id: 1, user: { profile: { name: "John" } } };
const columns = [{ field: 'user.profile.name', label: 'Name' }];

const mapped = DataMappingUtils.mapItemToColumns(singleItem, columns);
// Result: { "user.profile.name": "John" }
```

### `getNestedValue(obj: any, path: string): any`

Safely retrieves nested property values using dot notation.

**Example:**
```typescript
const obj = { user: { profile: { name: "John", age: 30 } } };

const name = DataMappingUtils.getNestedValue(obj, 'user.profile.name');
// Result: "John"

const invalid = DataMappingUtils.getNestedValue(obj, 'user.profile.email');
// Result: undefined (safe, no errors)
```

### `setNestedValue(obj: any, path: string, value: any): void`

Safely sets nested property values, creating intermediate objects as needed.

**Example:**
```typescript
const obj = {};
DataMappingUtils.setNestedValue(obj, 'user.profile.name', 'John');
// Result: obj = { user: { profile: { name: "John" } } }
```

### `isNestedField(fieldPath: string): boolean`

Checks if a field path represents a nested property.

**Example:**
```typescript
DataMappingUtils.isNestedField('name'); // false
DataMappingUtils.isNestedField('user.name'); // true
DataMappingUtils.isNestedField('user.profile.contact.email'); // true
```

### `getColumnFields(columns: DataTableColumn[]): string[]`

Extracts all field paths from columns configuration.

**Example:**
```typescript
const columns = [
  { field: 'id', label: 'ID', hidden: true },
  { field: 'name', label: 'Name' },
  { field: 'user.email', label: 'Email' }
];

const fields = DataMappingUtils.getColumnFields(columns);
// Result: ['name', 'user.email'] (excludes hidden columns)
```

## Usage in Components

### Before (Old Pattern)
```typescript
// In each component - duplicated logic
private getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

loadData() {
  this.service.getData().subscribe(response => {
    this.items = response.data.map((item: any) => {
      let mapped: any = {};
      this.columns.forEach(column => {
        if (column.field.includes('.')) {
          mapped[column.field] = this.getNestedValue(item, column.field);
        } else {
          mapped[column.field] = item[column.field];
        }
      });
      return mapped;
    });
  });
}
```

### After (Using Utility)
```typescript
import { DataMappingUtils } from '@/shared/utils/data-mapping';

loadData() {
  this.service.getData().subscribe(response => {
    // Single line replacement!
    this.items = DataMappingUtils.mapDataToColumns<ItemType>(response.data, this.columns);
  });
}
```

## Migration Guide

To migrate existing components:

1. **Import the utility:**
   ```typescript
   import { DataMappingUtils } from '@/shared/utils/data-mapping';
   ```

2. **Remove old helper methods:**
   - Delete `getNestedValue()` methods
   - Remove manual mapping logic

3. **Replace mapping code:**
   ```typescript
   // Replace this pattern:
   this.items = data.map(item => {
     let mapped = {};
     this.columns.forEach(column => {
       // ... mapping logic
     });
     return mapped;
   });

   // With this:
   this.items = DataMappingUtils.mapDataToColumns<ItemType>(data, this.columns);
   ```

## Benefits

- **🚀 Performance**: Optimized nested property access
- **🔧 Maintainability**: Single source of truth for mapping logic
- **🛡️ Reliability**: Comprehensive error handling and null safety
- **📝 Consistency**: Uniform behavior across all listing components
- **🎯 Type Safety**: Full TypeScript support with generics
- **📦 Reusability**: Works with any component and column configuration

## Components Updated

- ✅ `opportunity-listing.ts`
- ✅ `contacts-listing.ts` 
- ✅ `lead-listing.ts`

## Future Enhancements

- Support for custom field transformers
- Caching for frequently accessed nested paths
- Performance monitoring and optimization
- Support for array indexing in paths (e.g., `items[0].name`)
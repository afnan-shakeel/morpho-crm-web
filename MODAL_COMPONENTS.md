# Modal Components Documentation

This document provides a comprehensive guide for understanding and using the modal components in the MORPHO CRM application. These components are built using Tailwind Plus Elements (`<el-dialog>`) for consistent styling and behavior.

## Available Modal Sizes

### 1. ModalSmall
- **Selector**: `app-modal-small`
- **Max Width**: `400px` (sm:max-w-[400px])
- **Use Case**: Confirmations, small forms, alerts

### 2. ModalMedium 
- **Selector**: `app-modal-medium`
- **Max Width**: `600px` (sm:max-w-[600px])
- **Use Case**: Forms, detailed content, intermediate data displays

### 3. ModalLarge (Future)
- **Selector**: `app-modal-large`
- **Max Width**: `800px+` (sm:max-w-[800px])
- **Use Case**: Complex forms, data tables, detailed views

## Core Features

### 🎛️ **Inputs**
- `modalId: string` - Unique identifier for the modal (default: 'dialog')
- `preventAutoClose: boolean` - Controls backdrop click behavior (default: false)

### 📤 **Outputs**  
- `closeModal: EventEmitter<void>` - Emitted when modal is closed

### 🔧 **Methods**
- `open()` - Programmatically opens the modal
- `close()` - Programmatically closes the modal

## Usage Examples

### Basic Usage
```html
<app-modal-small #myModal modalId="confirmation-modal">
  <h3>Are you sure?</h3>
  <p>This action cannot be undone.</p>
  <div class="flex gap-2 mt-4">
    <button (click)="confirm()" class="btn-primary">Yes</button>
    <button (click)="myModal.close()" class="btn-secondary">Cancel</button>
  </div>
</app-modal-small>
```

### With Auto-Close Prevention
```html
<app-modal-medium #formModal 
                  modalId="edit-form" 
                  [preventAutoClose]="true"
                  (closeModal)="onModalClosed()">
  <form [formGroup]="editForm">
    <!-- Form content -->
    <div class="flex gap-2 mt-4">
      <button type="submit" class="btn-primary">Save</button>
      <button type="button" (click)="formModal.close()" class="btn-secondary">Cancel</button>
    </div>
  </form>
</app-modal-medium>
```

### Component Integration
```typescript
@Component({...})
export class MyComponent {
  @ViewChild('myModal') modal!: ModalSmall;

  openModal() {
    this.modal.open();
  }

  onModalClosed() {
    console.log('Modal was closed');
    // Perform cleanup or navigation
  }
}
```

## Auto-Close Behavior

### Default Behavior (`preventAutoClose: false`)
- Modal closes when clicking outside (backdrop click)
- Modal closes when pressing ESC key
- Modal closes when clicking the X button

### Prevented Auto-Close (`preventAutoClose: true`)
- Backdrop clicks are **ignored**
- ESC key is **ignored** 
- Only explicit close actions work (X button, `modal.close()`)
- Useful for forms where accidental closure would lose data

## Technical Implementation

### Architecture
- Built on **Tailwind Plus Elements** (`<el-dialog>`, `<el-dialog-backdrop>`, `<el-dialog-panel>`)
- Uses Angular's **content projection** (`<ng-content>`) for flexible content
- Implements **command pattern** for modal control via DOM manipulation
- Supports **dark mode** with automatic theme switching

### Backdrop Control Logic
```typescript
// Conditional backdrop with different behaviors
@if (preventAutoClose) {
  <el-dialog-backdrop class="..." id="modal-backdrop">
} @else {
  <el-dialog-backdrop class="... transitions..." id="modal-backdrop-x">
}
```

### Modal Control Flow
1. `open()`: Creates temporary button → Sets command → Triggers modal
2. `close()`: Updates command → Triggers close → Cleans up → Emits event
3. Auto-cleanup on component destruction

## Styling & Responsive Design

### Breakpoint Behavior
- **Mobile**: Full-screen overlay with bottom sheet animation
- **Desktop (sm+)**: Centered modal with scale animations
- **Dark Mode**: Automatic adaptation with dark theme classes

### Animation States
- `data-enter`: Entering animation
- `data-leave`: Leaving animation  
- `data-closed`: Closed state
- Smooth transitions for backdrop, panel, and content

## Best Practices

### ✅ **Do**
- Use appropriate modal size for content complexity
- Set unique `modalId` for each modal instance
- Handle `closeModal` event for cleanup
- Use `preventAutoClose` for forms with user input
- Provide clear close/cancel actions

### ❌ **Don't**
- Nest modals within other modals
- Use modals for complex navigation flows
- Forget to unsubscribe from modal events
- Use small modals for large amounts of content

## Common Patterns

### Confirmation Dialog
```html
<app-modal-small #confirmModal modalId="delete-confirm">
  <div class="text-center">
    <svg class="mx-auto h-12 w-12 text-red-500">...</svg>
    <h3 class="text-lg font-medium">Delete Item</h3>
    <p class="text-sm text-gray-500">This action cannot be undone.</p>
    <div class="mt-4 flex gap-2 justify-center">
      <button (click)="deleteItem()" class="btn-danger">Delete</button>
      <button (click)="confirmModal.close()" class="btn-secondary">Cancel</button>
    </div>
  </div>
</app-modal-small>
```

### Form Modal
```html
<app-modal-medium #formModal 
                  modalId="user-form" 
                  [preventAutoClose]="hasUnsavedChanges">
  <h2 class="text-xl font-semibold mb-4">Edit User</h2>
  <form [formGroup]="userForm" (ngSubmit)="saveUser()">
    <!-- Form fields -->
    <div class="flex justify-end gap-2 mt-6">
      <button type="button" (click)="cancelEdit()" class="btn-secondary">Cancel</button>
      <button type="submit" [disabled]="!userForm.valid" class="btn-primary">Save Changes</button>
    </div>
  </form>
</app-modal-medium>
```

## Size Comparison

| Component | Max Width | Typical Use Cases |
|-----------|-----------|-------------------|
| **ModalSmall** | 400px | Confirmations, alerts, simple forms |
| **ModalMedium** | 600px | Standard forms, content views |
| **ModalLarge** | 800px+ | Complex forms, data tables, detailed views |

---

## AI Agent Quick Reference

**For AI Agents**: These modal components provide a consistent, accessible way to display overlay content. Key points:
- Use size based on content complexity
- Set `preventAutoClose="true"` for forms/important content  
- Always provide explicit close actions
- Handle `closeModal` event for cleanup
- Use `#templateRef` for programmatic control
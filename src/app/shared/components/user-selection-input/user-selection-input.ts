import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, forwardRef, HostListener, Input, Output, Signal, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-user-selection-input',
  imports: [CommonModule],
  templateUrl: './user-selection-input.html',
  styleUrl: './user-selection-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserSelectionInput),
      multi: true,
    },
  ],
})
export class UserSelectionInput {
  @Input() size: 'xs' | 'sm' | 'md' = 'md';

  // Inputs from parent
  @Input() options: any[] = [];
  @Input() placeholder = 'Select option';

  // Output event for input changes
  @Output() inputChange = new EventEmitter<string>();
  // Output event for option selection
  @Output() optionSelected = new EventEmitter<any>();

  // Constants for field names
  private readonly valueField = 'id';
  private readonly labelField = 'fullName';

  isOpen = signal(false);
  search = signal('');

  value: any = null; // internal model value

  // Method to update search and emit change event
  updateSearch(searchTerm: string) {
    this.search.set(searchTerm);
    this.inputChange.emit(searchTerm);
  }
  // Filtered list based on search term
  filteredOptions: Signal<any[]> = computed(() => {
    const term = this.search().toLowerCase();
    return this.options.filter(o =>
      String(o[this.labelField]).toLowerCase().includes(term)
    );
  });

  // ControlValueAccessor methods
  private onChange = (_: any) => {
  };
  private onTouched = () => { };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDropdown() {
    this.isOpen.update(v => !v);
  }

  selectOption(option: any) {
    this.value = option[this.valueField];
    this.onChange(this.value);
    this.onTouched();
    this.optionSelected.emit(option);
    this.isOpen.set(false);
  }

  get selectedLabel(): string {
    const selected = this.options.find(o => o[this.valueField] === this.value);
    return selected ? selected[this.labelField] : this.placeholder;
  }

  onChangeEvent(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.inputChange.emit(inputValue);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isOpen.set(false);
      // this.onTouched();
    }
  }


}

import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-custom-search-selection-input',
  imports: [],
  templateUrl: './custom-search-selection-input.html',
  styleUrl: './custom-search-selection-input.css'
})
export class CustomSearchSelectionInput {
  // Inputs from parent
  @Input() options: any[] = [];
  @Input() valueField = 'id';
  @Input() labelField = 'name';
  @Input() placeholder = 'Select option';

  isOpen = signal(false);
  search = signal('');

  value: any = null; // internal model value

  
}

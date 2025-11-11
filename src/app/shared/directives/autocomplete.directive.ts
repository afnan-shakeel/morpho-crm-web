import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appAutocomplete]',
  standalone: true
})
export class AutocompleteDirective implements OnInit, OnDestroy {
  @Input() targetForm!: any; // The form group
  @Input() nameControl!: string; // Name of the text control (e.g., 'accountOwnerName')
  @Input() idControl!: string; // Name of the ID control (e.g., 'accountOwnerId')
  @Input() optionValueAttribute: string = 'value'; // Attribute to match against
  @Input() optionIdAttribute: string = 'id'; // Attribute to get ID from

  // Custom event output
  @Output() optionSelected = new EventEmitter<{id: any, name: string, originalEvent: Event}>();

  private inputListener?: () => void;
  private clickListener?: (event: Event) => void;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.setupAutocomplete();
  }

  ngOnDestroy() {
    if (this.inputListener) {
      this.el.nativeElement.removeEventListener('input', this.inputListener);
    }
    if (this.clickListener) {
      this.el.nativeElement.removeEventListener('click', this.clickListener);
    }
  }

  private setupAutocomplete() {
    this.inputListener = () => {
      const element = this.el.nativeElement;
      const optionsContainer = element.querySelector('el-options');
      const optionElements = optionsContainer?.getElementsByTagName('el-option');
      
      if (optionElements) {
        // Filter elements based on user search
        for (let i = 0; i < optionElements.length; i++) {
          const option = optionElements[i];
          const selectedValue = this.targetForm.get(this.nameControl)?.value?.toLowerCase() || '';
          const optionValue = option.getAttribute(this.optionValueAttribute)?.toLowerCase() || '';
          
          if (optionValue.includes(selectedValue)) {
            const selectedId = option.getAttribute(this.optionIdAttribute);
            const formatedId = selectedId; // Keep as string since IDs are now UUIDs
            this.targetForm.patchValue({ [this.idControl]: formatedId });
            break;
          }
        }
      }

      // If the input is cleared, reset ID
      if (!this.targetForm.get(this.nameControl)?.value) {
        this.targetForm.patchValue({ [this.idControl]: 0 });
      }

      // Mark controls as touched for validation
      this.targetForm.get(this.nameControl)?.markAsTouched();
      this.targetForm.get(this.idControl)?.markAsTouched();
    };

    // Handle option selection
    this.clickListener = (event: Event) => {
        console.log('Click event detected in AutocompleteDirective');
      const target = event.target as HTMLElement;
      
      // Look for el-option element by traversing up the DOM tree
      let option: Element | null = target;
      while (option && option.tagName.toLowerCase() !== 'el-option') {
        option = option.parentElement;
      }
      
      console.log('Option found:', option);
      if (option) {
        console.log('Option selected in AutocompleteDirective');
        const selectedId = option.getAttribute(this.optionIdAttribute);
        const selectedValue = option.getAttribute(this.optionValueAttribute);
        
        if (selectedId && selectedValue) {
          console.log('Selected ID:', selectedId);
          console.log('Selected Value:', selectedValue);
          const formatedId = selectedId; // Keep as string since IDs are now UUIDs
          this.targetForm.patchValue({
            [this.nameControl]: selectedValue,
            [this.idControl]: formatedId
          });
          
          // Mark as touched and validate
          this.targetForm.get(this.nameControl)?.markAsTouched();
          this.targetForm.get(this.idControl)?.markAsTouched();
          console.log('Emitting optionSelected event from AutocompleteDirective');
          // Emit the custom event
          this.optionSelected.emit({
            id: formatedId,
            name: selectedValue,
            originalEvent: event
          });
        }
      }
    };

    this.el.nativeElement.addEventListener('input', this.inputListener);
    this.el.nativeElement.addEventListener('click', this.clickListener);
  }
}
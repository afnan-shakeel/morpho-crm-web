import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

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

  private inputListener?: () => void;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.setupAutocomplete();
  }

  ngOnDestroy() {
    if (this.inputListener) {
      this.el.nativeElement.removeEventListener('input', this.inputListener);
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
            const formatedId = isNaN(Number(selectedId)) ? selectedId : Number(selectedId);
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
    const optionClickListener = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'EL-OPTION') {
        const selectedId = target.getAttribute(this.optionIdAttribute);
        const selectedValue = target.getAttribute(this.optionValueAttribute);
        
        if (selectedId && selectedValue) {
          const numericId = isNaN(Number(selectedId)) ? 0 : Number(selectedId);
          this.targetForm.patchValue({
            [this.nameControl]: selectedValue,
            [this.idControl]: numericId
          });
          
          // Mark as touched and validate
          this.targetForm.get(this.nameControl)?.markAsTouched();
          this.targetForm.get(this.idControl)?.markAsTouched();
        }
      }
    };

    this.el.nativeElement.addEventListener('input', this.inputListener);
    this.el.nativeElement.addEventListener('click', optionClickListener);
  }
}
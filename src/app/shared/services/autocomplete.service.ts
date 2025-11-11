import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {

  /**
   * Setup autocomplete functionality for an element
   */
  setupAutocomplete(config: AutocompleteConfig): () => void {
    const element = document.getElementById(config.elementId);
    if (!element) {
      console.warn(`Element with id '${config.elementId}' not found`);
      return () => {};
    }

    const inputListener = () => {
      const optionsContainer = element.querySelector('el-options');
      const optionElements = optionsContainer?.getElementsByTagName('el-option');
      
      if (optionElements) {
        // Filter elements based on user search
        for (let i = 0; i < optionElements.length; i++) {
          const option = optionElements[i];
          const selectedValue = config.form.get(config.nameControl)?.value?.toLowerCase() || '';
          const optionValue = option.getAttribute(config.valueAttribute || 'value')?.toLowerCase() || '';
          
          if (optionValue.includes(selectedValue)) {
            const selectedId = option.getAttribute(config.idAttribute || 'id');
            const formattedId = selectedId; // Keep as string since IDs are now UUIDs
            config.form.patchValue({ [config.idControl]: formattedId });
            break;
          }
        }
      }

      // If the input is cleared, reset ID
      if (!config.form.get(config.nameControl)?.value) {
        config.form.patchValue({ [config.idControl]: 0 });
      }
    };

    element.addEventListener('input', inputListener);

    // Return cleanup function
    return () => element.removeEventListener('input', inputListener);
  }
}

export interface AutocompleteConfig {
  elementId: string;
  form: FormGroup;
  nameControl: string;
  idControl: string;
  valueAttribute?: string;
  idAttribute?: string;
}
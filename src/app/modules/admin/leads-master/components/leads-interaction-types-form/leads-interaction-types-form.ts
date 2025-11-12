import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeadInteractionTypeTypes } from '../../types';

@Component({
  selector: 'app-leads-interaction-types-form',
  imports: [ReactiveFormsModule],
  templateUrl: './leads-interaction-types-form.html',
  styleUrl: './leads-interaction-types-form.css'
})
export class LeadsInteractionTypesForm {

    private fb = inject(FormBuilder);
  @Input() interactionTypeId: string | null = null;
  @Input() leadInteractionTypeData: LeadInteractionTypeTypes.LeadInteractionType | null = null;
  @Input() isEditMode: boolean = false;
  @Input() formTitle: string = 'Create Lead Interaction Type';
  @Output() formSubmit: EventEmitter<LeadInteractionTypeTypes.LeadInteractionTypeFormData> = new EventEmitter<LeadInteractionTypeTypes.LeadInteractionTypeFormData>();
  @Output() formCancel: EventEmitter<void> = new EventEmitter<void>();
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['interactionTypeId'] && this.interactionTypeId) {
      this.populateForm(this.interactionTypeId);
    }
  }

  populateForm(interactionTypeId: string) {
    // future: fetch lead source data by id if not provided via input
    if (this.leadInteractionTypeData) {
      this.leadInteractionTypeForm.patchValue({
        interactionTypeName: this.leadInteractionTypeData.interactionTypeName
      });
    }
  }

  leadInteractionTypeForm = this.fb.group({
    interactionTypeName: ['', Validators.required],
    isActive: [true]
  });
  
  onSubmit() {
    if (this.leadInteractionTypeForm.valid) {
      this.formSubmit.emit({
        interactionTypeName: this.leadInteractionTypeForm.value.interactionTypeName!,
      });
      this.leadInteractionTypeForm.reset();
    }
  }

  onCancel() {
    this.formCancel.emit();
    this.leadInteractionTypeForm.reset();
  }

}

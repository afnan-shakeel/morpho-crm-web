import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeadInteractionForm as LeadInteractionFormType, LeadInteractionType } from '../../types';
@Component({
  selector: 'app-lead-interaction-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './lead-interaction-form.html',
  styleUrl: './lead-interaction-form.css'
})
export class LeadInteractionForm {

  fb = inject(FormBuilder);

  @Input() leadId: string = '';
  @Output() interactionSubmit = new EventEmitter<LeadInteractionFormType>();

  ngOnInit() {
  }

  interactionTypes = Object.values(LeadInteractionType); // Get enum values as an array

  interactionForm = this.fb.group({
    interactionType: [LeadInteractionType.CALL, Validators.required],
    interactionDate: [new Date().toISOString().slice(0, 16), Validators.required],
    notes: ['']
  });

  onSubmit() {
    if (this.leadId === '') {
      console.error('Lead reference is required to submit interaction.');
      return;
    }
    if (this.interactionForm.valid) {
      this.interactionSubmit.emit({
        leadId: this.leadId,
        interactionType: this.interactionForm.get('interactionType')?.value || LeadInteractionType.OTHER,
        interactionDate: this.interactionForm.get('interactionDate')?.value || new Date().toISOString().slice(0, 16),
        notes: this.interactionForm.get('notes')?.value || ''
      });
    }
  }
  
}

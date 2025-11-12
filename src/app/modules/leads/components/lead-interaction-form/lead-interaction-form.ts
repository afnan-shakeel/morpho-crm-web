import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeadInteractionTypeTypes } from '../../../admin/leads-master/types';
import { LeadInteractionForm as LeadInteractionFormType } from '../../types';

@Component({
  selector: 'app-lead-interaction-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './lead-interaction-form.html',
  styleUrl: './lead-interaction-form.css'
})
export class LeadInteractionForm implements OnInit {

  fb = inject(FormBuilder);

  @Input() leadId: string = '';
  @Input() leadInteractionTypes: LeadInteractionTypeTypes.LeadInteractionType[] = [];
  @Output() interactionSubmit = new EventEmitter<LeadInteractionFormType>();

  ngOnInit() {
  }

  interactionForm = this.fb.group({
    interactionTypeId: ['', Validators.required],
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
        interactionTypeId: this.interactionForm.get('interactionTypeId')?.value || '',
        interactionDate: this.interactionForm.get('interactionDate')?.value || new Date().toISOString().slice(0, 16),
        notes: this.interactionForm.get('notes')?.value || ''
      });
    }
  }
  
}

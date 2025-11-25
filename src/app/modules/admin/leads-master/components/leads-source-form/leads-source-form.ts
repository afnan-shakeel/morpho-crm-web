import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeadSourceTypes } from '../../types';

@Component({
  selector: 'app-leads-source-form',
  imports: [ReactiveFormsModule],
  templateUrl: './leads-source-form.html',
  styleUrl: './leads-source-form.css'
})
export class LeadsSourceForm {

  private fb = inject(FormBuilder);
  @Input() sourceId: string | null = null;
  @Input() leadSourceData: LeadSourceTypes.LeadSourceFormData | null = null;
  @Input() isEditMode: boolean = false;
  @Input() formTitle: string = 'Create Lead Source';
  @Output() formSubmit: EventEmitter<LeadSourceTypes.LeadSourceFormData> = new EventEmitter<LeadSourceTypes.LeadSourceFormData>();
  @Output() formCancel: EventEmitter<void> = new EventEmitter<void>();
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['sourceId'] && this.sourceId) {
      this.populateForm(this.sourceId);
    }
  }

  populateForm(sourceId: string) {
    // future: fetch lead source data by id if not provided via input
    if (this.leadSourceData) {
      this.leadsSourceForm.patchValue({
        sourceName: this.leadSourceData.sourceName,
        isActive: this.leadSourceData.isActive
      });
    }
  }

  leadsSourceForm = this.fb.group({
    sourceName: ['', Validators.required],
    isActive: [true]
  });

  onSubmit() {
    // mark all fields as touched to trigger validation messages
    this.leadsSourceForm.markAllAsTouched();
    
    if (this.leadsSourceForm.valid) {
      this.formSubmit.emit({
        sourceName: this.leadsSourceForm.value.sourceName!,
        isActive: this.leadsSourceForm.value.isActive!
      });
      this.leadsSourceForm.reset({ isActive: true });
    }
  }

  onCancel() {
    this.formCancel.emit();
    this.leadsSourceForm.reset({ isActive: true });
  }

}

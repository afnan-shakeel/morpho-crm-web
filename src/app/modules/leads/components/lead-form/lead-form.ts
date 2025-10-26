import { Component, inject, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-lead-form',
  imports: [],
  templateUrl: './lead-form.html',
  styleUrl: './lead-form.css'
})
export class LeadForm {

  private fb = inject(FormBuilder);

  @Input() isEditMode: boolean = false;
  @Input() formTitle: string = 'Create Lead';
  @Input() leadId: string | null = null;

  leadForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    leadAddress: this.fb.group({
      street: [''],
      city: ['']
    })
  });

  ngOnInit() {
    if (this.isEditMode && this.leadId) {
      // fetch lead data by leadId and populate the form
      this.fetchLeadData(this.leadId);
    }
  }

  private fetchLeadData(leadId: string) {
    // Simulate an API call to fetch lead data
    const leadData = {
      firstName: 'John',
      lastName: 'Doe',
    };

    // Populate the form with the fetched lead data
    this.leadForm.patchValue(leadData);
  }
  onSubmit() {
    if (this.leadForm.valid) {
      const leadData = this.leadForm.value;
      if (this.isEditMode) {
        // Call update lead API
        console.log('Updating lead:', this.leadId, leadData);
      } else {
        // Call create lead API
        console.log('Creating lead:', leadData);
      }
    }
  }
}

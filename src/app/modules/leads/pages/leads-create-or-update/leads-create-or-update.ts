import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LeadForm } from "../../components/lead-form/lead-form";

@Component({
  selector: 'app-leads-create-or-update',
  imports: [LeadForm],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './leads-create-or-update.html',
  styleUrl: './leads-create-or-update.css'
})
export class LeadsCreateOrUpdate {

  // get the leadId from query params to determine if it's create or update
  private leadId: string | null = null;
  private fb = inject(FormBuilder);
  isEditMode: boolean = false;
  formTitle: string = 'Create Lead';
  
  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    this.leadId = urlParams.get('leadId');
    this.isEditMode = this.leadId !== null;

    if (this.isEditMode) {
      this.formTitle = 'Edit Lead';
    }
  }

}

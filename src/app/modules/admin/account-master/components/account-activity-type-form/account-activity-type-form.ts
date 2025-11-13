import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountActivityTypeMasterFormTypes, AccountActivityTypeMasterTypes } from '../../types/account-activity-types';

@Component({
  selector: 'app-account-activity-type-form',
  imports: [ReactiveFormsModule],
  templateUrl: './account-activity-type-form.html',
  styleUrl: './account-activity-type-form.css'
})
export class AccountActivityTypeForm {
  private fb = inject(FormBuilder);
  @Input() activityTypeId: string | null = null;
  @Input() activityTypeData: AccountActivityTypeMasterTypes.AccountActivityType | null = null;
  @Input() isEditMode: boolean = false;
  @Input() formTitle: string = 'Create Lead Source';
  @Output() formSubmit: EventEmitter<AccountActivityTypeMasterFormTypes.AccountActivityTypeFormData> = new EventEmitter<AccountActivityTypeMasterFormTypes.AccountActivityTypeFormData>();
  @Output() formCancel: EventEmitter<void> = new EventEmitter<void>();
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['activityTypeId'] && this.activityTypeId) {
      this.populateForm(this.activityTypeId);
    }
  }

  populateForm(activityTypeId: string) {
    // future: fetch account activity type data by id if not provided via input
    if (this.activityTypeData) {
      this.activityTypeForm.patchValue({
        activityTypeName: this.activityTypeData.activityTypeName,
      });
    }
  }

  activityTypeForm = this.fb.group({
    activityTypeName: ['', Validators.required],
  });

  onSubmit() {
    // mark all fields as touched to trigger validation messages
    this.activityTypeForm.markAllAsTouched();
    
    if (this.activityTypeForm.valid) {
      this.formSubmit.emit({
        activityTypeName: this.activityTypeForm.value.activityTypeName!,
      });
      this.activityTypeForm.reset();
    }
  }

  onCancel() {
    this.formCancel.emit();
    this.activityTypeForm.reset();
  }

}

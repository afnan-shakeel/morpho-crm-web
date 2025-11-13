import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OpportunityStageFormTypes, OpportunityStageTypes } from '../../types/opportunity-stage';

@Component({
  selector: 'app-opportunity-stage-form',
  imports: [ReactiveFormsModule],
  templateUrl: './opportunity-stage-form.html',
  styleUrl: './opportunity-stage-form.css'
})
export class OpportunityStageForm {
  private fb = inject(FormBuilder);
  @Input() stageId: string | null = null;
  @Input() stageData: OpportunityStageTypes.OpportunityStage | null = null;
  @Input() isEditMode: boolean = false;
  @Input() formTitle: string = 'Create Opportunity Stage';
  @Output() formSubmit: EventEmitter<OpportunityStageFormTypes.OpportunityStageForm> = new EventEmitter<OpportunityStageFormTypes.OpportunityStageForm>();
  @Output() formCancel: EventEmitter<void> = new EventEmitter<void>();
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['stageId'] && this.stageId) {
      this.populateForm(this.stageId);
    }
  }

  populateForm(stageId: string) {
    // future: fetch stage data by id if not provided via input
    if (this.stageData) {
      this.opportunityStageForm.patchValue({
        stageName: this.stageData.name,
        probability: this.stageData.probability,
        isClosed: this.stageData.is_closed,
        sequence: this.stageData.sequence,
      });
    }
  }

  opportunityStageForm = this.fb.group({
    stageName: ['', Validators.required],
    probability: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    isClosed: [false, Validators.required],
    sequence: [0, [Validators.required, Validators.min(0)]],
  });

  onSubmit() {
    // mark all fields as touched to trigger validation messages
    this.opportunityStageForm.markAllAsTouched();
    
    if (this.opportunityStageForm.valid) {
      this.formSubmit.emit({
        name: this.opportunityStageForm.value.stageName!,
        probability: this.opportunityStageForm.value.probability!,
        is_closed: this.opportunityStageForm.value.isClosed!,
        sequence: this.opportunityStageForm.value.sequence!,
      });
      this.opportunityStageForm.reset();
    }
  }

  onCancel() {
    this.formCancel.emit();
    this.opportunityStageForm.reset();
  }

}

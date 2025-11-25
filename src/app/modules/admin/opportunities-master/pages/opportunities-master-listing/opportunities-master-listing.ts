import { Component, inject, ViewChild } from '@angular/core';
import { ToastService } from '../../../../../core';
import { Tab, TabChangeEvent, TabsComponent } from '../../../../../shared';
import { CustomDatatable } from '../../../../../shared/components/custom-datatable/custom-datatable';
import { CellTemplate, DataTableColumn, DataTableRowAction } from '../../../../../shared/components/custom-datatable/types';
import { ModalSmall } from '../../../../../shared/components/modal-small/modal-small';
import { PageHeading } from '../../../../../shared/components/page-heading/page-heading';
import { OpportunityStageForm } from '../../components/opportunity-stage-form/opportunity-stage-form';
import { OpportunityStageService } from '../../services/opportunity-stage.service';
import { OpportunityStageFormTypes, OpportunityStageTypes } from '../../types/opportunity-stage';

@Component({
  selector: 'app-opportunities-master-listing',
  imports: [PageHeading, CustomDatatable, TabsComponent, ModalSmall, OpportunityStageForm],
  templateUrl: './opportunities-master-listing.html',
  styleUrl: './opportunities-master-listing.css'
})
export class OpportunitiesMasterListing {

  private toastService = inject(ToastService);
  private opportunityStageService = inject(OpportunityStageService);
  pageBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Opportunities Master', path: '/admin/opportunities-master' },
  ]

  contentTabs: Tab[] = [
    { id: 'opportunity-stage', label: 'Opportunity Stage', active: true },
    { id: 'opportunity-stage-tasks', label: 'Opportunity Stage Tasks', active: true },
  ];
  currentContent = 'opportunity-stage';

  opporuntityStages: OpportunityStageTypes.OpportunityStage[] = [];
  opporuntityStagesListingColumns: DataTableColumn[] = [
    { field: 'stageId', label: 'Stage ID', hidden: true },
    { field: 'name', label: 'Stage Name' },
    { field: 'probability', label: 'Probability (%)' },
    { field: 'is_closed', label: 'Closed Stage', cellTemplate: CellTemplate.BOOLEAN },
    { field: 'sequence', label: 'Sequence' },
    { field: 'createdAt', label: 'Created Time', cellTemplate: CellTemplate.DATETIME },
  ];
  rowActions: DataTableRowAction[] = [
    {
      label: 'Edit',
      actionCallback: (rowData: OpportunityStageTypes.OpportunityStage) => {
        this.openOpportunityStageFormModal(rowData);
      }
    }
  ];

  ngOnInit(): void {
    // initial load
    this.loadOpportunityStages();
  }

  onContentTabChange(event: TabChangeEvent) {
    this.currentContent = event.tab.id;
    if (event.tab.id === 'opportunity-stage') {
      this.loadOpportunityStages();
    }
  }


  onCreateMasterData() {
    if (this.currentContent === 'opportunity-stage') {
      this.openOpportunityStageFormModal();
    }
  }


  loadOpportunityStages() {
    this.opportunityStageService.getOpportunityStages().subscribe((stages) => {
      this.opporuntityStages = stages;
    });
  }

  // start: opportunity stage form modal
  @ViewChild('opportunityStageFormModal') opportunityStageFormModal!: ModalSmall;
  selectedOpportunityStageData: OpportunityStageTypes.OpportunityStage | null = null;
  opportunityFormTitle: string = 'Create Opportunity Stage';
  openOpportunityStageFormModal(stageData: OpportunityStageTypes.OpportunityStage | null = null) {
    this.selectedOpportunityStageData = stageData;
    if (stageData && stageData.stageId) {
      this.opportunityFormTitle = 'Edit Opportunity Stage';
      this.selectedOpportunityStageData = stageData;
    } else {
      this.opportunityFormTitle = 'Create Opportunity Stage';
      this.selectedOpportunityStageData = null;
    }
    this.opportunityStageFormModal.open();
  }

  closeOpportunityStageFormModal() {
    this.opportunityStageFormModal.close();
    this.selectedOpportunityStageData = null;
  }

  onOpportunityStageFormSubmit(formData: OpportunityStageFormTypes.OpportunityStageForm | null) {
    if (!formData) {
      this.closeOpportunityStageFormModal();
      return;
    }
    if (this.selectedOpportunityStageData && this.selectedOpportunityStageData.stageId) {
      // Edit existing stage
      this.opportunityStageService.updateOpportunityStage(this.selectedOpportunityStageData.stageId, {
        name: formData.name,
        probability: formData.probability,
        is_closed: formData.is_closed,
        sequence: formData.sequence,
      }).subscribe({
        next: (updatedStage) => {
          if (updatedStage && updatedStage.stageId) {
            this.toastService.success('Opportunity Stage updated successfully.');
            this.loadOpportunityStages();
            this.closeOpportunityStageFormModal();
            return;
          }
        }
      });
    } else {
      // Create new stage
      this.opportunityStageService.createOpportunityStage({
        name: formData.name,
        probability: formData.probability,
        is_closed: formData.is_closed,
        sequence: formData.sequence,
      }).subscribe({
        next: (newStage) => {
          if (newStage && newStage.stageId) {
            this.toastService.success('Opportunity Stage created successfully.');
            this.loadOpportunityStages();
            this.closeOpportunityStageFormModal();
            return;
          }
        }
      });
    }
  }
  // end: opportunity stage form modal
}

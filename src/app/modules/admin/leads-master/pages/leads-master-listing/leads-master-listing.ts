import { Tab, TabChangeEvent, TabsComponent } from "@/shared";
import { CustomDatatable } from "@/shared/components/custom-datatable/custom-datatable";
import { ModalSmall } from "@/shared/components/modal-small/modal-small";
import { PageHeading } from "@/shared/components/page-heading/page-heading";
import { CommonModule } from "@angular/common";
import { Component, inject, ViewChild } from '@angular/core';
import { ToastService } from "../../../../../core";
import { CellTemplate, ColorBadgeColor, DataTableColumn, DataTableRowAction } from "../../../../../shared/components/custom-datatable/types";
import { LeadsInteractionTypesForm } from "../../components/leads-interaction-types-form/leads-interaction-types-form";
import { LeadsSourceForm } from "../../components/leads-source-form/leads-source-form";
import { LeadsInteractionMasterService } from "../../services/lead-interaction-master.service";
import { LeadsSourceMasterService } from "../../services/leads-source-master.service";
import { LeadInteractionTypeTypes, LeadSourceTypes } from "../../types";
import { LeadSource } from "../../types/lead-source";

@Component({
  selector: 'app-leads-master-listing',
  imports: [PageHeading, CustomDatatable, TabsComponent, CommonModule, ModalSmall, LeadsSourceForm, LeadsInteractionTypesForm],
  templateUrl: './leads-master-listing.html',
  styleUrl: './leads-master-listing.css'
})
export class LeadsMasterListing {

  private toastService = inject(ToastService);
  private leadSourceService = inject(LeadsSourceMasterService);
  private leadInteractionTypeService = inject(LeadsInteractionMasterService);
  pageBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Leads Master', path: '/admin/leads-master' },
  ];
  contentTabs: Tab[] = [
    { id: 'lead-source', label: 'Lead Source', active: true },
    { id: 'lead-interaction-type', label: 'Lead Interaction Type' },
    { id: 'lead-status', label: 'Lead Status' },
  ];
  currentContent = 'lead-source';

  leadSources: LeadSource[] = [];
  leadSourceListColumns: DataTableColumn[] = [
    { field: 'sourceId', label: 'Source ID', hidden: true },
    { field: 'sourceName', label: 'Source Name' },
    {
      field: 'isActive', label: 'Active', cellTemplate: CellTemplate.COLOR_BADGE, colorBadgeMapper: {
        'true': ColorBadgeColor.GREEN,
        'false': ColorBadgeColor.RED
      }, valueMapper: {
        'true': 'Yes',
        'false': 'No'
      }
    },
    { field: 'createdAt', label: 'Created Time', cellTemplate: CellTemplate.DATETIME },
  ];
  leadSourceRowActions: DataTableRowAction[] = [
    {
      label: 'Edit',
      actionCallback: (rowData: LeadSourceTypes.LeadSource) => {
        this.openLeadSourceFormModal(rowData);
      }
    }
  ];

  leadInteractionTypes: LeadInteractionTypeTypes.LeadInteractionType[] = [];
  leadInteractionTypeListColumns: DataTableColumn[] = [
    { field: 'interactionTypeId', label: 'Interaction Type ID', hidden: true },
    { field: 'interactionTypeName', label: 'Interaction Type Name' },
    {
      field: 'isActive', label: 'Active', cellTemplate: CellTemplate.COLOR_BADGE, colorBadgeMapper: {
        'true': ColorBadgeColor.GREEN,
        'false': ColorBadgeColor.RED
      }, valueMapper: {
        'true': 'Yes',
        'false': 'No'
      }
    },
    { field: 'createdAt', label: 'Created Time', cellTemplate: CellTemplate.DATETIME },
  ];
  leadInteractionTypeRowActions: DataTableRowAction[] = [
    {
      label: 'Edit',
      actionCallback: (rowData: LeadInteractionTypeTypes.LeadInteractionType) => {
        this.openLeadInteractionTypeFormModal(rowData);
      }
    }
  ];


  ngOnInit(): void {
    // load lead sources by default
    this.loadLeadSources();
  }

  onContentTabChange(event: TabChangeEvent) {
    this.currentContent = event.tab.id;
    if (event.tab.id === 'lead-source') {
      this.loadLeadSources();
    }
    else if (event.tab.id === 'lead-interaction-type') {
      this.loadLeadInteractionTypes();
    }
  }

  loadLeadSources() {
    this.leadSourceService.getLeadSources().subscribe((sources) => {
      this.leadSources = sources;
    });
  }
  loadLeadInteractionTypes() {
    this.leadInteractionTypeService.getLeadInteractionTypes().subscribe((types) => {
      this.leadInteractionTypes = types;
    });
  }

  onCreateMaster() {
    if (this.currentContent === 'lead-source') {
      this.openLeadSourceFormModal();
    } else if (this.currentContent === 'lead-interaction-type') {
      this.openLeadInteractionTypeFormModal();
    } else if (this.currentContent === 'lead-status') {
      // Open lead status creation modal
    }
  }

  // start: Lead Source Modal Logic
  leadSourceModalTitle: string = 'Create Lead Source';
  selectedLeadSourceToUpdate: LeadSource | null = null;
  @ViewChild('leadSourceFormModal') leadSourceFormModal!: ModalSmall;

  openLeadSourceFormModal(leadSource: LeadSourceTypes.LeadSource | null = null) {
    this.selectedLeadSourceToUpdate = leadSource;
    this.leadSourceModalTitle = (leadSource && leadSource.sourceId) ? 'Update Lead Source' : 'Create Lead Source';
    this.leadSourceFormModal.open();
  }
  closeLeadSourceFormModal() {
    this.leadSourceFormModal.close();
    this.selectedLeadSourceToUpdate = null;
  }
  onLeadSourceFormSubmit(data: LeadSourceTypes.LeadSourceFormData) {
    // call create or update api based on selectedLeadSourceToUpdate
    if (this.selectedLeadSourceToUpdate && this.selectedLeadSourceToUpdate.sourceId) {
      // update
      this.leadSourceService.updateLeadSource({
        sourceId: this.selectedLeadSourceToUpdate.sourceId,
        sourceName: data.sourceName,
        isActive: data.isActive ?? true
      }).subscribe((response) => {
        if (response?.sourceId) {
          this.loadLeadSources();
          this.closeLeadSourceFormModal();
          this.toastService.success('Lead Source updated successfully');
          return;
        }
      });
    } else {
      // create
      this.leadSourceService.createLeadSource({
        sourceName: data.sourceName,
        isActive: data.isActive ?? true
      }).subscribe((response) => {
        if (response?.sourceId) {
          this.toastService.success('Lead Source created successfully');
          this.loadLeadSources();
          this.closeLeadSourceFormModal();
          return;
        }
      });
    }
  }
  onLeadSourceFormCancel() {
    this.closeLeadSourceFormModal();
  }
  // end: Lead Source Modal Logic


  // start: Lead Interaction Type Modal Logic
  @ViewChild('leadInteractionTypeFormModal') leadInteractionTypeFormModal!: ModalSmall;
  leadInteractionTypeModalTitle: string = 'Create Lead Interaction Type';
  selectedLeadInteractionTypeToUpdate: LeadInteractionTypeTypes.LeadInteractionType | null = null;
  openLeadInteractionTypeFormModal(leadInteractionType: LeadInteractionTypeTypes.LeadInteractionType | null = null) {
    this.selectedLeadInteractionTypeToUpdate = leadInteractionType;
    this.leadInteractionTypeModalTitle = (leadInteractionType && leadInteractionType.interactionTypeId) ? 'Update Lead Interaction Type' : 'Create Lead Interaction Type';
    this.leadInteractionTypeFormModal.open();
  }
  closeLeadInteractionTypeFormModal() {
    this.leadInteractionTypeFormModal.close();
    this.selectedLeadInteractionTypeToUpdate = null;
  }
  onLeadInteractionTypeFormSubmit(data: LeadInteractionTypeTypes.LeadInteractionTypeFormData) {
    // call create or update api based on selectedLeadInteractionTypeToUpdate
    if (this.selectedLeadInteractionTypeToUpdate && this.selectedLeadInteractionTypeToUpdate.interactionTypeId) {
      // update
      this.leadInteractionTypeService.updateLeadInteractionType(this.selectedLeadInteractionTypeToUpdate.interactionTypeId, {
        interactionTypeName: data.interactionTypeName,
      }).subscribe((response) => {
        if (response?.interactionTypeId) {
          this.loadLeadInteractionTypes();
          this.closeLeadInteractionTypeFormModal();
          this.toastService.success('Lead Interaction Type updated successfully');
          return;
        }
      });
    } else {
      // create
      this.leadInteractionTypeService.createLeadInteractionType({
        interactionTypeName: data.interactionTypeName,
      }).subscribe((response) => {
        if (response?.interactionTypeId) {
          this.toastService.success('Lead Interaction Type created successfully');
          this.loadLeadInteractionTypes();
          this.closeLeadInteractionTypeFormModal();
          return;
        }
      });
    }
  }
  onLeadInteractionTypeFormCancel() {
    this.closeLeadInteractionTypeFormModal();
  }
  // end: Lead Interaction Type Modal Logic



}

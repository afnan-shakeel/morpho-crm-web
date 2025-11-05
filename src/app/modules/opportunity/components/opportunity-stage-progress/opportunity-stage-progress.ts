import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { OpportunityService } from '../../opportunity.service';
import { OpportunityStage } from '../../types';

@Component({
  selector: 'app-opportunity-stage-progress',
  imports: [CommonModule],
  templateUrl: './opportunity-stage-progress.html',
  styleUrl: './opportunity-stage-progress.css'
})
export class OpportunityStageProgress implements OnInit {

  private opportunitiesService = inject(OpportunityService);
  @Input() opportunityStage: OpportunityStage | null = null;
  @Input() showStageNames: boolean = true;
  @Input() clickable: boolean = false;

  // fetch opportunity stages from service
  opportunityStages: OpportunityStage[] = [];
  loading: boolean = false;

  ngOnInit(): void {
    this.loadOpportunityStages();
  }

  loadOpportunityStages(): void {
    this.loading = true;
    this.opportunitiesService.getOpportunityStages().subscribe({
      next: (stages) => {
        // Sort stages by sequence for proper order
        this.opportunityStages = stages.sort((a, b) => a.sequence - b.sequence);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching opportunity stages:', error);
        this.loading = false;
      }
    });
  }

  // get index of current opportunity stage
  get currentStageIndex(): number {
    if (!this.opportunityStage || !this.opportunityStages.length) {
      return -1;
    }
    return this.opportunityStages.findIndex(stage => stage.stageId === this.opportunityStage!.stageId);
  }

  // check if stage is completed (before current stage)
  isStageCompleted(stageIndex: number): boolean {
    const currentIndex = this.currentStageIndex;
    return currentIndex !== -1 && stageIndex < currentIndex;
  }

  // check if stage is current
  isCurrentStage(stageIndex: number): boolean {
    return this.currentStageIndex === stageIndex;
  }

  // check if stage is upcoming (after current stage)
  isUpcomingStage(stageIndex: number): boolean {
    const currentIndex = this.currentStageIndex;
    return currentIndex !== -1 && stageIndex > currentIndex;
  }

  // get stage completion percentage
  get completionPercentage(): number {
    if (!this.opportunityStages.length || this.currentStageIndex === -1) {
      return 0;
    }
    return Math.round(((this.currentStageIndex + 1) / this.opportunityStages.length) * 100);
  }

  // handle stage click (if clickable)
  onStageClick(stage: OpportunityStage, index: number): void {
    if (!this.clickable) return;

    // Emit event or handle stage change logic here
    console.log('Stage clicked:', stage.name, 'Index:', index);
    // You can add an @Output() event emitter here if needed
  }

}

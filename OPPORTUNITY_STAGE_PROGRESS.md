# Opportunity Stage Progress Component

## Overview

The `OpportunityStageProgress` component displays the current stage of an opportunity in a visual progress indicator, showing completed, current, and upcoming stages.

## Usage

### Basic Usage

```html
<app-opportunity-stage-progress
  [opportunityStage]="currentOpportunityStage">
</app-opportunity-stage-progress>
```

### Advanced Usage with Options

```html
<app-opportunity-stage-progress
  [opportunityStage]="currentOpportunityStage"
  [showStageNames]="true"
  [clickable]="false">
</app-opportunity-stage-progress>
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `opportunityStage` | `OpportunityStage \| null` | `null` | The current stage of the opportunity |
| `showStageNames` | `boolean` | `true` | Whether to display stage names next to indicators |
| `clickable` | `boolean` | `false` | Whether stages are clickable (for future stage change functionality) |

## Component Features

### 🎯 **Visual States**
- **Completed Stages**: Green checkmark with completed styling
- **Current Stage**: Blue indicator with pulsing animation
- **Upcoming Stages**: Gray dots indicating future stages
- **Loading State**: Spinner while fetching stages
- **No Data State**: Message when no stages are available

### 📊 **Progress Information**
- Progress bar showing completion percentage
- Stage counter (e.g., "Stage 2 of 5")
- Current stage name display
- Stage probability percentages

### 🎨 **Responsive Design**
- Mobile-friendly layout
- Dark mode support
- Smooth animations and transitions
- Hover effects for interactive elements

## Example Implementation

### In Parent Component (.ts)
```typescript
export class OpportunityDetailComponent implements OnInit {
  currentOpportunityStage: OpportunityStage | null = null;
  
  ngOnInit() {
    this.loadOpportunityDetails();
  }
  
  loadOpportunityDetails() {
    this.opportunityService.getOpportunity(this.opportunityId).subscribe(
      opportunity => {
        this.currentOpportunityStage = opportunity.opportunityStage;
      }
    );
  }
}
```

### In Parent Template (.html)
```html
<div class="opportunity-details">
  <h1>{{ opportunity?.opportunityName }}</h1>
  
  <!-- Stage Progress -->
  <div class="mb-8">
    <app-opportunity-stage-progress
      [opportunityStage]="currentOpportunityStage"
      [showStageNames]="true">
    </app-opportunity-stage-progress>
  </div>
  
  <!-- Other opportunity details -->
</div>
```

## API Integration

The component automatically fetches all available opportunity stages from the `OpportunityService`:

```typescript
// Fetches and sorts stages by sequence
this.opportunitiesService.getOpportunityStages().subscribe(stages => {
  this.opportunityStages = stages.sort((a, b) => a.sequence - b.sequence);
});
```

## Stage Types

Based on the `OpportunityStage` interface:

```typescript
interface OpportunityStage {
  stageId: string;
  name: string;          // Display name (e.g., "Qualification", "Proposal")
  probability: number;   // Win probability percentage
  is_closed: boolean;    // Whether this is a closing stage
  sequence: number;      // Order in the pipeline
}
```

## Visual Examples

### Standard Pipeline View
```
✅ Qualification (20%)
🔵 Proposal (60%)     ← Current Stage
⚪ Negotiation (80%)
⚪ Closed Won (100%)
```

### With Progress Bar
```
Stage 2 of 4 - Proposal
████████████░░░░░░░░░░ 50% Complete
```

## Customization

### Hide Stage Names
```html
<app-opportunity-stage-progress
  [opportunityStage]="currentStage"
  [showStageNames]="false">
</app-opportunity-stage-progress>
```

### Make Clickable (Future Enhancement)
```html
<app-opportunity-stage-progress
  [opportunityStage]="currentStage"
  [clickable]="true"
  (stageClick)="onStageChange($event)">
</app-opportunity-stage-progress>
```

## Component Methods (Available for Extension)

| Method | Description |
|--------|-------------|
| `isStageCompleted(index)` | Checks if a stage is completed |
| `isCurrentStage(index)` | Checks if a stage is current |
| `isUpcomingStage(index)` | Checks if a stage is upcoming |
| `onStageClick(stage, index)` | Handles stage clicks (if clickable) |

## CSS Classes

Key classes for custom styling:

- `.stage-progress` - Main container
- `.current-stage-pulse` - Pulsing animation for current stage
- `.stage-indicator` - Individual stage indicators
- `.progress-bar` - Progress bar animation

## Accessibility

- Proper ARIA labels and roles
- Screen reader friendly
- Keyboard navigation support (when clickable)
- High contrast support in dark mode
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Opportunity } from '../../types';

@Component({
  selector: 'app-opportunity-header-box',
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './opportunity-header-box.html',
  styleUrl: './opportunity-header-box.css'
})
export class OpportunityHeaderBox {

  @Input() opportunity: Opportunity | null = null;

  quickActions = [
    {
      label: 'Close As Won', action: 'close_won', handler: () => {
        console.log('Close As Won action triggered');
      }
    },
    {
      label: 'Close As Lost', action: 'close_lost', handler: () => {
        console.log('Close As Lost action triggered');
      }
    },
    {
      label: 'Add Activity', action: 'add_activity', handler: () => {
        console.log('Add Activity action triggered');
      }
    },
  ];
}

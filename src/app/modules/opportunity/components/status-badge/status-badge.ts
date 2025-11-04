import { Component, Input } from '@angular/core';
import { OpportunityStatus } from '../../types';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css'
})
export class StatusBadgeComponent {
  @Input() status: OpportunityStatus = OpportunityStatus.Active;

  get badgeClasses(): string {
    switch (this.status) {
      case OpportunityStatus.Active:
        return 'bg-blue-50 text-blue-700 inset-ring-blue-600/10 dark:bg-blue-400/10 dark:text-blue-400 dark:inset-ring-blue-400/20';
      case OpportunityStatus.Won:
        return 'bg-green-50 text-green-700 inset-ring-green-600/10 dark:bg-green-400/10 dark:text-green-400 dark:inset-ring-green-400/20';
      case OpportunityStatus.Lost:
        return 'bg-red-50 text-red-700 inset-ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:inset-ring-red-400/20';
      default:
        return 'bg-gray-50 text-gray-700 inset-ring-gray-600/10 dark:bg-gray-400/10 dark:text-gray-400 dark:inset-ring-gray-400/20';
    }
  }

  get statusText(): string {
    return this.status;
  }
}

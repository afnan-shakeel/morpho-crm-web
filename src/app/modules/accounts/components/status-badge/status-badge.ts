import { Component, Input } from '@angular/core';
import { AccountStatusEnum } from '../../types';
import { getAccountStatusCssClasses } from '../../utils';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css'
})
export class StatusBadge {
  @Input() status: AccountStatusEnum | 'Unknown' = AccountStatusEnum.PENDING;

  get badgeClasses(): string {
    return getAccountStatusCssClasses(this.status )
  }

  get statusText(): string {
    return this.status;
  }

}

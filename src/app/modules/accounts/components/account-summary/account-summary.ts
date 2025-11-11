import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Contact } from "../../../contacts/types";
import { Account } from '../../types';
import { AccountInfoBox } from "../account-info-box/account-info-box";
import { AccountsActivityLog } from "../accounts-activity-log/accounts-activity-log";

@Component({
  selector: 'app-account-summary',
  imports: [CommonModule, AccountInfoBox, AccountsActivityLog],
  templateUrl: './account-summary.html',
  styleUrl: './account-summary.css'
})
export class AccountSummary {

  @Input() account: Account | null = null;
  @Input() primaryContact: Contact | null = null;



}

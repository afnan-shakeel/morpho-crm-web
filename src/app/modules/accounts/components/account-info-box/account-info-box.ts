import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Account, AccountAddress } from '../../types/account';

@Component({
  selector: 'app-account-info-box',
  imports: [CommonModule],
  templateUrl: './account-info-box.html',
  styleUrl: './account-info-box.css'
})
export class AccountInfoBox {

  @Input() account: Account | null = null;
  @Input() accountAddress: AccountAddress | null = null;
}

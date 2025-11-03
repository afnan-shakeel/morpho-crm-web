import { Component, inject, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountsService } from '../../accounts.service';

@Component({
  selector: 'app-account-form',
  imports: [],
  templateUrl: './account-form.html',
  styleUrl: './account-form.css'
})
export class AccountForm {
  private fb = inject(FormBuilder);
  private accountsService = inject(AccountsService);
  @Input() accountId: string | null = null;
  @Input() isEditMode: boolean = false;
  @Input() formTitle: string = 'Create Account';
  
  accountForm = this.fb.group({
    companyName: ['', Validators.required],
    industry: [''],
    companyPhone: [''],
    companyWebsite: [''],
    companySize: [''],
    accountStatus: [''],
  });

  ngOnInit() {
    if (this.accountId && this.isEditMode) {
      this.populateForm(this.accountId);
    }
  }

  populateForm(accountId: string) {
    if(!accountId) return;
    const account = this.accountsService.getAccountById(accountId).subscribe(account => {
      this.accountForm.patchValue({
        companyName: account.companyName,
        industry: account.industry,
        companyPhone: account.companyPhone,
        companyWebsite: account.companyWebsite,
        companySize: account.companySize,
      });
    });
  }
}

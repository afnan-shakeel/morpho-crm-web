import { UserSelectionInput } from "@/shared/components/user-selection-input/user-selection-input";
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountriesService, Country } from '../../../../shared';
import { UsersService } from '../../../user/users.service';
import { AccountsService } from '../../accounts.service';
import { AccountStatusEnum } from '../../types/account';


@Component({
  selector: 'app-account-form',
  imports: [ReactiveFormsModule, UserSelectionInput],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './account-form.html',
  styleUrl: './account-form.css'
})

export class AccountForm {
  private fb = inject(FormBuilder);
  private accountsService = inject(AccountsService);
  private userService = inject(UsersService);
  private countriesService = inject(CountriesService);
  @Input() accountId: string | null = null;
  @Input() isEditMode: boolean = false;
  @Input() formTitle: string = 'Create Account';
  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() resetFormEvent: boolean = false;
  userList: any[] = []
  accountStatuses = Object.values(AccountStatusEnum);
  countries: Country[] = [];

  accountForm = this.fb.group({
    accountId: [this.accountId],
    companyName: ['', Validators.required],
    industry: [''],
    companyPhone: ['', Validators.required],
    companyEmail: ['', Validators.email],
    companyWebsite: [''],
    companySize: [''],
    accountStatus: [AccountStatusEnum.PENDING],
    accountOwnerId: ['', Validators.required],
    address: this.fb.group({
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      country: [''],
    })
  });

  ngOnChanges(changes: SimpleChanges) {
    // keep reseting for any change in accountId input
    if (changes['accountId']) {
      this.accountForm.reset();
      // if accountId is provided, populate the form for editing
      if (this.accountId) {
        this.populateForm(this.accountId);
      }

      // load user list for account owner selection
      this.loadUserList();
      
      // load countries list
      this.loadCountries();
    }

    // reset the form when resetFormEvent is true
    if (changes['resetFormEvent'] && this.resetFormEvent) {
      this.accountForm.reset();
      this.isEditMode = false;
      this.formTitle = 'Create Account';
    }
  }

  ngOnInit() {
    this.loadCountries();
  }
  ngAfterViewInit() {
    this.loadUserList();
    // Autocomplete logic is now handled by the AutocompleteDirective
    // No manual event handling needed
  }

  populateForm(accountId: string) {
    if (!accountId) return;
    this.accountsService.getAccountById(accountId, true).subscribe(account => {
      this.accountForm.patchValue({
        accountId: account.accountId,
        companyName: account.companyName,
        industry: account.industry,
        companyPhone: account.companyPhone,
        companyEmail: account.companyEmail,
        companyWebsite: account.companyWebsite,
        companySize: account.companySize,
        accountStatus: account.accountStatus,
        accountOwnerId: account.accountOwnerId,
      });

      if (account.accountAddress && account.accountAddress.length > 0) {
        const _primaryAddress = account.accountAddress.filter(addr => addr.isPrimary === true);
        this.accountForm.get('address')?.patchValue({
          addressLine1: _primaryAddress[0]?.addressLine1,
          addressLine2: _primaryAddress[0]?.addressLine2 || null,
          city: _primaryAddress[0]?.city,
          state: _primaryAddress[0]?.state,
          postalCode: _primaryAddress[0]?.postalCode,
          country: _primaryAddress[0]?.country,
        });
      }
    });
  }

  private loadUserList(_searchTerm: string = '') {
    const searchTerm = _searchTerm ? _searchTerm.trim() : '';
    const maxResults = 20;
    const skipCount = 0;
    this.userService.getUsers(searchTerm, maxResults, skipCount).subscribe(users => {
      this.userList = users.data;
    });
  }

  private loadCountries() {
    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
      },
      error: (error) => {
        console.error('Error loading countries:', error);
      }
    });
  }


  onSubmit() {
    // console.log('Account Form Data:', this.accountForm.value);
    // mark all form fields as touched to trigger validation
    this.accountForm.markAllAsTouched();
    if (this.accountForm.valid) {
      const formData = this.accountForm.value;
      this.formSubmit.emit(formData);
    }
  }

  closeForm() {
    this.formSubmit.emit(null);
    // destroy component instance if needed
    this.accountForm.reset();
    this.isEditMode = false;
    this.formTitle = 'Create Account';
  }
}

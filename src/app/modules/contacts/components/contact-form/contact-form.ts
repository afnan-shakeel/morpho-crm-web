import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutocompleteDirective } from '../../../../shared';
import { AccountsService } from '../../../accounts/accounts.service';
import { Account } from '../../../accounts/types';
import { UsersService } from '../../../user/users.service';
import { ContactsService } from '../../contacts.service';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, AutocompleteDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css'
})
export class ContactForm {

  private userService = inject(UsersService);
  private contactsService = inject(ContactsService);
  private accountService = inject(AccountsService);
  private fb = inject(FormBuilder);
  @Input() contactId: string | null = null;
  @Input() isEditMode: boolean = false;
  @Input() formTitle: string = 'Create Account';
  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() resetFormEvent: boolean = false;
  userList: any[] = []
  accountList: Account[] = []
  contactForm = this.fb.group({
    contactId: [''],
    accountId: [''],
    accountName: [''],
    fullName: ['', Validators.required],
    email: ['', Validators.email],
    phone: ['', Validators.required],
    jobTitle: [''],
    isPrimary: [false],
    contactOwnerId: ['', Validators.required],
    contactOwnerName: ['', Validators.required],
  });
  formInitialValues = {
    isPrimary: false
  }
  ngOnInit() {
    // load user list for contact owner selection
    this.loadUserList();
    // load account list for account selection
    this.loadAccountList();

  }
  ngOnChanges(changes: SimpleChanges) {
    // keep reseting for any change in contactId input
    if (changes['contactId']) {
      this.contactForm.reset(this.formInitialValues);
      // if contactId is provided, populate the form for editing
      if (this.contactId) {
        this.populateForm(this.contactId);
      }

      // load user list for account owner selection
      this.loadUserList();
      // load account list for account selection
      this.loadAccountList();
    }

    // reset the form when resetFormEvent is true
    if (changes['resetFormEvent'] && this.resetFormEvent) {
      this.contactForm.reset(this.formInitialValues);
      this.isEditMode = false;
      this.formTitle = 'Create Account';
    }

  }

  populateForm(contactId: string) {
    if (!contactId) return;
    this.contactsService.getContactById(contactId, true).subscribe(contact => {
      this.contactForm.patchValue({
        contactId: contact.contactId,
        accountId: contact.account?.accountId,
        accountName: contact.account?.companyName,
        fullName: contact.fullName,
        email: contact.email,
        phone: contact.phone,
        jobTitle: contact.jobTitle,
        isPrimary: contact.isPrimary || false,
        contactOwnerId: contact.contactOwner?.id || '',
        contactOwnerName: contact.contactOwner?.fullName || '',
      });
    });
  }

  loadUserList(_searchTerm: string = '') {
    const searchTerm = _searchTerm ? _searchTerm.trim() : '';
    const maxResults = 20;
    const skipCount = 0;
    this.userService.getUsers(searchTerm, maxResults, skipCount).subscribe(users => {
      this.userList = users.data.map((user: any) => ({
        name: user.fullName || user.name || '',
        id: user.id,
        userName: user.userName,
      }));
    });
  }
  loadAccountList(_searchTerm: string = '') {
    const searchTerm = _searchTerm ? _searchTerm.trim() : '';
    const maxResults = 20;
    this.accountService.searchAccountsForAutocomplete(searchTerm, maxResults).subscribe(accounts => {
      this.accountList = accounts;
    });
  }

  onSubmit() {
    // populate all validation and check
    this.contactForm.markAllAsTouched();
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      this.formSubmit.emit(formData);
    }
  }

  closeForm() {
    this.formSubmit.emit(null);
    // destroy component instance if needed
    this.contactForm.reset(this.formInitialValues);
    this.isEditMode = false;
    this.formTitle = 'Create Account';
  }

}

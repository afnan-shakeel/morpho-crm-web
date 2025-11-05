import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteDirective } from '../../../../shared';
import { AccountsService } from '../../../accounts/accounts.service';
import { Account } from '../../../accounts/types';
import { ContactsService } from '../../../contacts/contacts.service';
import { Contact } from '../../../contacts/types';
import { UsersService } from '../../../user/users.service';
import { OpportunityService } from '../../opportunity.service';
import { OpportunityStage, OpportunityStatus } from '../../types';

@Component({
  selector: 'app-opportunity-form',
  imports: [ReactiveFormsModule, AutocompleteDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './opportunity-form.html',
  styleUrl: './opportunity-form.css',
})
export class OpportunityForm {
  private userService = inject(UsersService);
  private contactsService = inject(ContactsService);
  private accountService = inject(AccountsService);
  private opportunitiesService = inject(OpportunityService);
  private fb = inject(FormBuilder);

  @Input() opportunityId: string | null = null;
  @Input() isEditMode: boolean = false;
  @Input() formTitle: string = 'Create Opportunity';
  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() resetFormEvent: boolean = false;
  userList: any[] = [];
  accountList: Account[] = [];
  contactList: Contact[] = [];
  opportunityStages: OpportunityStage[] = [];
  opportunityStatuses: string[] = Object.values(OpportunityStatus);

  opportunityForm = this.fb.group({
    opportunityId: [''],
    accountName: [''],
    accountId: [''],
    contactName: [''],
    contactId: [''],
    opportunityName: [''],
    stageId: [''],
    status: [OpportunityStatus.Active],
    closedDate: [''],
    expectedCloseDate: [''],
    notes: [''],
    opportunityOwnerId: [0],
    opportunityOwnerName: [''],
  });

  ngOnInit() {
    // load user list for contact owner selection
    this.loadUserList();
    this.loadAccountList();
    this.loadOpportunityStages();

    // value changs for account id, to load contacts based on account
    this.opportunityForm.get('accountId')?.valueChanges.subscribe((accountId) => {
      console.log('Selected Account ID:', accountId);
      if (accountId) {
        this.loadAccountContacts(accountId);
      } else {
        this.contactList = [];
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // keep reseting for any change in opportunityId input
    if (changes['opportunityId']) {
      console.log('Opportunity ID changed:', this.opportunityId);
      // if opportunityId is provided, populate the form for editing
      if (this.opportunityId) {
        this.populateForm(this.opportunityId);
      }

      // load user list for account owner selection
      this.loadUserList();
      // load account list for account selection
      this.loadAccountList();
    }

    // reset the form when resetFormEvent is true
    if (changes['resetFormEvent'] && this.resetFormEvent) {
      this.opportunityForm.reset();
      this.isEditMode = false;
      this.formTitle = 'Create Opportunity';
    }
  }

  populateForm(opportunityId: string) {
    this.opportunitiesService.getOpportunityById(opportunityId, true).subscribe((opportunity) => {
      this.opportunityForm.patchValue({
        opportunityId: opportunity.opportunityId,
        opportunityName: opportunity.opportunityName,
        accountId: opportunity.accountId,
        accountName: opportunity.account?.companyName,
        contactId: opportunity.contactId,
        contactName: opportunity.contact?.fullName,
        stageId: opportunity.stageId,
        status: opportunity.status,
        closedDate: opportunity.closedDate ? this.formatDateForInput(opportunity.closedDate) : null,
        expectedCloseDate: opportunity.expectedCloseDate ? this.formatDateForInput(opportunity.expectedCloseDate) : null,
        notes: opportunity.notes,
        opportunityOwnerId: opportunity.opportunityOwnerId ? Number(opportunity.opportunityOwnerId) : 0,
        opportunityOwnerName: opportunity.opportunityOwner?.Name,
      });
    });
  }

  loadUserList(_searchTerm: string = '') {
    const searchTerm = _searchTerm ? _searchTerm.trim() : '';
    const maxResults = 20;
    const skipCount = 0;
    this.userService.getUsers(searchTerm, maxResults, skipCount).subscribe((users) => {
      this.userList = users.map((user: any) => ({
        name: `${user.name}`,
        id: user.id,
        userName: user.userName,
      }));
    });
  }
  loadAccountList(_searchTerm: string = '') {
    const searchTerm = _searchTerm ? _searchTerm.trim() : '';
    const maxResults = 20;
    this.accountService
      .searchAccountsForAutocomplete(searchTerm, maxResults)
      .subscribe((accounts) => {
        this.accountList = accounts;
      });
  }
  loadOpportunityStages() {
    this.opportunitiesService.getOpportunityStages().subscribe((stages) => {
      this.opportunityStages = stages;
    });
  }
  loadAccountContacts(accountId: string, _searchTerm: string = '') {
    this.contactsService.searchContactsForAutocomplete(_searchTerm, 20, accountId).subscribe(contacts => {
      console.log('Loaded Contacts for Account ID', accountId, contacts);
      this.contactList = contacts;
    });
  }

  onSubmit() {
    // populate all validation and check
    this.opportunityForm.markAllAsTouched();
    if (this.opportunityForm.valid) {
      const formData = this.opportunityForm.value;
      this.formSubmit.emit(formData);
    }
  }

  closeForm() {
    this.formSubmit.emit(null);
    // destroy component instance if needed
    this.opportunityForm.reset();
    this.isEditMode = false;
    this.formTitle = 'Create Opportunity';
  }
  private formatDateForInput(isoString: string): string {
    const date = new Date(isoString);
    // Format to YYYY-MM-DDTHH:mm
    return date.toISOString().slice(0, 16);
  }
}

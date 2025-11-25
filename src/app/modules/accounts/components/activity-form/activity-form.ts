import { UserSelectionInput } from "@/shared/components/user-selection-input/user-selection-input";
import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountActivityTypesService } from '../../../admin/account-master/services/account-activity-types.service';
import { AccountActivityTypeMasterTypes } from '../../../admin/account-master/types/account-activity-types';
import { UsersService } from '../../../user/users.service';
import { AccountsService } from '../../accounts.service';
import { AccountActivitiesTypes } from '../../types';

@Component({
  selector: 'app-activity-form',
  imports: [ReactiveFormsModule, CommonModule, UserSelectionInput],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './activity-form.html',
  styleUrl: './activity-form.css',
})
export class ActivityForm {
  private userService = inject(UsersService);
  private accountService = inject(AccountsService);
  private accountActivitiesMasterService = inject(AccountActivityTypesService);
  private fb = inject(FormBuilder);

  @Input() activityId: string | null = null;
  @Input() accountId: string | null = null;
  @Input() relatedTo: string | null = AccountActivitiesTypes.AccountActivityRelatedToEnum.ACCOUNT;
  @Input() relatedEntityId: string | null = null;
  @Input() isEditMode: boolean = false;
  @Input() formTitle: string = 'Create Activity';
  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() resetFormEvent: boolean = false;

  userList: any[] = [];
  activityRelatedToOptions: string[] = Object.values(AccountActivitiesTypes.AccountActivityRelatedToEnum);
  activityTypes: AccountActivityTypeMasterTypes.AccountActivityType[] = [];
  activityForm = this.fb.group({
    activityId: [''],
    activityTypeId: ['', Validators.required],
    activityHeader: [this.getDefaultActivityHeader(AccountActivitiesTypes.AccountActivityDefaultTypes.EVENT), Validators.required],
    activityLog: ['', Validators.required],
    performedById: ['', Validators.required],
  });

  ngOnInit() {
    // load user list for contact owner selection
    this.loadUserList();
    // load activity types
    this.loadActivityTypes();
  }

  ngOnChanges(changes: SimpleChanges) {
    // keep reseting for any change in activityId input
    if (changes['activityId']) {
      // if activityId is provided, populate the form for editing
      if (this.activityId) {
        this.populateForm(this.activityId);
      }

      // load user list
      this.loadUserList();
    }

    // reset the form when resetFormEvent is true
    if (changes['resetFormEvent'] && this.resetFormEvent) {
      this.activityForm.reset();
      this.isEditMode = false;
      this.formTitle = 'Create Activity';
    }
  }

  populateForm(activityId: string) {
    // this.accountService.getActivityLog(activityId).subscribe((activity) => {
    //   // populate the form with activity data
    //   this.activityForm.patchValue({
    //     // map activity fields to form controls
    //   });
    // });
  }

  loadActivityTypes() {
    this.accountActivitiesMasterService.getAccountActivityTypes().subscribe((types) => {
      this.activityTypes = types;
    });
  }

  loadUserList(_searchTerm: string = '') {
    const searchTerm = _searchTerm ? _searchTerm.trim() : '';
    const maxResults = 20;
    const skipCount = 0;
    this.userService.getUsers(searchTerm, maxResults, skipCount).subscribe((users) => {
      this.userList = users.data;
    });
  }

  onSubmit() {
    // populate all validation and check
    this.activityForm.markAllAsTouched();
    // console log validation errors if any
    if (this.activityForm.valid) {
      const formData = this.activityForm.value;
      const emitData = {
        ...formData,
        relatedEntityId: this.relatedEntityId,
        relatedTo: this.relatedTo,
        accountId: this.accountId,

      };
      this.formSubmit.emit(emitData);
    }
  }

  closeForm() {
    this.formSubmit.emit(null);
    // destroy component instance if needed
    this.activityForm.reset();
    this.isEditMode = false;
    this.formTitle = 'Create Activity';
  }

  // a mapper to get activity header based on type
  getDefaultActivityHeader(type: string): string {
    switch (type) {
      case AccountActivitiesTypes.AccountActivityDefaultTypes.EVENT:
        return 'Logged an event';
      case AccountActivitiesTypes.AccountActivityDefaultTypes.NOTE:
        return 'Added a note';
      default:
        return '';
    }
  }

  onActivityTypeChange() {
    const activityType = this.activityForm.get('activityTypeId')?.value;
    if(!activityType) return;
    const defaultHeader = this.getDefaultActivityHeader(activityType);
    this.activityForm.patchValue({ activityHeader: defaultHeader });
  }
}

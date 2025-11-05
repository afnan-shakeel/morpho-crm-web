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
import { AutocompleteDirective } from '../../../../shared';
import { UsersService } from '../../../user/users.service';
import { AccountsService } from '../../accounts.service';
import { AccountActivityRelatedToEnum, AccountActivityTypeEnum } from '../../types';

@Component({
  selector: 'app-activity-form',
  imports: [ReactiveFormsModule, CommonModule, AutocompleteDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './activity-form.html',
  styleUrl: './activity-form.css',
})
export class ActivityForm {
  private userService = inject(UsersService);
  private accountService = inject(AccountsService);
  private fb = inject(FormBuilder);

  @Input() activityId: string | null = null;
  @Input() accountId: string | null = null;
  @Input() relatedTo: string | null = AccountActivityRelatedToEnum.ACCOUNT;
  @Input() relatedEntityId: string | null = null;
  @Input() isEditMode: boolean = false;
  @Input() formTitle: string = 'Create Activity';
  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() resetFormEvent: boolean = false;

  userList: any[] = [];
  activityRelatedToOptions: string[] = Object.values(AccountActivityRelatedToEnum);
  activityTypeOptions: string[] = Object.values(AccountActivityTypeEnum);
  activityForm = this.fb.group({
    activityId: [''],
    activityType: [AccountActivityTypeEnum.EVENT, Validators.required],
    activityHeader: [this.getDefaultActivityHeader(AccountActivityTypeEnum.EVENT), Validators.required],
    activityLog: ['', Validators.required],
    performedById: [0, Validators.required],
    performedByName: ['', Validators.required],
  });
  ngOnInit() {
    // load user list for contact owner selection
    this.loadUserList();
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

  onSubmit() {
    // populate all validation and check
    this.activityForm.markAllAsTouched();
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
      case AccountActivityTypeEnum.EVENT:
        return 'Logged an event';
      case AccountActivityTypeEnum.CALL:
        return 'Logged a call';
      case AccountActivityTypeEnum.EMAIL:
        return 'Sent an email';
      case AccountActivityTypeEnum.MEETING:
        return 'Scheduled a meeting';
      case AccountActivityTypeEnum.TASK:
        return 'Completed a task';
      case AccountActivityTypeEnum.NOTE:
        return 'Added a note';
      default:
        return '';
    }
  }

  onActivityTypeChange() {
    const activityType = this.activityForm.get('activityType')?.value;
    if(!activityType) return;
    const defaultHeader = this.getDefaultActivityHeader(activityType);
    this.activityForm.patchValue({ activityHeader: defaultHeader });
  }
}

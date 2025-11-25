import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountActivityTypeForm } from './account-activity-type-form';

describe('AccountActivityTypeForm', () => {
  let component: AccountActivityTypeForm;
  let fixture: ComponentFixture<AccountActivityTypeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountActivityTypeForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountActivityTypeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

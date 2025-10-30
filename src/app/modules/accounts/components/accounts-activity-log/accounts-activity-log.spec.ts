import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsActivityLog } from './accounts-activity-log';

describe('AccountsActivityLog', () => {
  let component: AccountsActivityLog;
  let fixture: ComponentFixture<AccountsActivityLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsActivityLog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsActivityLog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

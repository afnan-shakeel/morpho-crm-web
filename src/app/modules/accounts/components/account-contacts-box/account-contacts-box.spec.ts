import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountContactsBox } from './account-contacts-box';

describe('AccountContactsBox', () => {
  let component: AccountContactsBox;
  let fixture: ComponentFixture<AccountContactsBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountContactsBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountContactsBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

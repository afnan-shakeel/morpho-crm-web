import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsMain } from './accounts-main';

describe('AccountsMain', () => {
  let component: AccountsMain;
  let fixture: ComponentFixture<AccountsMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

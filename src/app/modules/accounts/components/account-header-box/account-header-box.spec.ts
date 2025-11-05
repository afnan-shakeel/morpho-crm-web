import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountHeaderBox } from './account-header-box';

describe('AccountHeaderBox', () => {
  let component: AccountHeaderBox;
  let fixture: ComponentFixture<AccountHeaderBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountHeaderBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountHeaderBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInfoBox } from './account-info-box';

describe('AccountInfoBox', () => {
  let component: AccountInfoBox;
  let fixture: ComponentFixture<AccountInfoBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountInfoBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountInfoBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

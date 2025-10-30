import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInfoStat } from './account-info-stat';

describe('AccountInfoStat', () => {
  let component: AccountInfoStat;
  let fixture: ComponentFixture<AccountInfoStat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountInfoStat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountInfoStat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

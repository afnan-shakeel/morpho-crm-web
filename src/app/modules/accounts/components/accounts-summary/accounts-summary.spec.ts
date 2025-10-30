import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsSummary } from './accounts-summary';

describe('AccountsSummary', () => {
  let component: AccountsSummary;
  let fixture: ComponentFixture<AccountsSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

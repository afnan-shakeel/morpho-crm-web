import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsListing } from './accounts-listing';

describe('AccountsListing', () => {
  let component: AccountsListing;
  let fixture: ComponentFixture<AccountsListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsListing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsListing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMasterListing } from './account-master-listing';

describe('AccountMasterListing', () => {
  let component: AccountMasterListing;
  let fixture: ComponentFixture<AccountMasterListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountMasterListing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountMasterListing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

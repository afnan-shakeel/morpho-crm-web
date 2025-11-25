import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsMasterListing } from './leads-master-listing';

describe('LeadsMasterListing', () => {
  let component: LeadsMasterListing;
  let fixture: ComponentFixture<LeadsMasterListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsMasterListing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsMasterListing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

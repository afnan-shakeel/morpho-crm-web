import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadListing } from './lead-listing';

describe('LeadListing', () => {
  let component: LeadListing;
  let fixture: ComponentFixture<LeadListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadListing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadListing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

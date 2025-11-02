import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityListing } from './opportunity-listing';

describe('OpportunityListing', () => {
  let component: OpportunityListing;
  let fixture: ComponentFixture<OpportunityListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityListing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpportunityListing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

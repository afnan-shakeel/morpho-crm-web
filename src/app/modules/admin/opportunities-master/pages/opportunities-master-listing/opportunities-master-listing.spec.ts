import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunitiesMasterListing } from './opportunities-master-listing';

describe('OpportunitiesMasterListing', () => {
  let component: OpportunitiesMasterListing;
  let fixture: ComponentFixture<OpportunitiesMasterListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunitiesMasterListing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpportunitiesMasterListing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

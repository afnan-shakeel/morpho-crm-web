import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadConversionReview } from './lead-conversion-review';

describe('LeadConversionReview', () => {
  let component: LeadConversionReview;
  let fixture: ComponentFixture<LeadConversionReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadConversionReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadConversionReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

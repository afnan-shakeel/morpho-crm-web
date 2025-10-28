import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSummaryBox } from './lead-summary-box';

describe('LeadSummaryBox', () => {
  let component: LeadSummaryBox;
  let fixture: ComponentFixture<LeadSummaryBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadSummaryBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadSummaryBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

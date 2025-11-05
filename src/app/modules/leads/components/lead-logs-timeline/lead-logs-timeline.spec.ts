import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadLogsTimeline } from './lead-logs-timeline';

describe('LeadLogsTimeline', () => {
  let component: LeadLogsTimeline;
  let fixture: ComponentFixture<LeadLogsTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadLogsTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadLogsTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadStatusChangeBox } from './lead-status-change-box';

describe('LeadStatusChangeBox', () => {
  let component: LeadStatusChangeBox;
  let fixture: ComponentFixture<LeadStatusChangeBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadStatusChangeBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadStatusChangeBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

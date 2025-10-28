import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadDetailView } from './lead-detail-view';

describe('LeadDetailView', () => {
  let component: LeadDetailView;
  let fixture: ComponentFixture<LeadDetailView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadDetailView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadDetailView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

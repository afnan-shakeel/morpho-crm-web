import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityStageProgress } from './opportunity-stage-progress';

describe('OpportunityStageProgress', () => {
  let component: OpportunityStageProgress;
  let fixture: ComponentFixture<OpportunityStageProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityStageProgress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpportunityStageProgress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunitySummary } from './opportunity-summary';

describe('OpportunitySummary', () => {
  let component: OpportunitySummary;
  let fixture: ComponentFixture<OpportunitySummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunitySummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpportunitySummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityForm } from './opportunity-form';

describe('OpportunityForm', () => {
  let component: OpportunityForm;
  let fixture: ComponentFixture<OpportunityForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpportunityForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

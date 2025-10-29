import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadInteractionForm } from './lead-interaction-form';

describe('LeadInteractionForm', () => {
  let component: LeadInteractionForm;
  let fixture: ComponentFixture<LeadInteractionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadInteractionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadInteractionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsInteractionTypesForm } from './leads-interaction-types-form';

describe('LeadsInteractionTypesForm', () => {
  let component: LeadsInteractionTypesForm;
  let fixture: ComponentFixture<LeadsInteractionTypesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsInteractionTypesForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsInteractionTypesForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

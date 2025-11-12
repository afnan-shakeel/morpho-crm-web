import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsSourceForm } from './leads-source-form';

describe('LeadsSourceForm', () => {
  let component: LeadsSourceForm;
  let fixture: ComponentFixture<LeadsSourceForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsSourceForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsSourceForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAddressForm } from './lead-address-form';

describe('LeadAddressForm', () => {
  let component: LeadAddressForm;
  let fixture: ComponentFixture<LeadAddressForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadAddressForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadAddressForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

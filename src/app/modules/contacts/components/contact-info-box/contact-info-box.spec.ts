import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInfoBox } from './contact-info-box';

describe('ContactInfoBox', () => {
  let component: ContactInfoBox;
  let fixture: ComponentFixture<ContactInfoBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactInfoBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactInfoBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

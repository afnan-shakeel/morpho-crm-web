import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMedium } from './modal-medium';

describe('ModalMedium', () => {
  let component: ModalMedium;
  let fixture: ComponentFixture<ModalMedium>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalMedium]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMedium);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

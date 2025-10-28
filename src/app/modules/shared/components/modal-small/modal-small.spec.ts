import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSmall } from './modal-small';

describe('ModalSmall', () => {
  let component: ModalSmall;
  let fixture: ComponentFixture<ModalSmall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSmall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSmall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

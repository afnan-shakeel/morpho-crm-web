import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalLarge } from './modal-large';


describe('ModalLarge', () => {
  let component: ModalLarge;
  let fixture: ComponentFixture<ModalLarge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalLarge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalLarge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

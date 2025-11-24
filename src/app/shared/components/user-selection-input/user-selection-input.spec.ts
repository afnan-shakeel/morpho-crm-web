import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectionInput } from './user-selection-input';

describe('UserSelectionInput', () => {
  let component: UserSelectionInput;
  let fixture: ComponentFixture<UserSelectionInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSelectionInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSelectionInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSearchSelectionInput } from './custom-search-selection-input';

describe('CustomSearchSelectionInput', () => {
  let component: CustomSearchSelectionInput;
  let fixture: ComponentFixture<CustomSearchSelectionInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSearchSelectionInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomSearchSelectionInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

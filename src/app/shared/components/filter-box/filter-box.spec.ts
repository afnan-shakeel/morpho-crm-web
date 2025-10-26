import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBox } from './filter-box';

describe('FilterBox', () => {
  let component: FilterBox;
  let fixture: ComponentFixture<FilterBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

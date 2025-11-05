import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadFilter } from './lead-filter';

describe('LeadFilter', () => {
  let component: LeadFilter;
  let fixture: ComponentFixture<LeadFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

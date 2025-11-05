import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadTable } from './lead-table';

describe('LeadTable', () => {
  let component: LeadTable;
  let fixture: ComponentFixture<LeadTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

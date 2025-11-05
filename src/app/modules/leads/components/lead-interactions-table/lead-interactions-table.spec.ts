import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadInteractionsTable } from './lead-interactions-table';

describe('LeadInteractionsTable', () => {
  let component: LeadInteractionsTable;
  let fixture: ComponentFixture<LeadInteractionsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadInteractionsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadInteractionsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

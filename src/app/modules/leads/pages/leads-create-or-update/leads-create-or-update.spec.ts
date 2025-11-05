import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsCreateOrUpdate } from './leads-create-or-update';

describe('LeadsCreateOrUpdate', () => {
  let component: LeadsCreateOrUpdate;
  let fixture: ComponentFixture<LeadsCreateOrUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsCreateOrUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsCreateOrUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

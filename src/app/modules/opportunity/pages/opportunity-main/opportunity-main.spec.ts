import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityMain } from './opportunity-main';

describe('OpportunityMain', () => {
  let component: OpportunityMain;
  let fixture: ComponentFixture<OpportunityMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpportunityMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

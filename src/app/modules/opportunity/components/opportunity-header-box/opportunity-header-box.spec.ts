import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityHeaderBox } from './opportunity-header-box';

describe('OpportunityHeaderBox', () => {
  let component: OpportunityHeaderBox;
  let fixture: ComponentFixture<OpportunityHeaderBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityHeaderBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpportunityHeaderBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

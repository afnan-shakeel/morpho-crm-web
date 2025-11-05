import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsListing } from './contacts-listing';

describe('ContactsListing', () => {
  let component: ContactsListing;
  let fixture: ComponentFixture<ContactsListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsListing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsListing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

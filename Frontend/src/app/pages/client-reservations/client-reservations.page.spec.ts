import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientReservationsPage } from './client-reservations.page';

describe('ClientReservationsPage', () => {
  let component: ClientReservationsPage;
  let fixture: ComponentFixture<ClientReservationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientReservationsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientReservationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

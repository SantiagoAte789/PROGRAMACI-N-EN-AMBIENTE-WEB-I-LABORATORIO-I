import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentReservationsPage } from './agent-reservations.page';

describe('AgentReservationsPage', () => {
  let component: AgentReservationsPage;
  let fixture: ComponentFixture<AgentReservationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentReservationsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentReservationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentEventsPage } from './agent-events.page';

describe('AgentEventsPage', () => {
  let component: AgentEventsPage;
  let fixture: ComponentFixture<AgentEventsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentEventsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

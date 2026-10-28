import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCreateEventPage } from './agent-create-event.page';

describe('AgentCreateEventPage', () => {
  let component: AgentCreateEventPage;
  let fixture: ComponentFixture<AgentCreateEventPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentCreateEventPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentCreateEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

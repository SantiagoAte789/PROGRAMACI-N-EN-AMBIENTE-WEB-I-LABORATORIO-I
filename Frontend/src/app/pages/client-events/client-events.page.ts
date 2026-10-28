import { Component, inject, OnInit } from '@angular/core';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { Event } from '../../interfaces/event.interface';
import { ClientService } from '../../services/client/client.service';

@Component({
  selector: 'app-client-events.page',
  imports: [EventCardComponent],
  templateUrl: './client-events.page.html',
  styleUrl: './client-events.page.scss',
})
export class ClientEventsPage implements OnInit {

  events: Event[] = [];
  clientService = inject(ClientService);

  ngOnInit(){
    this.clientService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;   
        console.log(this.events);
      },
      error: (error) => {
        console.error(error)
      },
    });
  }

}

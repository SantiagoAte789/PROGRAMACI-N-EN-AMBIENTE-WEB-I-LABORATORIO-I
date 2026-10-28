import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-agent.page',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './agent.page.html',
  styleUrl: './agent.page.scss',
})
export class AgentPage {

}

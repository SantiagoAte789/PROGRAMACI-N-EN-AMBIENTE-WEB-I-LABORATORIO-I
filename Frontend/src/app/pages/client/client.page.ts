import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-client.page',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './client.page.html',
  styleUrl: './client.page.scss',
})
export class ClientPage {

}

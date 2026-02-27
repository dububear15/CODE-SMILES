import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServicesComponent } from '../services/services';
import { AboutComponent } from '../about/about'; // 1. Import it
import { ContactComponent } from '../contact/contact';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    ServicesComponent, 
    AboutComponent, // 2. Add it to this list
    ContactComponent,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {}
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // 1. Add this import

@Component({
  selector: 'app-header',
  standalone: true, // 2. Add this line
  imports: [RouterLink], // 3. Add RouterLink here
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // Logic goes here
}
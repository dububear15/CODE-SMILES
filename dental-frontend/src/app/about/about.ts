import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // 1. Import the routing tool
import { CommonModule } from '@angular/common'; // 2. Good practice for standalone components

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink // 3. Add RouterLink here so your HTML knows what it is
  ],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class AboutComponent {}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  user = { full_name: '', email: '', password: '' };

  onSubmit() {
    console.log("Creating account for:", this.user.email);
    // Logic to send to dental-backend goes here later!
  }
}
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  sidebarOpen = false;  // Sidebar visible by default
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}

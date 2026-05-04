import { Component, inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  sidebarOpen = false; // Sidebar visible by default
  theme: 'light' | 'dark' = 'light';
  private readonly document = inject(DOCUMENT);

  ngOnInit(): void {
    this.theme = (localStorage.getItem('app-theme') as 'light' | 'dark') ?? 'light';
    this.setTheme(this.theme);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleTheme() {
    this.setTheme(this.theme === 'light' ? 'dark' : 'light');
  }

  private setTheme(theme: 'light' | 'dark') {
    this.theme = theme;
    this.document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }
}

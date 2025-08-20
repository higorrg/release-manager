import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="header">
      <h1>Release Manager</h1>
    </header>
    <main class="main-content">
      <nav class="sidebar">
        <a routerLink="/dashboard">Dashboard</a>
        <!-- Other links can go here -->
      </nav>
      <section class="content">
        <router-outlet />
      </section>
    </main>
  `,
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {}

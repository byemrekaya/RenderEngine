import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <nav class="nav">
        <div class="logo">
          <a routerLink="/">RenderEngine</a>
        </div>
        <ul class="nav-links">
          <li><a routerLink="/dashboard">Dashboard</a></li>
          <li><a routerLink="/settings">Settings</a></li>
        </ul>
      </nav>
    </header>
  `,
  styles: [
    `
      .header {
        background: var(--primary-color);
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
      }
      .logo a {
        color: white;
        text-decoration: none;
        font-size: 1.5rem;
        font-weight: bold;
      }
      .nav-links {
        display: flex;
        gap: 1rem;
        list-style: none;
      }
      .nav-links a {
        color: white;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    `,
  ],
})
export class HeaderComponent {}

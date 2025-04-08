import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <a routerLink="/dashboard" routerLinkActive="active">
              <i class="fas fa-home"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/projects" routerLinkActive="active">
              <i class="fas fa-project-diagram"></i>
              <span>Projects</span>
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/settings" routerLinkActive="active">
              <i class="fas fa-cog"></i>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        width: 250px;
        background: var(--light-color);
        height: 100%;
        padding: 1rem;
        border-right: 1px solid #eee;
      }
      .nav-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .nav-item {
        margin-bottom: 0.5rem;
        a {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          color: var(--dark-color);
          text-decoration: none;
          border-radius: 4px;
          transition: background-color 0.3s;
          &:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }
          &.active {
            background-color: var(--primary-color);
            color: white;
          }
        }
        i {
          margin-right: 0.75rem;
        }
      }
    `,
  ],
})
export class SidebarComponent {}

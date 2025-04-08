import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationService } from '@services/navigation.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="layout-container">
      <header class="banner">
        <div class="logo"></div>
      </header>

      <main class="content">
        <router-outlet></router-outlet>
        <nav class="navigation">
          <button (click)="navigationService.goBack()" class="nav-button">
            Back
          </button>
          <button (click)="navigationService.goNext()" class="nav-button">
            Next
          </button>
        </nav>
        <div
          *ngIf="(navigationService.getErrors() | async)?.length"
          class="navigation-errors"
        >
          <p
            *ngFor="let error of navigationService.getErrors() | async"
            class="error-message"
          >
            {{ error }}
          </p>
        </div>
      </main>

      <footer class="footer">
        <p>© 2024 Render Engine. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      }

      .layout-container {
        display: flex;
        flex-direction: column;
        min-height: inherit;
      }

      .banner {
        background-color: #2c3e50;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .logo {
        height: 60px;
        width: 60px;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
      }

      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        max-width: 800px;
        margin: 2rem auto;
        padding: 0 1rem;
      }

      .navigation {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
      }

      .nav-button {
        padding: 0.5rem 1.5rem;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
      }

      .nav-button:hover {
        background-color: #2980b9;
      }

      .navigation-errors {
        margin-top: 1rem;
        padding: 1rem;
        background-color: #fee;
        border-radius: 4px;
        color: #dc3545;
      }

      .error-message {
        margin: 0.25rem 0;
        font-size: 0.875rem;
      }

      .footer {
        background-color: #34495e;
        color: white;
        padding: 1rem;
        text-align: center;
      }
    `,
  ],
})
export class LayoutComponent {
  constructor(public navigationService: NavigationService) {}
}

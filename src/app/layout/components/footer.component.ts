import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>RenderEngine</h4>
          <p>&copy; 2024 All rights reserved</p>
        </div>
        <div class="footer-section">
          <h4>Links</h4>
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background: var(--dark-color);
        color: white;
        padding: 2rem 0;
        margin-top: auto;
      }
      .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        padding: 0 1rem;
      }
      .footer-section {
        h4 {
          margin-bottom: 1rem;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        a {
          color: white;
          text-decoration: none;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    `,
  ],
})
export class FooterComponent {}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly routes = ['type', 'age'];

  constructor(private router: Router) {}

  goNext(): void {
    const currentIndex = this.getCurrentRouteIndex();
    const nextIndex = (currentIndex + 1) % this.routes.length;
    this.router.navigate([this.routes[nextIndex]]);
  }

  goBack(): void {
    const currentIndex = this.getCurrentRouteIndex();
    const previousIndex =
      currentIndex === 0 ? this.routes.length - 1 : currentIndex - 1;
    this.router.navigate([this.routes[previousIndex]]);
  }

  private getCurrentRouteIndex(): number {
    const currentPath = this.router.url.split('/')[1] || this.routes[0];
    return this.routes.indexOf(currentPath);
  }
}

import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { routes } from '../../app.routes';

export interface NavigationState {
  canProceed: boolean;
  errors?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private navigationState = new BehaviorSubject<NavigationState>({
    canProceed: false,
  });

  constructor(private router: Router) {}

  getNavigationState(): Observable<NavigationState> {
    return this.navigationState.asObservable();
  }

  getCanProceed(): Observable<boolean> {
    return this.navigationState.pipe(map((state) => state.canProceed));
  }

  getErrors(): Observable<string[] | undefined> {
    return this.navigationState.pipe(map((state) => state.errors));
  }

  setNavigationState(state: NavigationState): void {
    this.navigationState.next(state);
  }

  async goNext(): Promise<boolean> {
    const currentState = this.navigationState.value;

    if (!currentState.canProceed) {
      this.setNavigationState({
        canProceed: false,
        errors: ['Please make a selection'],
      });
      return false;
    }

    this.setNavigationState({
      canProceed: true,
      errors: undefined,
    });

    const currentIndex = this.getCurrentRouteIndex();
    const nextIndex = (currentIndex + 1) % this.getAvailableRoutes().length;
    return this.router.navigate([this.getAvailableRoutes()[nextIndex]]);
  }

  async goBack(): Promise<boolean> {
    const currentIndex = this.getCurrentRouteIndex();
    const availableRoutes = this.getAvailableRoutes();
    const previousIndex =
      currentIndex === 0 ? availableRoutes.length - 1 : currentIndex - 1;
    return this.router.navigate([availableRoutes[previousIndex]]);
  }

  private getCurrentRouteIndex(): number {
    const currentPath =
      this.router.url.split('/')[1] || this.getAvailableRoutes()[0];
    return this.getAvailableRoutes().indexOf(currentPath);
  }

  private getAvailableRoutes(): string[] {
    const layoutRoutes =
      routes.find((route: Route) => route.path === '')?.children || [];
    return layoutRoutes
      .filter((route: Route) => route.path && !route.redirectTo)
      .map((route: Route) => route.path || '');
  }
}

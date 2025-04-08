import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface NavigationState {
  canProceed: boolean;
  errors?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly routes = ['type', 'age'];
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

    // Hata mesajlarını temizle
    this.setNavigationState({
      canProceed: true,
      errors: undefined,
    });

    const currentIndex = this.getCurrentRouteIndex();
    const nextIndex = (currentIndex + 1) % this.routes.length;
    return this.router.navigate([this.routes[nextIndex]]);
  }

  async goBack(): Promise<boolean> {
    const currentIndex = this.getCurrentRouteIndex();
    const previousIndex =
      currentIndex === 0 ? this.routes.length - 1 : currentIndex - 1;
    return this.router.navigate([this.routes[previousIndex]]);
  }

  private getCurrentRouteIndex(): number {
    const currentPath = this.router.url.split('/')[1] || this.routes[0];
    return this.routes.indexOf(currentPath);
  }
}

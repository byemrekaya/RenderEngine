import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideStore } from '@ngrx/store';
import { appReducer } from './app/store/reducers/app.reducer';
import { provideHttpClient } from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideState } from '@ngrx/store';

const initialState = localStorage.getItem('app')
  ? JSON.parse(localStorage.getItem('app')!)
  : { type: null, age: null, userInfo: null };

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideStore(),
    provideState('app', appReducer, { initialState }),
    provideHttpClient(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
    }),
  ],
}).catch((err) => console.error(err));

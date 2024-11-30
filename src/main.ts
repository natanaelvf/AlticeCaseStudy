import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      {
        path: 'city-form',
        loadComponent: () =>
          import('./app/features/weather/components/city-form/city-form.component').then((m) => m.CityFormComponent),
      },
      {
        path: 'city-list',
        loadComponent: () =>
          import('./app/features/weather/components/city-list/city-list.component').then((m) => m.CityListComponent),
      },
      { path: '', redirectTo: 'city-form', pathMatch: 'full' },
      { path: '**', redirectTo: 'city-form', pathMatch: 'full' }, // Catch-all route
    ]),
    importProvidersFrom(BrowserAnimationsModule, HttpClientModule),
  ],
}).catch((err) => console.error(err));

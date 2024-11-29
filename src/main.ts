import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: 'form', loadComponent: () => import('./app/features/weather/components/form/form.component').then(m => m.FormComponent) },
      { path: 'cities', loadComponent: () => import('./app/features/weather/components/list/list.component').then(m => m.ListComponent) },
      { path: '', redirectTo: 'form', pathMatch: 'full' },
    ]),
    importProvidersFrom(BrowserAnimationsModule),
  ],
}).catch((err) => console.error(err));

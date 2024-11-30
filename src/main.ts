import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from './app/app-translate-loader.module';
import { AppComponent } from './app/app.component';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      {
        path: 'home',
        loadComponent: () =>
          import('./app/home/home.component').then((m) => m.HomeComponent),
      },
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
    ]),
    importProvidersFrom(
      TranslateModule,
      HttpClientModule,
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'), // Dynamically import echarts
      })
    ),
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: {
        echarts: () => import('echarts'),
      },
    },
  ],
}).catch((err) => console.error(err));

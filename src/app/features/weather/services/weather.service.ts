import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly apiEndpoint = `https://crudcrud.com/api/${environment.apiKey}/weather-data`;
  private cachedData: any[] | null = null; // Store cached data

  constructor(private http: HttpClient) {}

  createWeatherData(data: any): Observable<any> {
    return this.http.post(this.apiEndpoint, data);
  }

  getWeatherData(): Observable<any[]> {
    if (this.cachedData) {
      return of(this.cachedData);
    }

    // Fetch data from the server and cache it
    return this.http.get<any[]>(this.apiEndpoint).pipe(
      tap((data) => {
        this.cachedData = data; // Cache the data
      })
    );
  }

  clearCache(): void {
    this.cachedData = null;
  }
}

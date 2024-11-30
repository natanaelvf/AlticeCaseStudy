import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly apiEndpoint = `https://crudcrud.com/api/${environment.apiKey}/weather-data`;

  constructor(private http: HttpClient) {}

  createWeatherData(data: any): Observable<any> {
    return this.http.post(this.apiEndpoint, data);
  }

  getWeatherData(): Observable<any> {
    return this.http.get(this.apiEndpoint);
  }
}

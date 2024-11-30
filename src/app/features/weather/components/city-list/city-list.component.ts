import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';

@Component({
  standalone: true,
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
  imports: [CommonModule],
})
export class CityListComponent implements OnInit {
  cities: any[] = [];
  expandedCities: Set<number> = new Set(); // Using set to track expanded cities by index

  constructor(private WeatherService: WeatherService) {}

  ngOnInit() {
    this.WeatherService.getWeatherData().subscribe({
      next: (response) => {
        console.log(response);
        this.cities = response;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });
  }

  toggleCityDetails(index: number) {
    if (this.expandedCities.has(index)) {
      this.expandedCities.delete(index); // Collapse the city
    } else {
      this.expandedCities.add(index); // Expand the city
    }
  }

  isCityExpanded(index: number): boolean {
    return this.expandedCities.has(index); // Check if city is expanded
  }
}

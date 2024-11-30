import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';

interface CityRecord {
  cityName: string;
  temperature: number;
  temperatureUnit: string;
  raining: boolean;
  date: string;
  networkPower: number;
  altitude: number;
}

@Component({
  standalone: true,
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
  imports: [CommonModule],
})
export class CityListComponent implements OnInit {
  cities: CityRecord[] = [];
  groupedCities: Map<string, CityRecord[]> = new Map();
  expandedCities: Set<string> = new Set();

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.weatherService.getWeatherData().subscribe({
      next: (response: CityRecord[]) => {
        this.cities = response;
        this.groupCitiesByName();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });
  }

  groupCitiesByName() {
    this.groupedCities.clear();
    for (const city of this.cities) {
      if (!this.groupedCities.has(city.cityName)) {
        this.groupedCities.set(city.cityName, []);
      }
      this.groupedCities.get(city.cityName)!.push(city);
    }
  }

  toggleCityDetails(cityName: string) {
    if (this.expandedCities.has(cityName)) {
      this.expandedCities.delete(cityName);
    } else {
      this.expandedCities.add(cityName);
    }
  }

  isCityExpanded(cityName: string): boolean {
    return this.expandedCities.has(cityName);
  }

  getLowestTemperature(cityRecords: CityRecord[]): CityRecord {
    return cityRecords.reduce((lowest, current) => (current.temperature < lowest.temperature ? current : lowest), cityRecords[0]);
  }

  getHighestTemperature(cityRecords: CityRecord[]): CityRecord {
    return cityRecords.reduce((highest, current) => (current.temperature > highest.temperature ? current : highest), cityRecords[0]);
  }

  getLowestNetworkPower(cityRecords: CityRecord[]): CityRecord {
    return cityRecords.reduce((lowest, current) => (current.networkPower < lowest.networkPower ? current : lowest), cityRecords[0]);
  }

  refreshData(): void {
    this.weatherService.clearCache();
    this.weatherService.getWeatherData().subscribe({
      next: (response) => {
        this.cities = response;
        this.groupCitiesByName();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });
  }
}

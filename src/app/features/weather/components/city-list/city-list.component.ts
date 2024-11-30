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

interface WorstRegistries {
  lowestTemperature: CityRecord;
  highestTemperature: CityRecord;
  lowestNetworkPower: CityRecord;
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
  worstRegistries: Map<string, WorstRegistries> = new Map(); // Cache for worst registries
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
    this.worstRegistries.clear(); // Reset the cache for worst registries

    for (const city of this.cities) {
      if (!this.groupedCities.has(city.cityName)) {
        this.groupedCities.set(city.cityName, []);
      }
      this.groupedCities.get(city.cityName)!.push(city);
    }

    // Precompute worst registries for each group
    this.groupedCities.forEach((records, cityName) => {
      this.worstRegistries.set(cityName, this.getWorstRegistries(records));
    });
  }

  getWorstRegistries(cityRecords: CityRecord[]): WorstRegistries {
    const lowestTemperature = cityRecords.reduce((lowest, current) =>
      current.temperature < lowest.temperature ? current : lowest
    );
    const highestTemperature = cityRecords.reduce((highest, current) =>
      current.temperature > highest.temperature ? current : highest
    );
    const lowestNetworkPower = cityRecords.reduce((lowest, current) =>
      current.networkPower < lowest.networkPower ? current : lowest
    );

    return { lowestTemperature, highestTemperature, lowestNetworkPower };
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

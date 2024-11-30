import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { NgxEchartsModule } from 'ngx-echarts';

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
  imports: [CommonModule, NgxEchartsModule], // Add NgxEchartsModule here
})
export class CityListComponent implements OnInit {
  cities: CityRecord[] = [];
  groupedCities: Map<string, CityRecord[]> = new Map();
  worstRegistries: Map<string, WorstRegistries> = new Map(); // Cache for worst registries
  expandedCities: Set<string> = new Set();

  // ECharts options
  temperatureGraphOptions: Map<string, any> = new Map();
  networkPowerGraphOptions: Map<string, any> = new Map();

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
    this.temperatureGraphOptions.clear();
    this.networkPowerGraphOptions.clear();

    for (const city of this.cities) {
      if (!this.groupedCities.has(city.cityName)) {
        this.groupedCities.set(city.cityName, []);
      }
      this.groupedCities.get(city.cityName)!.push(city);
    }

    // Precompute worst registries and graph data for each group
    this.groupedCities.forEach((records, cityName) => {
      this.worstRegistries.set(cityName, this.getWorstRegistries(records));
      this.prepareGraphOptions(cityName, records);
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

  prepareGraphOptions(cityName: string, records: CityRecord[]) {
    // There's definitely a way to implement this with both Celsius and Fahrenheit, but this already took too long
    const sortedRecords = records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    this.temperatureGraphOptions.set(cityName, {
      xAxis: {
        type: 'category',
        data: sortedRecords.map((record) => new Date(record.date).toLocaleDateString()),
        axisLabel: { fontSize: 25, color: 'white' },
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 25, color: 'white' },
      },
      series: [
        {
          data: sortedRecords.map((record) => record.temperature),
          type: 'line',
          smooth: false,
          name: 'Temperature (°C)',
          lineStyle: { color: 'blue' },
        },
      ],
      tooltip: {
        trigger: 'axis',
        textStyle: { fontSize: 25, color: 'white' },
      },
      legend: {
        textStyle: { fontSize: 35, color: 'white' },
      },
    });

    this.networkPowerGraphOptions.set(cityName, {
      xAxis: {
        type: 'category',
        data: sortedRecords.map((record) => new Date(record.date).toLocaleDateString()),
        axisLabel: { fontSize: 25, color: 'white' },
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 25, color: 'white' },
      },
      series: [
        {
          data: sortedRecords.map((record) => record.networkPower),
          type: 'line',
          smooth: false,
          name: 'Network Power',
          lineStyle: { color: 'green' },
        },
      ],
      tooltip: {
        trigger: 'axis',
        textStyle: { fontSize: 25, color: 'white' },
      },
      legend: {
        textStyle: { fontSize: 40, color: 'white' },
      },
    });
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

  getConstrainedWidth(calculatedWidth: number): number {
    return Math.min(2500, Math.max(1000, calculatedWidth));
  }
}

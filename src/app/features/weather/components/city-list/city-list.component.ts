import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { NgxEchartsModule } from 'ngx-echarts';
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe';

interface CityRecord {
  cityName: string;
  temperature: number;
  temperatureUnit: string;
  timezone: string;
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
  imports: [CommonModule, NgxEchartsModule, FormatDatePipe],
})
export class CityListComponent implements OnInit {

  cities: CityRecord[] = [];
  groupedCities: Map<string, CityRecord[]> = new Map();
  worstRegistries: Map<string, WorstRegistries> = new Map(); // Cache for worst registries
  expandedCities: Set<string> = new Set();
  selectedTemperatureUnit: string = 'C';
  selectedTimezone: string = 'UTC';

  temperatureGraphOptions: Map<string, any> = new Map();
  networkPowerGraphOptions: Map<string, any> = new Map();

  constructor(private weatherService: WeatherService, private cdr: ChangeDetectorRef) {}

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
    const sortedRecords = records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    this.temperatureGraphOptions.set(cityName, {
      xAxis: {
        type: 'category',
        data: sortedRecords.map((record) => record.date),
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
          name: `Temperature (°${this.selectedTemperatureUnit})`,
          lineStyle: { color: 'white' },
        },
      ],
      tooltip: {
        trigger: 'axis',
        textStyle: { fontSize: 25, color: 'black' },
      },
      legend: {
        textStyle: { fontSize: 35, color: 'white' },
      },
    });

    this.networkPowerGraphOptions.set(cityName, {
      xAxis: {
        type: 'category',
        data: sortedRecords.map((record) => record.date),
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
          lineStyle: { color: 'white' },
        },
      ],
      tooltip: {
        trigger: 'axis',
        textStyle: { fontSize: 25, color: 'black' },
      },
      legend: {
        textStyle: { fontSize: 40, color: 'white' },
      },
    });

    this.cdr.detectChanges();
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

  changeTemperatureUnit(temperatureUnit: string) {
    this.selectedTemperatureUnit = temperatureUnit;
    this.updateRecords();
  }

  changeTimezone(timezone: string) {
    this.selectedTimezone = timezone;
    this.updateRecords();
  }

  convertTemperature(temp: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return parseFloat(temp.toFixed(2));
    return fromUnit === 'C'
      ? parseFloat((temp * (9 / 5) + 32).toFixed(2))
      : parseFloat(((temp - 32) * (5 / 9)).toFixed(2));
  }

  convertDate(date: string): string {
    const localDate = new Date(date).toLocaleString('en-US', {
      timeZone: this.selectedTimezone,
    });
    return formatDate(new Date(localDate), 'yyyy-MM-dd HH:mm', 'en-US');
  }

  updateRecords(): void {
    this.groupedCities.forEach((records, cityName) => {
      records.forEach((record) => {
        record.temperature = this.convertTemperature(
          record.temperature,
          record.temperatureUnit,
          this.selectedTemperatureUnit
        );
        record.temperatureUnit = this.selectedTemperatureUnit;

        record.date = this.convertDate(record.date);
        record.timezone = this.selectedTimezone;
      });

      this.worstRegistries.set(cityName, this.getWorstRegistries(records));
      this.prepareGraphOptions(cityName, records);
    });

    this.cdr.detectChanges();
  }

}

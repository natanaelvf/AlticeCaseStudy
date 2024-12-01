import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-form',
  templateUrl: './city-form.component.html',
  styleUrls: ['./city-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
})
export class CityFormComponent {
  weatherForm: FormGroup;
  formSubmitted = false;
  submissionSuccess = false;

  constructor(private fb: FormBuilder, private weatherService: WeatherService) {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16); // Slice up to minutes

    this.weatherForm = this.fb.group({
      cityName: ['', Validators.required],
      temperature: ['', [Validators.required, this.validateTemperature.bind(this)]],
      temperatureUnit: ['C', Validators.required],
      raining: ['', Validators.required],
      date: [formattedDate, Validators.required],
      networkPower: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      altitude: ['', Validators.required],
    });
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.weatherForm.valid) {
      const formData = this.weatherForm.value;

      this.weatherService.createWeatherData(formData).subscribe({
        next: () => {
          console.log('Data successfully uploaded.');
          this.submissionSuccess = true;
          alert('Form Submitted Successfully!');
        },
        error: (error) => {
          console.error('Error uploading data:', error);
          this.submissionSuccess = false;
          alert('Error submitting form: ' + error.status);
        },
      });
    } else {
      console.error('Form is invalid. Please fill in all required fields correctly.');
    }
  }

  validateTemperature(control: any) {
    const temperature = control.value;
    const unit = this.weatherForm?.get('temperatureUnit')?.value;

    if (temperature == '') {
      return { invalidTemperature: true };
    }

    if (unit === 'F') {
      const convertedTemp = (temperature - 32) * (5 / 9);
      if (convertedTemp < -100 || convertedTemp > 70) {
        return { invalidTemperature: true };
      }
    } else if (unit === 'C') {
      if (temperature < -100 || temperature > 70) {
        return { invalidTemperature: true };
      }
    }

    return null;
  }
}

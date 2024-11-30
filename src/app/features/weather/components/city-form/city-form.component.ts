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
export class FormComponent {
  weatherForm: FormGroup;
  formSubmitted = false;
  submissionSuccess = false;

  constructor(private fb: FormBuilder, private weatherService: WeatherService) {
    this.weatherForm = this.fb.group({
      cityName: ['', Validators.required],
      temperature: ['', [Validators.required, Validators.min(-100), Validators.max(70)]],
      raining: ['', Validators.required],
      date: ['', Validators.required],
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
        },
        error: (error) => {
          console.error('Error uploading data:', error);
          this.submissionSuccess = false;
          alert(error.status);
        },
      });
    } else {
      console.error('Form is invalid. Please fill in all required fields correctly.');
    }
  }
}

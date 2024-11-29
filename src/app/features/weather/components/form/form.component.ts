import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class FormComponent {
  weatherForm: FormGroup;
  formSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.weatherForm = this.fb.group({
      city: ['', Validators.required],
      temperature: ['', [Validators.required, Validators.pattern('^-?[0-9]+$')]],
      raining: ['', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      networkPower: [
        '',
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      altitude: ['', Validators.required],
    });
  }

  // Handle form submission
  onSubmit() {
    this.formSubmitted = true;
    if (this.weatherForm.valid) {
      console.log('Form submitted successfully:', this.weatherForm.value);
      // Handle successful form submission (e.g., save the data)
    }
  }
}

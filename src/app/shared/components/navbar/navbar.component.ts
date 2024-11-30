import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, RouterLink],
})
export class NavbarComponent {
  languageDropdownOpen = false;
  timezoneDropdownOpen = false;

  toggleLanguageDropdown() {
    this.languageDropdownOpen = !this.languageDropdownOpen;
  }

  toggleTimezoneDropdown() {
    this.timezoneDropdownOpen = !this.timezoneDropdownOpen;
  }

  changeLanguage(language: string) {
    console.log(`Language set to: ${language}`);
  }

  changeTimezone(timezone: string) {
    console.log(`Timezone set to: ${timezone}`);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, RouterLink],
})
export class NavbarComponent implements OnInit {
  languageDropdownOpen = false;
  showNavbar = true;

  toggleLanguageDropdown() {
    this.languageDropdownOpen = !this.languageDropdownOpen;
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url; // Get the current route
      this.showNavbar = currentUrl !== '/' && currentUrl !== '/home'; // Hide for '' and 'home'
    });
  }
}

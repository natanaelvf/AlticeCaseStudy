import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, RouterLink, TranslateModule],
})

export class HomeComponent {
  constructor(private translate: TranslateService) {
    // Set the default language
    this.translate.setDefaultLang('en');
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang); // Dynamically switch language
  }
}

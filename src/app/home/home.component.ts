import { Component } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [TranslateModule, CommonModule],
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

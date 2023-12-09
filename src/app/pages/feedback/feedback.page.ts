import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  constructor(private translate: TranslateService) {


    let settings = JSON.parse(localStorage.getItem('settings') || '{}');

    if (settings.darkMode) {
      document.body.setAttribute('color-theme', 'dark');
    }
    else{
      document.body.setAttribute('color-theme', 'light');
    }

    this.translate.use(settings.language); 

   }

  ngOnInit() {
  }

  usedLanguage(){
    return this.translate.currentLang;
  }

}

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from 'src/app/models/settings';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  constructor(private translate: TranslateService) {
    
    let settings = new Settings();
    settings.initPage(translate);

   }

  ngOnInit() {
  }

  usedLanguage(){
    return this.translate.currentLang;
  }

}

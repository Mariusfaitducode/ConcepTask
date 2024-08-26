import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from 'src/app/models/settings';
import { SettingsService } from 'src/app/services/settings/settings.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  constructor(
    private translate: TranslateService,
    private settingsService : SettingsService,
  ) {
    
    // let settings = new Settings();
    // settings.initPage(translate);

    this.settingsService.initPage(this.translate);

   }

  ngOnInit() {
  }

  usedLanguage(){
    return this.translate.currentLang;
  }

}

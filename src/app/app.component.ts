import { Component } from '@angular/core';
import { Notif } from './models/notif';
import { TranslateService } from '@ngx-translate/core';
import { ItemReorderEventDetail, MenuController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { WelcomeTodo } from './models/welcome-todo';
import { SettingsService } from './services/settings/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private translate: TranslateService,
    private menuCtrl : MenuController,
    private route : ActivatedRoute,
    private settingsService : SettingsService
  ) {


    // INITIALISATION APP SETTINGS
    
    this.settingsService.initSettingsOnAppStart();
    
    
  }
}

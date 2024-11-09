import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../services/settings/settings.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(
    private settingsService : SettingsService,
    public translate : TranslateService,
  ) { }

  ngOnInit() {
    this.settingsService.initPage(this.translate);
    
  }

}

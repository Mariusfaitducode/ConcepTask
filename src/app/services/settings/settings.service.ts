import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Settings } from 'src/app/models/settings';
import { User } from 'src/app/models/user';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  user : User | null = null;
  settings : Settings = new Settings();

  // private settingsSubject = new BehaviorSubject<Settings>(new Settings());
  // settings$: Observable<Settings> = this.settingsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private userService : UserService
  ) { }


  setUserSettings(user : User){
    this.user = user;

    if (user.settings){
      this.settings = user.settings;
      localStorage.setItem('settings', JSON.stringify(this.settings));
    }
    this.applySettings();

  }

  updateSettings(user : User | null, settings : Settings){

    settings = JSON.parse(JSON.stringify(settings));

    if (user){
      user.settings = settings;
      this.userService.updateUser(user, null);
    }
    this.settings = settings;
    localStorage.setItem('settings', JSON.stringify(this.settings));

    this.applySettings();

  }


  async initSettingsOnAppStart(){

    console.log('initSettingsOnAppStart');
 
    this.settings = JSON.parse(localStorage.getItem('settings') || 'null');

    if (this.settings === null){
      console.log('settings is null : load settings');
      // this.loadInitialSettings();
      this.settings = new Settings();
      localStorage.setItem('settings', JSON.stringify(this.settings));
      // this.applySettings();
    }
    this.applySettings();
    
  }


  applySettings(){

    console.log('apply settings');
 
    this.translate.setDefaultLang(this.settings.language);
    this.translate.use(this.settings.language); 
 
 
    if (this.settings.darkMode) {
      document.body.setAttribute('color-theme', 'dark');
    }
    else{
      document.body.setAttribute('color-theme', 'light');
    }

    if (this.settings.themeColor){
      const style = document.createElement('style');
      style.innerHTML = `
        :root {
          --ion-color-primary: ${this.settings.themeColor};
          --ion-color-primary-contrast: #ffffff;
          --ion-color-primary-shade: mix(black, var(--ion-color-primary), 15%);
          --ion-color-primary-tint: mix(white, var(--ion-color-primary), 15%);
        }
      `;
      document.head.appendChild(style);
    }
  }



  // TODO : verify if needed
  initPage(translate : TranslateService){

    if (this.settings.darkMode) {
        document.body.setAttribute('color-theme', 'dark');
    }
    else{
        document.body.setAttribute('color-theme', 'light');
    }
  
    translate.use(this.settings.language); 
  }


  getLocalSettings(){
    return this.settings;
  }
}

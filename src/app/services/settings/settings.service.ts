import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, tap } from 'rxjs';
import { Settings } from 'src/app/models/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {


  settings : Settings = new Settings();

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
  ) { }


  loadInitialSettings(): Observable<Settings> {
    return this.http.get<Settings>('/assets/initialisation/settings.json').pipe(
      tap(settings => {

        console.log(settings)
        this.settings = settings;
        localStorage.setItem('settings', JSON.stringify(settings));
        this.applySettings();
      })
    );
  }


  async initSettingsOnAppStart(){

    console.log('initSettingsOnAppStart');
 
    this.settings = JSON.parse(localStorage.getItem('settings') || 'null');

    if (this.settings === null){

      console.log('settings is null : load settings');

      this.loadInitialSettings();

    }
    else{
      this.applySettings();
    }
 
    
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
  initPage(  translate : TranslateService){

    if (this.settings.darkMode) {
        document.body.setAttribute('color-theme', 'dark');
    }
    else{
        document.body.setAttribute('color-theme', 'light');
    }
  
    translate.use(this.settings.language); 
}
}

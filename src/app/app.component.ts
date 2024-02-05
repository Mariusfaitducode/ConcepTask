import { Component } from '@angular/core';
import { Notif } from './models/notif';
import { TranslateService } from '@ngx-translate/core';
import { ItemReorderEventDetail, MenuController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { WelcomeTodo } from './models/welcome-todo';

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
  ) {


    // INITIALISATION APP SETTINGS

    // Categories colors
    let categories = JSON.parse(localStorage.getItem('categories') || '[]');
    if (categories.length === 0){
      categories = [
        {
          id: 0,
          name: 'Task',
          color: '#e83c53',
        },
        {
          id: 1,
          name: 'Project',
          color: '#428cff',
        },
        {
          id: 2,
          name: 'Work',
          color: '#ffd948',
        },
        {
          id: 3,
          name: 'Personal',
          color: '#29c467',
        },
        {
          id: 4,
          name: 'Event',
          color: '#5d58e0',
        },
      ];
      localStorage.setItem('categories', JSON.stringify(categories));
    }

    let settings = JSON.parse(localStorage.getItem('settings') || '{}');

    console.log(settings)


    // Welcome Todo

    if (!settings.firstVisiteDone) {

      let todos = JSON.parse(localStorage.getItem('todos') || '[]');
      let firstTodo = WelcomeTodo.getWelcomeTodo();
      todos.push(firstTodo);
      localStorage.setItem('todos', JSON.stringify(todos));

      settings.firstVisiteDone = true;
    }

    if (!settings.language) {
      settings.language = 'en';
    }

    // Settings language

    this.translate.setDefaultLang(settings.language);
    this.translate.use(settings.language); 


    // Initial theme color

    if (settings.darkMode === undefined) {
      console.log("no settings")
      
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        if (prefersDark.matches) {
          console.log("DARK MODE")
          document.body.setAttribute('color-theme', 'dark');
          settings.darkMode = true;
        }
        else{
          console.log("LIGHT MODE")
          document.body.setAttribute('color-theme', 'light');
          settings.darkMode = false;
        }
    }

    // Theme color settings

    if (settings.darkMode) {
      document.body.setAttribute('color-theme', 'dark');
    }
    else{
      console.log("LIGHT MODE SET")
      document.body.setAttribute('color-theme', 'light');
    }

    if (settings.themeColor){
      const style = document.createElement('style');
      style.innerHTML = `
        :root {
          --ion-color-primary: ${settings.themeColor};
          --ion-color-primary-contrast: #ffffff;
          --ion-color-primary-shade: mix(black, var(--ion-color-primary), 15%);
          --ion-color-primary-tint: mix(white, var(--ion-color-primary), 15%);
        }
      `;
      document.head.appendChild(style);
    }


    // Save settings

    localStorage.setItem('settings', JSON.stringify(settings));
  }
}

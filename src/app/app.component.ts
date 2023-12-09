import { Component } from '@angular/core';
import { Notif } from './model/notif';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor() {

    // this.translate.setDefaultLang('en'); // Langue par défaut
  
    // for (let i = 0; i < 1000; i++) {
    //   Notif.cancelNotificationById(i);
    // }

    // let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    // for (let todo of todos) {
    //   todo.developped = true;
    //   console.log(todo)

    // }

    // localStorage.setItem('todos', JSON.stringify(todos));

    localStorage.setItem('notifId', JSON.stringify([]));
  }
}

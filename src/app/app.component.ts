import { Component } from '@angular/core';
import { Notif } from './model/notif';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {

    // for (let i = 0; i < 1000; i++) {
    //   Notif.cancelNotificationById(i);
    // }

    // let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    // for (let todo of todos) {
    //   todo.developped = true;
    //   console.log(todo)

    // }

    // localStorage.setItem('todos', JSON.stringify(todos));
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { Notif } from 'src/app/model/notif';
import { Todo } from 'src/app/model/todo';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
})
export class DateSelectorComponent  implements OnInit {

  @Input() todo!: Todo;

  @Input() page?: string;

  constructor() { }

  ngOnInit() {
    if (!this.todo.repeat){
      this.todo.repeat = {};
    }
  }

  findOnConfig(key: string): boolean {

    const configItem = this.todo.config.find(item => item.key === key);
    return configItem ? configItem.value : false;
  }

  manageNotification(){

    console.log("click")

    console.log("manage notification")
    console.log(this.todo.reminder);
    // this.newTodo.sayHello();
    if (this.todo.reminder) {
      Notif.scheduleNotification(this.todo);
    }
    else{
      Notif.cancelNotification(this.todo);
    }
  }

  repeatReminderPossible(){
    return this.todo.repeat?.startDate && this.todo.repeat?.startTime && this.todo.repeat?.delayType;
  }

  manageRepeatNotification(){
    if (this.todo.reminder) {
      Notif.scheduleRecurringNotification(this.todo);
    }
    else{
      Notif.cancelNotification(this.todo);
    }
  }
}

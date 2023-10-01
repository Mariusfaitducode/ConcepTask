import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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

  @Output() childModified = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    if (!this.todo.repeat){
      this.todo.repeat = {};
    }
  }

  manageNotification(){

    this.childModified.emit(true)

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

    this.childModified.emit(true)
    if (this.todo.reminder) {
      Notif.scheduleRecurringNotification(this.todo);
    }
    else{
      Notif.cancelNotification(this.todo);
    }
  }
}

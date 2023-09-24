import { Component, OnInit, Input } from '@angular/core';
import { Todo } from 'src/app/model/todo';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
})
export class DateSelectorComponent  implements OnInit {

  @Input() todo!: Todo;

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
      Todo.scheduleNotification(this.todo);
    }
    else{
      Todo.cancelNotification(this.todo);
    }
  }

  repeatReminderPossible(){
    return this.todo.repeat?.startDate && this.todo.repeat?.startTime && this.todo.repeat?.delayType;
  }

  manageRepeatNotification(){}
}

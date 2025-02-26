import { SelectorContext } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// import { Todo } from 'src/app/models/todo';
import { TodoColor } from 'src/app/utils/todo-color';
import { TodoDate } from 'src/app/utils/todo-date';
import { TodoUtils } from 'src/app/utils/todo-utils';

import { MainTodo } from 'src/app/models/todo/main-todo';
import { SubTodo } from 'src/app/models/todo/sub-todo';

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.scss'],
})
export class TodoCardComponent  implements OnInit {

  constructor(public translate : TranslateService) { }

  @Input() todo!: MainTodo | SubTodo;
  @Input() color!: string;

  ngOnInit() { 
    
  }

  formatDateToCustomString() {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    if (this.todo.properties.config.date){

      let date = TodoDate.getDate(this.todo.properties.date!, this.todo.properties.time);

      const day = daysOfWeek[date!.getDay()];
      const dayOfMonth = date!.getDate();
      const month = months[date!.getMonth()];
      const hours = String(date!.getHours()).padStart(2, '0');
      const minutes = String(date!.getMinutes()).padStart(2, '0');
    
      return `${day}, ${dayOfMonth} ${month} ${hours}:${minutes}`;
    }
    if (this.todo.properties.config.repeat && this.todo.properties.repeat!.delayType){
      // let startDate = Todo.getDate(this.todo.repeat!.startDate!, this.todo.repeat!.startTime!);
      // let repeat = this.todo.repeat!.delayType;

      if (this.translate && this.translate.store.currentLang == "fr") {
        return `Répété chaque ${this.translate.instant(this.todo.properties.repeat!.delayType)}`;
      }
      else{
        return `Repeat every ${this.todo.properties.repeat!.delayType}`;

      }
      return `Repeat every ${this.todo.properties.repeat!.delayType}`;

    }
    return null; 
  }


  doneTasksPercent(){

    if (this.todo.list.length < 1) return null;

    let percent = TodoUtils.getDoneTasksPercent(this.todo);

    if (percent == 0) return null;

    return `${percent}% done`;
  }

  validDate(){
    if (this.todo.properties.config.date){
      let date = TodoDate.getDate(this.todo.properties.date!, this.todo.properties.time);
      let now = new Date();
      return date! > now;
    }
    if (this.todo.properties.config.repeat && this.todo.properties.repeat!.delayType){
      return true;
    }
    return false;
  }


  contrastColor(){

    let color = TodoColor.getCorrectTextColor(this.todo.properties.category.color);
    
    return color
  
  }

}

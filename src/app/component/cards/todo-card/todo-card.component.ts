import { SelectorContext } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Todo } from 'src/app/model/todo';

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.scss'],
})
export class TodoCardComponent  implements OnInit {

  constructor(public translate : TranslateService) { }

  @Input() todo!: Todo;
  @Input() color!: string;

  ngOnInit() { 
    
  }

  formatDateToCustomString() {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    if (this.todo.config.date){

      let date = Todo.getDate(this.todo.date!, this.todo.time);

      const day = daysOfWeek[date!.getDay()];
      const dayOfMonth = date!.getDate();
      const month = months[date!.getMonth()];
      const hours = String(date!.getHours()).padStart(2, '0');
      const minutes = String(date!.getMinutes()).padStart(2, '0');
    
      return `${day}, ${dayOfMonth} ${month} ${hours}:${minutes}`;
    }
    if (this.todo.config.repeat && this.todo.repeat!.delayType){

      // let startDate = Todo.getDate(this.todo.repeat!.startDate!, this.todo.repeat!.startTime!);
      // let repeat = this.todo.repeat!.delayType;

      if (this.translate && this.translate.store.currentLang == "fr") {
        return `Répété chaque ${this.translate.instant(this.todo.repeat!.delayType)}`;
      }
      else{
        return `Repeat every ${this.todo.repeat!.delayType}`;

      }
      return `Repeat every ${this.todo.repeat!.delayType}`;

    }
    return null; 
  }


  doneTasksPercent(){

    if (this.todo.list.length < 1) return null;

    let percent = Todo.getDoneTasksPercent(this.todo);

    if (percent == 0) return null;

    return `${percent}% done`;
  }

  validDate(){
    if (this.todo.config.date){
      let date = Todo.getDate(this.todo.date!, this.todo.time);
      let now = new Date();
      return date! > now;
    }
    if (this.todo.config.repeat && this.todo.repeat!.delayType){
      return true;
    }
    return false;
  }


  contrastColor(){

    let color = Todo.getCorrectTextColor(this.todo.category.color);
    
    return color
  
  }

}

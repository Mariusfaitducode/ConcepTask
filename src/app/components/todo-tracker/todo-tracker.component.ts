import { Component, Input, OnInit } from '@angular/core';
import { random } from 'lodash';

@Component({
  selector: 'app-habit-tracker',
  templateUrl: './todo-tracker.component.html',
  styleUrls: ['./todo-tracker.component.scss'],
})
export class TodoTrackerComponent  implements OnInit {

  @Input() todosTracker: {todoId: string, date: Date}[] = [];

  constructor() { }


  days : string[] = ["M", "T", "W", "T", "F", "S", "S"];

  numberOfWeeks: number = 24;

  // weeks: number[] = [];




  ngOnInit() {


    console.log("todosTracker", this.todosTracker)

    // for (let i = 0; i < this.numberOfWeeks * 20; i++) {

    //   // this.weeks.push(i);

    //   let randomDate = new Date();
    //   randomDate.setDate(randomDate.getDate() - random(0, 200));
    //   this.todosTracker.push({todoId: "1", date: randomDate})
    // }
  }


  getTodoCountByDate( day: number, week: number) {

    let pastDays = (week - this.numberOfWeeks + 2) * 7 + day;

    let date = new Date();

    let today = date.getDay();

    pastDays = pastDays - today ;

    if (pastDays > 6) {
      return -1;
    }

    let targetDate = new Date();
    targetDate.setDate(today + pastDays);
    let todosFound = this.todosTracker.filter(todo => {
      if (typeof todo.date === 'object' && 'seconds' in todo.date) {
        let todoDate = new Date((todo.date as any).seconds * 1000);
        return todoDate.setHours(0,0,0,0) === targetDate.setHours(0,0,0,0);
      }
      return false;
    });
    return todosFound.length;


  }

  // getDayColor(date: Date): string {
  //   const today = new Date();
  //   return date.getDate() === today.getDate() ? 'var(--ion-color-primary)' : 'transparent';
  // }

}

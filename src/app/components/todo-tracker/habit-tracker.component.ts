import { Component, Input, OnInit } from '@angular/core';
import { random } from 'lodash';

@Component({
  selector: 'app-habit-tracker',
  templateUrl: './habit-tracker.component.html',
  styleUrls: ['./habit-tracker.component.scss'],
})
export class HabitTrackerComponent  implements OnInit {

  @Input() todosTracker: {todoId: string, date: Date}[] = [];

  constructor() { }


  days : string[] = ["M", "T", "W", "T", "F", "S", "S"];

  numberOfWeeks: number = 24;

  // weeks: number[] = [];




  ngOnInit() {
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

    let todosFound = this.todosTracker.filter(todo => todo.date.getDate() === targetDate.getDate() && todo.date.getMonth() === targetDate.getMonth() && todo.date.getFullYear() === targetDate.getFullYear());
    return todosFound.length;


  }

  // getDayColor(date: Date): string {
  //   const today = new Date();
  //   return date.getDate() === today.getDate() ? 'var(--ion-color-primary)' : 'transparent';
  // }

}

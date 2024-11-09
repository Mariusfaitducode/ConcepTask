import { Component, Input, OnInit } from '@angular/core';
import { random } from 'lodash';

@Component({
  selector: 'app-habit-tracker',
  templateUrl: './todo-tracker.component.html',
  styleUrls: ['./todo-tracker.component.scss'],
})
export class TodoTrackerComponent  implements OnInit {

  @Input() todosTracker: {todoId: string, title: string, date: Date}[] = [];

  constructor() { }


  days : string[] = ["M", "T", "W", "T", "F", "S", "S"];

  numberOfWeeks: number = 52;

  // weeks: number[] = [];


  ngOnInit() {
    console.log("todosTracker", this.todosTracker)
  }

  ngAfterViewInit() {
    const todoBody = document.querySelector('.todo-body');
    if (todoBody) {
      todoBody.scrollLeft = todoBody.scrollWidth;
    }
  }


  // The problem is that getDay() returns 0 for Sunday, which causes issues in calculations
  getTodoCountByDate(day: number, week: number) {
    let date = new Date();
    let today = date.getDay();
    today = today === 0 ? 7 : today; // Convert Sunday from 0 to 7

    let pastDays = (week + 2 - this.numberOfWeeks) * 7 + day;
    pastDays = pastDays - today + 1;

    if (pastDays > 0) {
      return -1;
    }

    let targetDate = new Date();
    targetDate.setDate(date.getDate() + pastDays);

    let todosFound = this.todosTracker.filter(todo => {
      if (typeof todo.date === 'object' && 'seconds' in todo.date) {
        let todoDate = new Date((todo.date as any).seconds * 1000);
        return todoDate.setHours(0,0,0,0) === targetDate.setHours(0,0,0,0);
      }
      return false;
    });
    return todosFound.length;
  }

  getTodoDate(day: number, week: number) {
    let date = new Date();
    let today = date.getDay();
    today = today === 0 ? 7 : today; // Convert Sunday from 0 to 7

    let pastDays = (week + 2 - this.numberOfWeeks) * 7 + day;
    pastDays = pastDays - today + 1; // Add 1 to align with Monday as day 1

    return pastDays;
  }


  // getDayColor(date: Date): string {
  //   const today = new Date();
  //   return date.getDate() === today.getDate() ? 'var(--ion-color-primary)' : 'transparent';
  // }

}

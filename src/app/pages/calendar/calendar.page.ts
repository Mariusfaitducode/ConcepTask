import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// import { NgCalendarModule } from 'ionic2-calendar'; 
// import { CalendarComponent } from 'ionic2-calendar/calendar';

import { CalendarComponent } from './src/calendar';
import * as moment from 'moment';
import { Todo } from 'src/app/models/todo';
import { TodoDate } from 'src/app/utils/todo-date';
import { TaskService } from 'src/app/services/task.service';
import { SyncService } from 'src/app/services/sync.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  constructor(
    private router : Router,
    private taskService : TaskService,
    private syncService : SyncService
  ) { }

  @ViewChild(CalendarComponent, { static: false }) myCalendar!: CalendarComponent;

  eventSource : any[] = [];

  todos : Todo[] = [];
  currentMonth = moment(new Date()).format('MMMM YYYY');
  viewTitle: string = '';
  selectedDay = new Date();

  

  ngOnInit() {

    // this.todos = JSON.parse(localStorage.getItem('todos') || '[]');

    this.syncService.getTodos().subscribe((todos: Todo[]) => {
      console.log('Todos loaded in calendar page:', todos)
      this.todos = todos;
      this.initTodoList();
    });


    // this.initTodoList();
  }


  initTodoList(){

    let copyList : Todo[] = [...this.todos!];

    // Bfs algorithm
    while (copyList.length > 0) {

      let todo : Todo = copyList.shift()!;

      if (todo.config.date && todo.date){

        let endDate = TodoDate.getDate(todo.date!);
        endDate.setDate(endDate.getDate() );

        const newEvent = {
          title: todo.title,
          startTime: endDate,
          endTime: endDate,
          allDay: true,
        };

        this.eventSource.push(newEvent);
      }
      else if (todo.config.repeat && todo.repeat){

        let endDate = TodoDate.getDate(todo.repeat.startDate!);
        endDate.setDate(endDate.getDate() );

        const newEvent = {
          title: todo.title,
          startTime: endDate,
          endTime: endDate,
          allDay: true,
        };

        this.eventSource.push(newEvent);
      }

      for (let subTodo of todo.list!) {
        copyList.push(subTodo);
      }
    }
    
  }

  show(event : any){
    console.log(event)
  }


  findTodosByDate(date : Date){
    let copyList : Todo[] = [...this.todos!];
    let eventTodos : Todo[] = [];

    while (copyList.length > 0) {

      let todo : Todo = copyList.shift()!;

      if (todo.config.date && todo.date && this.sameDates(date, new Date(todo.date))){
        
        eventTodos.push(todo);
      }
      else if (todo.config.repeat && todo.repeat){

        if (TodoDate.isDateInRepeat(todo, date)){
          eventTodos.push(todo);
        }
      }

      for (let subTodo of todo.list!) {
        copyList.push(subTodo);
      }
    }
    return eventTodos;
  }
  

  sameDates(date1: Date, date2: Date): boolean {
    // Extraire les parties de la date (année, mois, jour) pour chaque date
    const annee1 = date1.getFullYear();
    const mois1 = date1.getMonth();
    const jour1 = date1.getDate();
  
    const annee2 = date2.getFullYear();
    const mois2 = date2.getMonth();
    const jour2 = date2.getDate();
  
    // Comparer les parties de la date
    return annee1 === annee2 && mois1 === mois2 && jour1 === jour2;
  }


  setToday(){
    this.myCalendar.currentDate = new Date();
  }
  

  previousMonth() {
    this.myCalendar.slidePrev();
  }


  nextMonth() {
    this.myCalendar.slideNext();
  }


  onViewTitleChanged(title: string) {
    console.log(title)
    this.viewTitle = title;
  }


  formatDateToCustomString(calendarDate: Date) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let date = calendarDate;

    const day = daysOfWeek[date!.getDay()];
    const dayOfMonth = date!.getDate();
    const month = months[date!.getMonth()];
  
    return `${day}, ${dayOfMonth} ${month}`;
  }


  addTodoOnDate(date : Date){
    console.log(date) 
    this.router.navigate(['/add', date.getDate(), date.getMonth(), date.getFullYear() ]);
  }
}

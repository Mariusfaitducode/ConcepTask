import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { NgCalendarModule } from 'ionic2-calendar'; 
// import { CalendarComponent } from 'ionic2-calendar/calendar';

import { CalendarComponent } from './src/calendar';
import * as moment from 'moment';
// import { Todo } from 'src/app/models/todo';
import { TodoDate } from 'src/app/utils/todo-date';
import { TaskService } from 'src/app/services/task/task.service';
import { Subscription } from 'rxjs';
import { MainTodo } from 'src/app/models/todo/main-todo';
import { SubTodo } from 'src/app/models/todo/sub-todo';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'src/app/services/settings/settings.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit, OnDestroy {

  constructor(
    private route : ActivatedRoute,
    private settingsService : SettingsService,
    private translate: TranslateService,
    private router : Router,
    private taskService : TaskService
  ) { }

  @ViewChild(CalendarComponent, { static: false }) myCalendar!: CalendarComponent;

  eventSource : any[] = [];

  todoSubscription! : Subscription;
  todos : MainTodo[] = [];

  currentMonth = moment(new Date()).format('MMMM YYYY');
  viewTitle: string = '';
  selectedDay = new Date();

  

  ngOnInit() {

    // this.todos = JSON.parse(localStorage.getItem('todos') || '[]');

    this.taskService.getTodos().subscribe((todos: MainTodo[]) => {
      console.log('Todos loaded in calendar page:', todos)
      this.todos = todos;
      this.initTodoList();
    });

    // Actualise la page à chaque changement
    this.route.queryParams.subscribe(params =>{
      this.settingsService.initPage(this.translate);
    });
  }


  ngOnDestroy(){

    console.log("CALENDAR PAGE ON DESTROY")
    
    if (this.todoSubscription){
      this.todoSubscription.unsubscribe();
    }
  }




  initTodoList(){

    let copyList : (MainTodo | SubTodo)[] = [...this.todos!];

    // Bfs algorithm
    while (copyList.length > 0) {

      let todo : MainTodo | SubTodo = copyList.shift()!;

      if (todo.properties.config.date && todo.properties.date){

        let endDate = TodoDate.getDate(todo.properties.date!);
        endDate.setDate(endDate.getDate() );

        const newEvent = {
          title: todo.properties.title,
          startTime: endDate,
          endTime: endDate,
          allDay: true,
        };

        this.eventSource.push(newEvent);
      }
      else if (todo.properties.config.repeat && todo.properties.repeat){

        let endDate = TodoDate.getDate(todo.properties.repeat.startDate!);
        endDate.setDate(endDate.getDate() );

        const newEvent = {
          title: todo.properties.title,
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
    let copyList : (MainTodo | SubTodo)[] = [...this.todos!];
    let eventTodos : (MainTodo | SubTodo)[] = [];

    while (copyList.length > 0) {

      let todo : MainTodo | SubTodo = copyList.shift()!;

      if (todo.properties.config.date && todo.properties.date && this.sameDates(date, new Date(todo.properties.date))){
        
        eventTodos.push(todo);
      }
      else if (todo.properties.config.repeat && todo.properties.repeat){

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

    // this.viewTitle = this.formatDateToCustomString(new Date(title));
    this.viewTitle = this.formatMonthTitle(title);
  }

  formatMonthTitle(title: string){
    let months = []
    
    if (this.translate.currentLang === 'fr'){
      months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    }
    else{
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }

    let date = new Date(title);
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  

  }


  formatDateToCustomString(calendarDate: Date) {

    let daysOfWeek = []
    let months = []
    
    if (this.translate.currentLang === 'fr'){
      daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    }
    else{
      daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }

    let date = calendarDate;

    const day = daysOfWeek[date!.getDay()];
    const dayOfMonth = date!.getDate();
    const month = months[date!.getMonth()];
  
    return `${day}, ${dayOfMonth} ${month}`;
  }


  addTodoOnDate(date : Date){
    console.log(date) 
    this.router.navigate(['/todo', date.getDate(), date.getMonth(), date.getFullYear() ]);
  }
}

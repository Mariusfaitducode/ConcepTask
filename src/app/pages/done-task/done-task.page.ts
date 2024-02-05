import { Component, Inject, PLATFORM_ID } from '@angular/core';

import { FirebaseService } from '../../services/firebase.service';

import { ItemReorderEventDetail, MenuController } from '@ionic/angular';

// import { NavParams } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { Todo } from '../../models/todo';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { WelcomeTodo } from '../../models/welcome-todo';

//import { AngularFireDatabase } from '@angular/fire/database';

import { TranslateService } from '@ngx-translate/core';
import { Settings } from 'src/app/models/settings';

@Component({
  selector: 'app-home',
  templateUrl: 'done-task.page.html',
  styleUrls: ['../../home/home.page.scss'],
})
export class DoneTaskPage {

  constructor(
    private translate: TranslateService,
    private menuCtrl : MenuController,
    private route : ActivatedRoute,
  )
  {
    let settings = new Settings();
    settings.initPage(translate);
  }

  todos : Todo[] = []
  results : Todo[] = []

  darkMode = false;

  openLeftMenu = false;


  filters = {

    today: false,
    week: false,
    month: false,
    overdue: false,
    done: false,
    priority: false,
    priorityChoosed: '',
    category: false,
    categoryChoosed: '',
  };
  

  ngOnInit() {

    console.log("HOME PAGEEEE")

    this.darkMode = JSON.parse(localStorage.getItem('settings') || '{}').darkMode;
    

    this.route.queryParams.subscribe(params =>{

      console.log("HOME PAGEEEE CHANGE")
      let settings = JSON.parse(localStorage.getItem('settings') || '{}');

      this.darkMode = settings.darkMode;
      this.translate.use(settings.language); 

      // window.location.reload();
      this.loadTodos();
      this.results = [...this.todos];
    });

    this.loadTodos();
    this.results = [...this.todos];
  }


 loadTodos(){
  this.todos = []
   this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
   console.log(this.todos)
 }


 setTodos(){
   localStorage.setItem('todos', JSON.stringify(this.todos));
 }


 openMenu() {
   this.menuCtrl.open();
 }


 closeMenu() {
   this.menuCtrl.close();
 }
  // app = initializeApp(environnement.firebaseConfig);


  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {

    
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    ev.detail.complete(this.results);
    console.log();
    ev.stopPropagation();

    this.todos = [...this.results];
    this.setTodos();
  }


  handleInput(event : any) {
    const query = event.target.value.toLowerCase();
    this.results = [...this.results.filter((d) => d.title.toLowerCase().indexOf(query) > -1 || d.category.name.toLowerCase().indexOf(query) > -1)];

    if (query == '') {
      this.results = [...this.todos];
    }
  }


  dateFilters(on: boolean, off1:boolean, off2:boolean) {
    // on = !on;

    if (on) {
      console.log("on")
      off1 = false;
      off2 = false;
    }
  }


  filterResults() {

    // if (this.filters.today) {
    //   this.filters.week = false;
    //   this.filters.month = false;
    //   this.filters.overdue = false;
    // }
    // if (this.filters.week) {
    //   this.filters.today = false;
    //   this.filters.month = false;
    //   this.filters.overdue = false;
    // }
    // if (this.filters.overdue) {
    //   this.filters.week = false;
    //   this.filters.today = false;
    //   this.filters.month = false;
    // }

    this.results = [...this.todos];

    if (this.filters.week) {
      const nextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
      this.results = [...this.results.filter((d) => d.date && new Date(d.date) < nextWeek && new Date(d.date) >= new Date())];
    }

    if (this.filters.today) {
      this.results = [...this.results.filter((d) => d.date && new Date(d.date) == new Date())];
    }

    if (this.filters.overdue) {
      this.results = [...this.todos.filter((d) => d.date && new Date(d.date) < new Date())];
    }

    if (this.filters.priority) {
      this.results = [...this.results.filter((d) => d.priority == this.filters.priorityChoosed)];
    }

    if (this.filters.category) {
      this.results = [...this.results.filter((d) => d.category.name == this.filters.categoryChoosed)];
    }
    if (this.filters.done) {
      this.results = [...this.results.filter((d) => d.isDone == true)];
    }
    
  }

  countFilters(){
    let count = 0;
    for (const [key, value] of Object.entries(this.filters)) {
      if (value) {
        count++;
      }
    }
    return count;
  }
}


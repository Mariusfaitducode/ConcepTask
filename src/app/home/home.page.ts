import { Component, Inject, PLATFORM_ID } from '@angular/core';

import { ItemReorderEventDetail, MenuController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { Todo } from '../models/todo';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private translate: TranslateService,
    private menuCtrl : MenuController,
    private route : ActivatedRoute,
  )
  {}

  todos : Todo[] = []
  results : Todo[] = []

  darkMode : boolean = false;

  openLeftMenu : boolean = false;

  // filters = {
  //   today: false,
  //   week: false,
  //   month: false,
  //   overdue: false,
  //   done: false,
  //   priority: false,
  //   priorityChoosed: '',
  //   category: false,
  //   categoryChoosed: '',
  // };
  

  ngOnInit() {
    
    this.darkMode = JSON.parse(localStorage.getItem('settings') || '{}').darkMode;
    
    this.route.queryParams.subscribe(params =>{

      console.log("HOME PAGEEEE CHANGE")
      let settings = JSON.parse(localStorage.getItem('settings') || '{}');

      this.darkMode = settings.darkMode;
      this.translate.use(settings.language); 

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


  // dateFilters(on: boolean, off1:boolean, off2:boolean) {

  //   if (on) {
  //     console.log("on")
  //     off1 = false;
  //     off2 = false;
  //   }
  // }


  // filterResults() {

  //   this.results = [...this.todos];

  //   if (this.filters.week) {
  //     const nextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
  //     this.results = [...this.results.filter((d) => d.date && new Date(d.date) < nextWeek && new Date(d.date) >= new Date())];
  //   }

  //   if (this.filters.today) {
  //     this.results = [...this.results.filter((d) => d.date && new Date(d.date) == new Date())];
  //   }

  //   if (this.filters.overdue) {
  //     this.results = [...this.todos.filter((d) => d.date && new Date(d.date) < new Date())];
  //   }

  //   if (this.filters.priority) {
  //     this.results = [...this.results.filter((d) => d.priority == this.filters.priorityChoosed)];
  //   }

  //   if (this.filters.category) {
  //     this.results = [...this.results.filter((d) => d.category.name == this.filters.categoryChoosed)];
  //   }
  //   if (this.filters.done) {
  //     this.results = [...this.results.filter((d) => d.isDone == true)];
  //   }
  // }

  // countFilters(){
  //   let count = 0;
  //   for (const [key, value] of Object.entries(this.filters)) {
  //     if (value) {
  //       count++;
  //     }
  //   }
  //   return count;
  // }
}

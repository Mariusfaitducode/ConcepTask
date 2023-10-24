import { Component, Inject, PLATFORM_ID } from '@angular/core';

import { FirebaseService } from '../service/firebase.service';

import { ItemReorderEventDetail, MenuController } from '@ionic/angular';

// import { NavParams } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { Todo } from '../model/todo';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

//import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private menuCtrl : MenuController,
    private route : ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    let categories = JSON.parse(localStorage.getItem('categories') || '[]');
    if (categories.length === 0){
      categories = [
        {
          id: 0,
          name: 'task',
          color: '#e83c53',
        },
        {
          id: 1,
          name: 'project',
          color: '#428cff',
        },
        {
          id: 2,
          name: 'work',
          color: '#ffd948',
        },
        {
          id: 3,
          name: 'personnal',
          color: '#29c467',
        },
        {
          id: 4,
          name: 'event',
          color: '#5d58e0',
        },
      ];
      localStorage.setItem('categories', JSON.stringify(categories));
    }

    let settings = JSON.parse(localStorage.getItem('settings') || '{}');

    console.log(settings)

    if (!settings.darkMode) {
      console.log("no settings")
      
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        if (prefersDark.matches) {
          console.log("DARK MODE")
          // document.body.setAttribute('color-theme', 'dark');
          settings.darkMode = true;
        }
        else{
          console.log("LIGHT MODE")
          // document.body.setAttribute('color-theme', 'light');
          settings.darkMode = false;
        }
    }

    if (settings.darkMode) {
      document.body.setAttribute('color-theme', 'dark');
    }
    else{
      console.log("LIGHT MODE SET")
      document.body.setAttribute('color-theme', 'light');
    }

    localStorage.setItem('settings', JSON.stringify(settings));


      
    }

  todos : Todo[] = []

  results : Todo[] = []

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
    

    this.route.queryParams.subscribe(params =>{

      console.log("HOME PAGEEEE CHANGE")
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

import { Component } from '@angular/core';

import { FirebaseService } from '../service/firebase.service';

import { MenuController } from '@ionic/angular';

// import { NavParams } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { Todo } from '../model/todo';

//import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private menuCtrl : MenuController,
    private route : ActivatedRoute) {}

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

 typeColor(type : string){
  switch (type) {

    case "default":
      return "var(--ion-color-tertiary)";
      
    case "personnal":
      return "var(--ion-color-danger)";
      
    case "project":
      return "var(--ion-color-warning)";
      
    case "work":
      return "var(--ion-color-success)";
      
    default:
      return "var(--ion-color-primary)";
  }
 }
  // app = initializeApp(environnement.firebaseConfig);


  handleInput(event : any) {
    const query = event.target.value.toLowerCase();
    this.results = [...this.results.filter((d) => d.title.toLowerCase().indexOf(query) > -1 || d.category.toLowerCase().indexOf(query) > -1)];
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
      this.results = [...this.results.filter((d) => d.category == this.filters.categoryChoosed)];
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

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

  openLeftMenu = false;

  ngOnInit() {

    console.log("HOME PAGEEEE")
    

    this.route.queryParams.subscribe(params =>{

      console.log("HOME PAGEEEE CHANGE")

      this.loadTodos();
    });

    this.loadTodos();
  }

  ngOnChange(){  
 }


 loadTodos(){
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
}

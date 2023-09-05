import { Component } from '@angular/core';

import { FirebaseService } from '../service/firebase.service';

import { MenuController } from '@ionic/angular';

// import { NavParams } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';

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

  todos : any[] = []

  ngOnInit() {

    console.log("HOME PAGEEEE")
    

    this.route.queryParams.subscribe(params => {

      console.log("HOME PAGEEEE CHANGE")
      
      const newTodo = history.state.newTodo;

      if (newTodo) {

        console.log("ADD TODOOOOOO")

        this.todos.push(newTodo);
        this.setTodos();
      }

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

  // app = initializeApp(environnement.firebaseConfig);
}

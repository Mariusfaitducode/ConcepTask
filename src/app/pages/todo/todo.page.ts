import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {


  //todos = [];

  todo : any = {};

  constructor(private route : ActivatedRoute) { }

  ngOnInit() {


    this.route.params.subscribe((params) => {

      const id = +params['id'];
      console.log(id); // Check if the id is correct
  
      this.loadTodo(id);
    });
  }


  loadTodo(id : number){
    let todos = JSON.parse(localStorage.getItem('todos') || '[]');
    console.log(todos)

    this.todo = todos[id]

  }


  

}

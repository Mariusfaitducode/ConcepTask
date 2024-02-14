import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor() { }



  loadTodos(){
    let todos = [];
    todos = JSON.parse(localStorage.getItem('todos') || '[]');
    return todos;
  }


  setTodos(todos : Todo[]){
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}

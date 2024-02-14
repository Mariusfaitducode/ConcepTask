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


  deleteTodoById(todos : Todo[], mainTodo: Todo, todoToDelete: Todo){


    if (todoToDelete.main == true){ // Remove the main todo

      todos = todos.filter((todo : Todo) => todo.mainId != todoToDelete.mainId);
    }
    else{ // Remove the sub todo from the main todo

      Todo.deleteTodoById(mainTodo, todoToDelete.subId!);
    }

    this.setTodos(todos);
    return todos;
  }


  updateTodoById(todos : Todo[], mainTodoToUpdate: Todo){
      
    todos.forEach((todo: Todo, index: number) => {
      if (todo.mainId === mainTodoToUpdate.mainId) {
        todos[index] = mainTodoToUpdate;
      }
    });

    this.setTodos(todos);
    return todos;
  }
}

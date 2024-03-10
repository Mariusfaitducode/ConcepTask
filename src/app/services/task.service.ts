import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private userService: UserService,
  ) { }

  private tasksSubject = new BehaviorSubject<Todo[]>([]);

  // Storage


  loadTodos(user : User | null){
    let todos = [];


    if (user){
      todos = user.todos;
    }
    else{
      todos = JSON.parse(localStorage.getItem('todos') || '[]');
    }

    return this.tasksSubject.next(todos as Todo[]);

  }


  setTodos(todos : Todo[], user : User | null = null){

    // Si pas d'utilisateur connecté

    if (user){
      user.todos = todos;

      console.log('UPDATE USER TODOS')
      console.log(user)
      this.userService.updateUser(user).subscribe((res) => {
        console.log('User updated:', res);
      });
    }
    else{
      localStorage.setItem('todos', JSON.stringify(todos));
    }
    this.tasksSubject.next(todos);
  }

  getTodos(){
    return this.tasksSubject.asObservable();
  }


  // CRUD

  deleteTodoById(todos : Todo[], mainTodo: Todo, todoToDelete: Todo, user : User | null){

    if (todoToDelete.main == true){ // Remove the main todo

      todos = todos.filter((todo : Todo) => todo.mainId != todoToDelete.mainId);
    }
    else{ // Remove the sub todo from the main todo

      Todo.deleteTodoById(mainTodo, todoToDelete.subId!);
    }

    this.setTodos(todos, user);
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

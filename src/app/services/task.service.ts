import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { UserService } from './user/user.service';
import { SyncService } from './sync.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService { 
  
  // Gère les todos à l'intérieur de l'application
  // Permet de récupérer manipuler les todos

  constructor(
    private userService: UserService,
    private syncService : SyncService
  ) { }


  private tasksSubject = new BehaviorSubject<Todo[]>([]);


  // getTodos(): Observable<Todo[]>{
  //   return this.tasksSubject.asObservable();
  // }


  // Actualize todos on app
  // actualizeTodos(todos : Todo[], user : User | null = null){

  //   this.tasksSubject.next(todos);
  //   // this.syncService.synchronizeTodos(todos, user);
  // }




  // Load todos from account or local storage
  // loadTodos(user : User | null){
  //   let todos = [];

  //   if (user){
  //     todos = user.todos;
  //   }
  //   else{
  //     todos = JSON.parse(localStorage.getItem('todos') || '[]');
  //   }

  //   return this.tasksSubject.next(todos as Todo[]);
  // }


 




  


  // Update a todo (not a subtask)
  // updateTodoById(todos : Todo[], mainTodoToUpdate: Todo){
      
  //   todos.forEach((todo: Todo, index: number) => {
  //     if (todo.mainId === mainTodoToUpdate.mainId) {
  //       todos[index] = mainTodoToUpdate;
  //     }
  //   });

  //   // this.syncService.synchronizeTodos(todos); 
  //   return todos;
  // }
}

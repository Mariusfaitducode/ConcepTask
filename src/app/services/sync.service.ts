import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { User } from '../models/user';
import { UserService } from './user/user.service';
import { TaskService } from './task.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  // Gère les interactions entre l'application et firebase liées aux todos
  // Permet de synchroniser les todos entre le local storage et l'account

  constructor(
    private userService : UserService,
    private firestore: AngularFirestore,
    // private taskService : TaskService
  ) { }


  
  // async initializeUserTodos(user : User){

  //   let todos = JSON.parse(localStorage.getItem('todos') || '[]');

  //   for (let todo of todos){
  //     this.addTodoForUser(user, todo);
  //   }
  //   return todos;
  // }



  // Récupérer les todos d'un utilisateur
  getTodosForUser(userId: string): Observable<Todo[]> {
    return this.firestore.collection<Todo>(`users/${userId}/todos`).valueChanges();
  }




  // Ajouter un todo avec un ID généré automatiquement
  async addTodoForUser(user: User, todo: Todo): Promise<void> {

    console.log('ADD TODO FOR USER : ', user.pseudo, todo.title)
    
    const todosRef = this.firestore.collection(`users/${user.uid}/todos`);

    const todoId = this.firestore.createId();  // Génère un ID unique
    
    todo.id = todoId;  // Assurez-vous que votre modèle Todo a un champ id
    
    await todosRef.doc(todoId).set(todo);
  }



  // Set todos from local storage to account
  async accountGetLocalTodos(user : User){

    let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    console.log('ACCOUNT GET LOCAL TODOS : ', todos)

    for (let todo of todos){
      await this.addTodoForUser(user, todo);
    }
    return todos;


    // return user;
  }


  // Set todos from account to local storage
  localGetAccountTodos(user : User){
    localStorage.setItem('todos', JSON.stringify(user.todos));
  }


  clearLocalTodos(){
    localStorage.removeItem('todos');
  }


  synchronizeTodos(todos : Todo[], user : User | null = null){

    // Si pas d'utilisateur connecté

    if (user){
      user.todos = todos;

      console.log('UPDATE USER TODOS : ', user)

      this.userService.updateUser(user, null);
    }
    localStorage.setItem('todos', JSON.stringify(todos));
    
    // this.taskService.updateTodosOnApp(todos);
  }

}

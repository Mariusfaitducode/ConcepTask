import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { User } from '../models/user';
import { UserService } from './user/user.service';
import { TaskService } from './task.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TodoUtils } from '../utils/todo-utils';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  // Gère les interactions entre l'application et firebase liées aux todos
  // Permet de synchroniser les todos entre le local storage et l'account

  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$: Observable<Todo[]> = this.todosSubject.asObservable();
  private userId: string = '';

  constructor(private firestore: AngularFirestore) {}


  setUserId(userId: string) {
    this.userId = userId;
    this.syncTodosWithFirestore();
  }


  async initializeTodosFromLocalStorage(userId : string){
    this.userId = userId;
    let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    for (let todo of todos){
      await this.addTodo(todo);
    }

    this.syncTodosWithFirestore();  // Re-synchroniser après l'initialisation
  }


  private syncTodosWithFirestore() {
    this.getTodosFromLocalStorage();

    this.firestore.collection<Todo>(`users/${this.userId}/todos`)
      .valueChanges({ idField: 'id' })
      .pipe(
        tap(todosFromFirestore => {
          console.log('SYNC SERVICE TODOS FROM FIRESTORE : ', todosFromFirestore)
          this.todosSubject.next(todosFromFirestore);
          this.updateLocalStorage(todosFromFirestore);
        })
      )
      .subscribe();
  }


  private getTodosFromLocalStorage() {
    const todos = JSON.parse(localStorage.getItem(`todos`) || '[]');
    this.todosSubject.next(todos);
  }


  private updateLocalStorage(todos: Todo[]) {
    localStorage.setItem(`todos`, JSON.stringify(todos));
  }

  clearLocalStorage(){
    localStorage.removeItem('todos');
  }

  // CRUD

  getTodos(): Observable<Todo[]> {
    return this.todos$;
  }

  addTodo(todo: Todo) {

    console.log('SYNC SERVICE ADD TODO : ', todo)

    todo = JSON.parse(JSON.stringify(todo));

    

    const todos = [...this.todosSubject.value, todo];
    this.todosSubject.next(todos);
    this.updateLocalStorage(todos);
    this.firestore.collection(`users/${this.userId}/todos`).doc(todo.id).set(todo);
  }

  updateTodo(todo: Todo) {

    console.log('SYNC SERVICE UPDATE TODO : ', todo)

    todo = JSON.parse(JSON.stringify(todo));

    const todos = this.todosSubject.value.map(t => t.id === todo.id ? todo : t);
    this.todosSubject.next(todos);
    this.updateLocalStorage(todos);
    this.firestore.collection(`users/${this.userId}/todos`).doc(todo.id).update(todo);
  }

  deleteMainTodo(todoId: string) {

    console.log('SYNC SERVICE DELETE MAIN TODO : ', todoId)

    const todos = this.todosSubject.value.filter(t => t.id !== todoId);
    this.todosSubject.next(todos);
    this.updateLocalStorage(todos);
    this.firestore.collection(`users/${this.userId}/todos`).doc(todoId).delete();
  }

  deleteTodoById(mainTodo: Todo, todoToDelete: Todo){

    console.log('SYNC SERVICE DELETE TODO BY ID : ', todoToDelete)

    let todos = this.todosSubject.value

    if (todoToDelete.main == true){ // Remove the main todo

      // todos = todos.filter((todo : Todo) => todo.mainId != todoToDelete.mainId);
      this.deleteMainTodo(todoToDelete.id!);
    }
    else{ // Remove the sub todo from the main todo

      TodoUtils.deleteTodoById(mainTodo, todoToDelete.subId!);
      this.updateTodo(mainTodo);
    }
  }


// // Ajouter un todo avec un ID généré automatiquement
// async addTodoForUser(user: User, todo: Todo): Promise<void> {

//   console.log('ADD TODO FOR USER : ', user.pseudo, todo.title)
  
//   const todosRef = this.firestore.collection(`users/${user.uid}/todos`);

//   const todoId = this.firestore.createId();  // Génère un ID unique
  
//   todo.id = todoId;  // Assurez-vous que votre modèle Todo a un champ id
  
//   await todosRef.doc(todoId).set(todo);
// }





  // constructor(
  //   private userService : UserService,
  //   private firestore: AngularFirestore,
  //   // private taskService : TaskService
  // ) { }



  // // Set todos from local storage to account
  


  // // Set todos from account to local storage
  // localGetAccountTodos(user : User){
  //   localStorage.setItem('todos', JSON.stringify(user.todos));
  // }


  


  // synchronizeTodos(todos : Todo[], user : User | null = null){

  //   // Si pas d'utilisateur connecté

  //   if (user){
  //     user.todos = todos;

  //     console.log('UPDATE USER TODOS : ', user)

  //     this.userService.updateUser(user, null);
  //   }
  //   localStorage.setItem('todos', JSON.stringify(todos));
    
  //   // this.taskService.updateTodosOnApp(todos);
  // }



  // // CRUD

  // // Récupérer les todos d'un utilisateur
  // getTodosForUser(userId: string): Observable<Todo[]> {
  //   return this.firestore.collection<Todo>(`users/${userId}/todos`).valueChanges();
  // }


  

  // // Mettre à jour un todo spécifique
  // async updateTodoForUser(userId: string, todo: Todo): Promise<void> {
  //   await this.firestore.collection(`users/${userId}/todos`).doc(todo.id).update(todo);
  // }

  // // Supprimer un todo
  // async deleteTodoForUser(userId: string, todoId: string): Promise<void> {
  //   await this.firestore.collection(`users/${userId}/todos`).doc(todoId).delete();
  // }


}

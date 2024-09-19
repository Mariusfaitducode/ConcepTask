import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../../models/todo';
import { User } from '../../models/user';
import { UserService } from '../user/user.service';
// import { TaskService } from '../task.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TodoUtils } from '../../utils/todo-utils';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  // Gère les interactions entre l'application et firebase liées aux todos
  // Permet de synchroniser les todos entre le local storage et l'account

  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$: Observable<Todo[]> = this.todosSubject.asObservable();


  // todoListOnStorage: Todo[] = [];

  private user: User | null = null;

  private firestoreSubscription : any;

  constructor(private firestore: AngularFirestore) {

    this.getTodosFromLocalStorage();
  }


  setUserId(user: User) {
    this.user = user;
    this.syncTodosWithFirestore();
  }


  async initializeTodosFromLocalStorage(user : User){
    this.user = user;
    let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    for (let todo of todos){
      await this.addTodo(todo);
    }

    this.syncTodosWithFirestore();  // Re-synchroniser après l'initialisation
  }


  private syncTodosWithFirestore() {
    this.getTodosFromLocalStorage();

    if (this.user){
      this.firestoreSubscription = this.firestore.collection<Todo>(`users/${this.user!.uid}/todos`)
      .valueChanges({ idField: 'id' })
      .pipe(
        tap(todosFromFirestore => {

          console.log('TRY SYNC SERVICE TODOS FROM FIRESTORE : ')
          
          if (this.user){
            console.log('SYNC SERVICE TODOS FROM FIRESTORE : ', todosFromFirestore, this.todosSubject.value)

            // console.log('COMPARISON TODOS FROM FIRESTORE : ', JSON.parse(JSON.stringify(todosFromFirestore)), JSON.parse(JSON.stringify(this.todosSubject.value)))

            // TODO : Fix this comparison


            if (JSON.parse(JSON.stringify(todosFromFirestore)) != JSON.parse(JSON.stringify(this.todosSubject.value))){

              console.log('TODOS HAVE CHANGED, NEXT NEW TODOS')

              this.todosSubject.next(todosFromFirestore);
              this.updateLocalStorage(todosFromFirestore);
            }  
          }
        })
      )
      .subscribe();
    }
  }


  private getTodosFromLocalStorage() {
    const todos = JSON.parse(localStorage.getItem(`todos`) || '[]');
    this.todosSubject.next(todos);
  }

  getTodosAsInStorageWithoutSync(): Todo[]{
    return JSON.parse(localStorage.getItem(`todos`) || '[]');
  }

  private updateLocalStorage(todos: Todo[]) {
    localStorage.setItem(`todos`, JSON.stringify(todos));
  }

  
  clearLocalStorageOnLogout(){
    this.user = null;
    
    console.log("LOGOUT UNSUBSCRIBE");

    if (this.firestoreSubscription) {
      this.firestoreSubscription.unsubscribe();
    }

    this.todosSubject.next([]);
    localStorage.removeItem('todos');

    // Ensure the subscription is nullified to prevent further updates
    this.firestoreSubscription = null;
  }

  // CRUD TODO MANIPULATION

  getTodos(): Observable<Todo[]> {
    return this.todos$;
  }


  // getTodosFromFirestore(id: string){

  //   // if (this.user){
  //   //   return this.firestore.collection(`users/${this.user.uid}/todos`).doc(id).valueChanges();
  //   // }
  //   // else{
  //   //   return this.todosSubject.value.find(t => t.id === id);
  //   // }
  // }

  // Méthode pour obtenir les todos directement
  getCurrentTodos(): Todo[] {
    return this.todosSubject.getValue();
  }
  

  addTodo(todo: Todo) {

    console.log('SYNC SERVICE ADD TODO : ', todo)

    todo = JSON.parse(JSON.stringify(todo));

    

    const todos = [...this.todosSubject.value, todo];
    this.todosSubject.next(todos);
    this.updateLocalStorage(todos);

    if (this.user){
      this.firestore.collection(`users/${this.user.uid}/todos`).doc(todo.id).set(todo);
    }

  }

  updateTodo(todo: Todo) {

    console.log('SYNC SERVICE UPDATE TODO : ', todo)

    todo = JSON.parse(JSON.stringify(todo));

    const todos = this.todosSubject.value.map(t => t.id === todo.id ? todo : t);
    this.todosSubject.next(todos);
    this.updateLocalStorage(todos);

    if (this.user){
      this.firestore.collection(`users/${this.user.uid}/todos`).doc(todo.id).update(todo);

    }
  }

  deleteMainTodo(todoId: string) {

    console.log('SYNC SERVICE DELETE MAIN TODO : ', todoId)

    const todos = this.todosSubject.value.filter(t => t.id !== todoId);
    this.todosSubject.next(todos);
    this.updateLocalStorage(todos);

    if (this.user){
      this.firestore.collection(`users/${this.user.uid}/todos`).doc(todoId).delete();

    }
  }

  // TODO : externalise or simplify this system
  deleteTodoById(mainTodo: Todo, todoToDelete: Todo){

    console.log('SYNC SERVICE DELETE TODO BY ID : ', todoToDelete)

    let todos = this.todosSubject.value

    if (todoToDelete == mainTodo){ // Remove the main todo

      console.log("DELETE MAIN TODO")

      // todos = todos.filter((todo : Todo) => todo.mainId != todoToDelete.mainId);
      this.deleteMainTodo(todoToDelete.id!);
    }
    else{ // Remove the sub todo from the main todo

      TodoUtils.deleteTodoById(mainTodo, todoToDelete.id!);
      this.updateTodo(mainTodo);
    }
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../../models/todo';
import { User } from '../../models/user';
import { UserService } from '../user/user.service';
// import { TaskService } from '../task.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, last, Observable, tap } from 'rxjs';
import { TodoUtils } from '../../utils/todo-utils';

import { isEqual } from 'lodash';

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

    // Lors de l'initialisation, on récupère les todos du local storage plutôt que de firestore
    this.getTodosFromLocalStorage();
  }

  // Connection à un compte utilisateur
  // Cette méthode est appelée lors de la connexion réussie d'un utilisateur
  // Cela permet d'initier la synchronisation des todos avec firestore
  setUserId(user: User) {
    this.user = user;
    this.syncTodosWithFirestore();
  }

  // Fonction pour initialiser firestore à partir du local storage
  // Utiliser lors de la création d'un compte utilisateur
  async initializeTodosFromLocalStorageToFirestore(user : User){
    this.user = user;
    let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    for (let todo of todos){
      await this.addTodo(todo);
    }

    this.syncTodosWithFirestore();  // Re-synchroniser après l'initialisation
  }

  // Synchronisation des todos entre le local storage et firestore
  // Permet de mettre à jour les todos locaux à partir de firestore
  // TODO : Fix this method, too many updates when updating todos
  private syncTodosWithFirestore() {
    if (this.user) {

      console.log("CONNEXION Sync With Firestore INITIALIZATION")

      this.firestoreSubscription = this.firestore.collection<Todo>(`users/${this.user.uid}/todos`)
        .valueChanges({ idField: 'id' })
        .pipe(
          tap(todosFromFirestore => {
            if (this.user){
              console.log('Récupération de todos depuis firestore');
            
              const localTodos = this.getTodosAsInStorageWithoutSync();
  
              const hasChanges = !isEqual(todosFromFirestore, localTodos);
  
              if (hasChanges) {
                console.log('Différence détectée entre Firestore et localStorage');
                
                // Toujours mettre à jour le localStorage avec les données de Firestore
                console.log('Mise à jour du localStorage avec les données de Firestore');
                this.updateLocalStorage(todosFromFirestore);
              } 
              else {
                console.log('Pas de changement, pas de mise à jour du localStorage');
              }
            }
          })
        ).subscribe();
    }
  }


  // LOCAL STORAGE MANAGEMENT

  // Récupére les todos du local storage et envoie les données à l'observable
  private getTodosFromLocalStorage() {
    const todos = JSON.parse(localStorage.getItem(`todos`) || '[]');
    this.todosSubject.next(todos);
  }

  getTodosAsInStorageWithoutSync(): Todo[]{
    return JSON.parse(localStorage.getItem(`todos`) || '[]');
  }

  private updateLocalStorage(todos: Todo[]) {

    let lastTodos = JSON.parse(localStorage.getItem(`todos`) || '[]');

    if (JSON.stringify(todos) == JSON.stringify(lastTodos)){
      console.log('No need to update local storage');
    }
    else{

      console.log('Update local storage with new todos')
      localStorage.setItem(`todos`, JSON.stringify(todos));
      this.todosSubject.next(todos);
  
    }

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
  // Create, Read, Update, Delete


  // CREATE

  // Ajoute un todo à la liste des todos
  addTodo(todo: Todo) {

    console.log('SYNC SERVICE ADD TODO : ', todo)

    todo = JSON.parse(JSON.stringify(todo));

    

    const todos = [...this.todosSubject.value, todo];
    // this.todosSubject.next(todos);
    this.updateLocalStorage(todos);

    if (this.user){
      this.firestore.collection(`users/${this.user.uid}/todos`).doc(todo.id).set(todo);
    }

  }


  // READ

  // Méthode pour obtenir les todos sous forme d'observable
  // Permet de récupérer la liste des todos, et de s'abonner à chaque changements ou mises à jour
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


  // Méthode pour obtenir les todos directement sans passer par l'observable et souscrire à des changements
  getCurrentTodos(): Todo[] {
    return this.todosSubject.getValue();
  }
  

  
  // UPDATE

  // Met à jour un todo dans la liste des todos
  updateTodo(todo: Todo) {

    console.log('SYNC SERVICE UPDATE TODO : ', todo)

    // On clone le todo pour éviter les problèmes de références
    todo = JSON.parse(JSON.stringify(todo));

    // On met à jour le todo dans la liste des todos
    const todos = this.todosSubject.value.map(t => t.id === todo.id ? todo : t);


    // this.todosSubject.next(todos);
    this.updateLocalStorage(todos);

    if (this.user){
      this.firestore.collection(`users/${this.user.uid}/todos`).doc(todo.id).update(todo);

    }
  }


  // DELETE

  // Supprime un todo racine de la liste des todos
  deleteMainTodo(todoId: string) {

    console.log('SYNC SERVICE DELETE MAIN TODO : ', todoId)

    const todos = this.todosSubject.value.filter(t => t.id !== todoId);
    // this.todosSubject.next(todos);
    this.updateLocalStorage(todos);

    if (this.user){
      this.firestore.collection(`users/${this.user.uid}/todos`).doc(todoId).delete();

    }
  }

  // Supprime un todo en fonction de son id
  // Utiliser notamment pour supprimer un todo enfant
  // Dans ce cas on supprime le todo enfant du todo parent et on met à jour le todo parent
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

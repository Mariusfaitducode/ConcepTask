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

  private user: User | null = null;

  private firestoreSubscription : any;


  constructor(private firestore: AngularFirestore) {
    // Lors de l'initialisation, on récupère les todos du local storage plutôt que de firestore
    let todos = this.getTodosAsInStorageWithoutSync();
    // On transmet les todos du local storage à l'observable
    this.todosSubject.next(todos);
  }


  // Connection à un compte utilisateur
  // Cette méthode est appelée lors de la connexion réussie d'un utilisateur
  // Cela permet d'initier la synchronisation des todos avec firestore
  setUserId(user: User) {
    this.user = user;
    this.syncTodosWithFirestore();
  }

  // Création d'un compte utilisateur
  // Fonction pour initialiser firestore à partir du local storage
  // Cela permet de remplir firestore avec les todos du local storage
  async initializeTodosFromLocalStorageToFirestore(user : User){
    this.user = user;
    let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    // On ajoute chaque todo du local storage à firestore
    for (let todo of todos){
      await this.addTodo(todo);
    }

    // Initiation de la synchronisation des todos avec firestore    
    this.syncTodosWithFirestore(); 
  }


  // FIRESTORE SYNCHRONIZATION

  // Synchronisation des todos de firestore vers le localstorage
  // Permet de mettre à jour les todos locaux à partir de firestore
  private syncTodosWithFirestore() {

    // Seulement si l'utilisateur est bien connecté
    if (this.user) {

      // La fonction est appelée lors de la connexion d'un utilisateur

      // Se désabonner de la collection des todos de l'utilisateur
      if (this.firestoreSubscription) {
        this.firestoreSubscription.unsubscribe();
      }

      // Ce message doit être affiché une seule fois lors de la connexion
      console.log("CONNEXION Sync With Firestore INITIALIZATION")

      // On s'abonne aux changements de la collection des todos de l'utilisateur
      this.firestoreSubscription = this.firestore.collection<Todo>(`users/${this.user.uid}/todos`)
        .valueChanges({ idField: 'id' })
        .pipe(
          tap(todosFromFirestore => {

            // A chaque changement dans firestore, on entre dans cette fonction
            // On vérifie tout de même si l'utilisateur est toujours connecté
            if (this.user){

              console.log('Récupération de todos depuis firestore');
            
              // On récupère les todos du local storage qu'on compare avec les todos de firestore
              // L'utilisation de lodash permet de comparer les objets de manière profonde (deep comparison)
              // Evite les problèmes de références et d'ordres de propriétés avec JSON.stringify
              const localTodos = this.getTodosAsInStorageWithoutSync();
              const hasChanges = !isEqual(todosFromFirestore, localTodos);
  
              // Seulement si il y a une différence entre les todos de firestore et du local storage on met à jour le local storage
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

  // Retourne les todos du local storage
  getTodosAsInStorageWithoutSync(): Todo[]{
    return JSON.parse(localStorage.getItem(`todos`) || '[]');
  }

  // Met à jour le local storage avec les todos fournis
  // En cas de différence avec les todos actuels du local storage on met à jour le local storage et on notifie les observateurs
  private updateLocalStorage(todos: Todo[]) {

    // Comparaison profonde de entre les todos actuels et les nouveaux todos
    const localTodos = this.getTodosAsInStorageWithoutSync();
    const hasChanges = !isEqual(todos, localTodos)
    
    // Si il y a une différence on met à jour le local storage et on notifie les observateurs
    if (hasChanges){
      console.log('Update local storage with new todos')
      localStorage.setItem(`todos`, JSON.stringify(todos));
      this.todosSubject.next(todos);
    }
    else{
      console.log('No need to update local storage');  
    }
  }

  
  // Déconnexion d'un utilisateur
  // Cette méthode est appelée lors de la déconnexion d'un utilisateur
  // Elle permet de vider les todos du local storage et de se désabonner des observables
  clearLocalStorageOnLogout(){
    this.user = null;
    
    console.log("LOGOUT UNSUBSCRIBE");

    // Se désabonner de la collection des todos de l'utilisateur
    if (this.firestoreSubscription) {
      this.firestoreSubscription.unsubscribe();
    }

    // Vider les todos du local storage et notifier les observateurs
    this.todosSubject.next([]);
    localStorage.removeItem('todos');

    // S'assurer que l'abonnement est annulé pour empêcher toute mise à jour ultérieure.
    this.firestoreSubscription = null;
  }



  // CRUD TODO MANIPULATION
  // Create, Read, Update, Delete


  // CREATE

  // Ajoute un todo à la liste des todos
  addTodo(todo: Todo) {

    console.log('SYNC SERVICE ADD TODO : ', todo)

    // On clone le todo pour éviter les problèmes de références
    todo = JSON.parse(JSON.stringify(todo));
    
    // On ajoute le todo en tête de la liste des todos
    const todos = [...this.todosSubject.value, todo];
    
    // On met à jour le local storage avec les nouveaux todos
    this.updateLocalStorage(todos);

    if (this.user){
      // On ajoute le todo à la collection des todos de l'utilisateur dans firestore
      this.firestore.collection(`users/${this.user.uid}/todos`).doc(todo.id).set(todo);
    }

  }


  // READ

  // Méthode pour obtenir les todos sous forme d'observable
  // Permet de récupérer la liste des todos, et de s'abonner à chaque changements ou mises à jour
  getTodos(): Observable<Todo[]> {
    return this.todos$;
  }

  
  // UPDATE

  // Met à jour un todo dans la liste des todos
  updateTodo(todo: Todo) {

    console.log('SYNC SERVICE UPDATE TODO : ', todo)

    // On clone le todo pour éviter les problèmes de références
    todo = JSON.parse(JSON.stringify(todo));

    // On met à jour le todo dans la liste des todos
    const todos = this.todosSubject.value.map(t => t.id === todo.id ? todo : t);

    // On met à jour le local storage avec les nouveaux todos
    this.updateLocalStorage(todos);

    if (this.user){
      // On met à jour le todo dans la collection des todos de l'utilisateur dans firestore
      this.firestore.collection(`users/${this.user.uid}/todos`).doc(todo.id).update(todo);
    }
  }


  // DELETE

  // Supprime un todo racine de la liste des todos
  deleteMainTodo(todoId: string) {

    console.log('SYNC SERVICE DELETE MAIN TODO : ', todoId)

    // On filtre la liste des todos pour supprimer le todo en fonction de son id
    const todos = this.todosSubject.value.filter(t => t.id !== todoId);
    
    // On met à jour le local storage avec les nouveaux todos
    this.updateLocalStorage(todos);

    if (this.user){
      // On supprime le todo de la collection des todos de l'utilisateur dans firestore
      this.firestore.collection(`users/${this.user.uid}/todos`).doc(todoId).delete();
    }
  }

  // Supprime un todo en fonction de son id
  // Utiliser notamment pour supprimer un todo enfant
  // Dans ce cas on supprime le todo enfant du todo parent et on met à jour le todo parent
  // TODO : externalise or simplify this system
  deleteTodoById(mainTodo: Todo, todoToDelete: Todo){

    console.log('SYNC SERVICE DELETE TODO BY ID : ', todoToDelete)

    // On vérifie si le todo à supprimer est le todo racine ou un sous-todo
    // Si todoToDelete est le todo racine on appelle la méthode deleteMainTodo
    if (todoToDelete == mainTodo){ 

      this.deleteMainTodo(todoToDelete.id!);
    }
    else{ 
      // Si todoToDelete est un sous-todo on le supprime du todo racine 
      TodoUtils.deleteTodoById(mainTodo, todoToDelete.id!);
      
      // On met ensuite à jour le todo racine
      this.updateTodo(mainTodo);
    }
  }

}

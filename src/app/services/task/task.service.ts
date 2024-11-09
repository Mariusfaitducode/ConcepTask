import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Todo } from '../../models/todo';
import { User } from '../../models/user';
import { UserService } from '../user/user.service';
// import { TaskService } from '../task.service';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, last, map, Observable, tap } from 'rxjs';
import { TodoUtils } from '../../utils/todo-utils';
import { MainTodo } from 'src/app/models/todo/main-todo';
import { SubTodo } from 'src/app/models/todo/sub-todo';

import { isEqual } from 'lodash';
import { RefactorTodos } from 'src/app/utils/refactor-todos';
import { Todo } from 'src/app/models/todo';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  // Gère les interactions entre l'application et firebase liées aux todos
  // Permet de synchroniser les todos entre le local storage et l'account

  private todosSubject = new BehaviorSubject<MainTodo[]>([]);
  todos$: Observable<MainTodo[]> = this.todosSubject.asObservable();

  private user: User | null = null;

  private firestoreSubscription : any;

  // private refactorTodos: MainTodo[] = [];


  constructor(private firestore: AngularFirestore) {
    // Lors de l'initialisation, on récupère les todos du local storage plutôt que de firestore
    let todos  = this.getTodosAsInStorageWithoutSync();
    // let todos: MainTodo[] = [];

    // ! Code pour refactor les todos de la classe Todo vers MainTodo puis synchroniser
    // On refactor les todos
    // this.refactorTodos = RefactorTodos.refactorTodos(todos);



    // On transmet les todos du local storage à l'observable
    this.todosSubject.next(todos);
  }


  // Connection à un compte utilisateur
  // Cette méthode est appelée lors de la connexion réussie d'un utilisateur
  // Cela permet d'initier la synchronisation des todos avec firestore
  async setUserId(user: User) {
    this.user = user;

    console.log('setUserId')

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


  // * FIRESTORE SYNCHRONIZATION

  // Synchronisation des todos de firestore vers le localstorage
  // Permet de mettre à jour les todos locaux à partir de firestore
  private async syncTodosWithFirestore() {
    if (this.user) {
      console.log("CONNEXION Sync With Firestore INITIALIZATION");

      // Désabonnement de l'ancienne souscription si elle existe
      if (this.firestoreSubscription) {
        this.firestoreSubscription.unsubscribe();
      }

      // Tableau pour stocker toutes les observables de todos
      const observables: Observable<MainTodo[]>[] = [];

      // Observable pour les todos personnels de l'utilisateur
      const personalTodosObservable = this.firestore.collection<MainTodo>(`users/${this.user.uid}/todos`)
        .valueChanges({ idField: 'id' });
      observables.push(personalTodosObservable);

      // * Observables pour les todos des équipes de l'utilisateur
      // if (this.user.teams && this.user.teams.length > 0) {
      //   for (let teamId of this.user.teams) {
      //     const teamTodosObservable = this.firestore.collection<MainTodo>(`teams/${teamId}/todos`)
      //       .valueChanges({ idField: 'id' });
      //     observables.push(teamTodosObservable);
      //   }
      // }

      // Utilisation de combineLatest pour combiner toutes les observables
      this.firestoreSubscription = combineLatest(observables).pipe(
        // map transforme le tableau de tableaux de todos en un seul tableau plat
        map((todoArrays: MainTodo[][]) => todoArrays.reduce((acc, curr) => acc.concat(curr), [])),
        // tap effectue des opérations sans modifier le flux de données
        tap((allTodos: MainTodo[]) => {
          console.log('Récupération de tous les todos (personnels et d\'équipe)');
          const localTodos = this.getTodosAsInStorageWithoutSync();
          const hasChanges = !isEqual(allTodos, localTodos);

          if (hasChanges) {
            console.log('Différence détectée entre Firestore et localStorage');
            console.log('Mise à jour du localStorage avec toutes les données');
            this.updateLocalStorage(allTodos);
          } else {
            console.log('Pas de changement, pas de mise à jour du localStorage');
          }
        })
      ).subscribe();

      // Explication détaillée du fonctionnement :
      // 1. combineLatest combine les dernières valeurs émises par chaque observable
      // 2. Chaque fois qu'une des collections Firestore change (personnel ou équipe),
      //    combineLatest émet un nouveau tableau contenant les dernières valeurs de toutes les collections
      // 3. map aplatit ce tableau de tableaux en un seul tableau contenant tous les todos
      // 4. tap est utilisé pour effectuer des opérations secondaires (logging, mise à jour du localStorage)
      //    sans modifier le flux de données
      // 5. La comparaison avec le localStorage est effectuée à chaque émission
      // 6. Si des changements sont détectés, le localStorage est mis à jour
      // 7. Cette logique s'exécute à chaque modification dans n'importe quelle collection Firestore observée
    }
  }


  // * LOCAL STORAGE MANAGEMENT

  // Retourne les todos du local storage
  getTodosAsInStorageWithoutSync(): MainTodo[]{
    return JSON.parse(localStorage.getItem(`todos`) || '[]');
  }

  // Met à jour le local storage avec les todos fournis
  // En cas de différence avec les todos actuels du local storage on met à jour le local storage et on notifie les observateurs
  private updateLocalStorage(todos: MainTodo[]) {

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



  // * CRUD TODO MANIPULATION
  // * Create, Read, Update, Delete


  // * CREATE

  // Ajoute un todo à la liste des todos
  addTodo(todo: MainTodo) {

    console.log('SYNC SERVICE ADD TODO : ', todo)

    // On clone le todo pour éviter les problèmes de références
    todo = JSON.parse(JSON.stringify(todo));
    
    // On ajoute le todo en tête de la liste des todos
    const todos = [...this.todosSubject.value, todo];
    
    // On met à jour le local storage avec les nouveaux todos
    this.updateLocalStorage(todos);

    if (this.user){

      if (todo.onTeamSpace){
        // On ajoute le todo à la team space correspondante
        this.firestore.collection(`teams/${todo.spaceId}/todos`).doc(todo.id).set(todo);
      }
      else{
      // On ajoute le todo à la collection des todos de l'utilisateur dans firestore
        this.firestore.collection(`users/${this.user.uid}/todos`).doc(todo.id).set(todo);
      }
    }
  }


  // * READ

  // Méthode pour obtenir les todos sous forme d'observable
  // Permet de récupérer la liste des todos, et de s'abonner à chaque changements ou mises à jour
  getTodos(): Observable<MainTodo[]> {
    return this.todos$;
  }

  
  // * UPDATE

  // Met à jour un todo dans la liste des todos
  updateTodo(todo: MainTodo) {

    console.log('SYNC SERVICE UPDATE TODO : ', todo)

    // On clone le todo pour éviter les problèmes de références
    todo = JSON.parse(JSON.stringify(todo));

    // On met à jour le todo dans la liste des todos
    const todos = this.todosSubject.value.map(t => t.id === todo.id ? todo : t);

    // On met à jour le local storage avec les nouveaux todos
    this.updateLocalStorage(todos);

    if (this.user){

      if (todo.onTeamSpace){
        // On met à jour le todo dans la collection des todos de la team dans firestore
        this.firestore.collection(`teams/${todo.spaceId}/todos`).doc(todo.id).update(todo);
      }
      else{
        // On met à jour le todo dans la collection des todos de l'utilisateur dans firestore
        this.firestore.collection(`users/${this.user.uid}/todos`).doc(todo.id).update(todo);
      }
    }
  }


  // * DELETE

  // Supprime un todo racine de la liste des todos
  deleteMainTodo(mainTodo: MainTodo) {

    console.log('SYNC SERVICE DELETE MAIN TODO : ', mainTodo.properties.title)

    // On filtre la liste des todos pour supprimer le todo en fonction de son id
    const todos = this.todosSubject.value.filter(t => t.id !== mainTodo.id);
    
    // On met à jour le local storage avec les nouveaux todos
    this.updateLocalStorage(todos);

    if (this.user){

      if (mainTodo.onTeamSpace){
        // On supprime le todo de la collection des todos de la team dans firestore
        this.firestore.collection(`teams/${mainTodo.spaceId}/todos`).doc(mainTodo.id).delete();
      }
      else{
        // On supprime le todo de la collection des todos de l'utilisateur dans firestore
        this.firestore.collection(`users/${this.user.uid}/todos`).doc(mainTodo.id).delete();
      }
    }
  }

  // Supprime un todo en fonction de son id
  // Utiliser notamment pour supprimer un todo enfant
  // Dans ce cas on supprime le todo enfant du todo parent et on met à jour le todo parent
  // TODO : externalise or simplify this system
  deleteTodoById(mainTodo: MainTodo, todoToDelete: MainTodo | SubTodo){

    console.log('SYNC SERVICE DELETE TODO BY ID : ', todoToDelete)

    // On vérifie si le todo à supprimer est le todo racine ou un sous-todo
    // Si todoToDelete est le todo racine on appelle la méthode deleteMainTodo
    if (todoToDelete == mainTodo){ 

      this.deleteMainTodo(mainTodo);
    }
    else{ 
      // Si todoToDelete est un sous-todo on le supprime du todo racine 
      TodoUtils.deleteTodoById(mainTodo, todoToDelete.id!);
      
      // On met ensuite à jour le todo racine
      this.updateTodo(mainTodo);
    }
  }

}

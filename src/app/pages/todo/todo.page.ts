import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ItemReorderEventDetail, NavController, Platform } from '@ionic/angular';
// import { Todo } from 'src/app/models/todo';
import { Dialog } from '@capacitor/dialog';

import { CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragAndDrop } from 'src/app/utils/drag-and-drop';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from 'src/app/models/settings';
// import { TaskService } from 'src/app/services/task.service';
import { TodoDate } from 'src/app/utils/todo-date';
import { TodoColor } from 'src/app/utils/todo-color';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { TaskService } from 'src/app/services/task/task.service';
import { TodoUtils } from 'src/app/utils/todo-utils';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { find, Subscription } from 'rxjs';
import { GraphComponent } from 'src/app/components/graph/graph.component';
import { TaskModal } from 'src/app/models/task-modal';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';
import { set } from 'firebase/database';

import { isEqual } from 'lodash';
import { MainTodo } from 'src/app/models/todo/main-todo';
import { SubTodo } from 'src/app/models/todo/sub-todo';
import { Team } from 'src/app/models/team';
import { TeamService } from 'src/app/services/team/team.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {

  constructor(
    private navCtrl: NavController, 
    private route : ActivatedRoute, 
    private router : Router,
    private platform : Platform,
    private translate : TranslateService,
    private userService : UserService,
    private taskService : TaskService,
    private teamService : TeamService,
    private settingsService : SettingsService,
    private elRef: ElementRef
  ){}

  // User
  // userSubscription! : Subscription;
  user : User | null = null;

  // Todo objects
  // todoSubscription! : Subscription;
  todos: MainTodo[] = [];

  mainTodo! : MainTodo;
  todo!: MainTodo | SubTodo;

  // Team
  team : Team | null = null;

  initialTodoWithoutModification! : MainTodo | SubTodo | undefined;


  isNewTodo : boolean = false;
  editMode : boolean = false;

  modalConfig: TaskModal = new TaskModal();


  synchronizationInProgress : boolean = false;

  
  // History for navigation
  todoHistoryList : (MainTodo | SubTodo)[] = [];

  // Drag and drop need
  dragAndDropTodosDatas : {todo: SubTodo, level: number}[][] = [];

  // Visualisation

  subMode : string = "tree";

  scrollTop : number = 0;

  isKeyboardVisible = false;

  // Graph conceptor
  @ViewChild(GraphComponent) graphComponent!: GraphComponent;

  @ViewChild(IonContent, { static: false }) content!: IonContent;


  ngOnInit() {

    // Événement lorsque le clavier est affiché

    if (Capacitor.isPluginAvailable('Keyboard')) {
      Keyboard.addListener('keyboardWillShow', () => {
        this.isKeyboardVisible = true;
      });
  
      // Événement lorsque le clavier est masqué
      Keyboard.addListener('keyboardWillHide', () => {
        this.isKeyboardVisible = false;
      });
    }

    // Gestion du bouton retour sur android

    this.platform.backButton.subscribeWithPriority(0, async () => {
      this.goBackTodo();
    });
    
    // Récupération de l'utilisateur

    this.userService.getUser().subscribe((user : User | null) => {
      console.log('Todo page : User get', user)
      this.user = user;
    });

    // Actualisation des todos 

    this.route.params.subscribe((params) => { // A chaque changement des paramètres de l'url

      this.settingsService.initPage(this.translate); // Settings initialization : theme, language


      // Récupération des todos de l'utilisateur, lors de la première arrivée sur la page et à chaque actualization des todos

      this.taskService.getTodos().subscribe((todos: MainTodo[]) =>{

        // Si la liste des todos n'est pas vide et que les todos sont les mêmes, on ne fait rien, pas besoin de recharger les todos

        if (this.todos.length != 0 && isEqual(this.todos, todos)){
          console.log('Todos are the same, no need to reload todos on TODO PAGE')
          return;
        }

        console.log('Todos loaded in todo page:', todos, this.todos)
        this.todos = todos; // Actualisation de la liste des todos

        // NEW TODO
        // Si pas d'id dans les paramètres, c'est un nouveau todo
        if (params['id'] == undefined) { 

          console.log('NEW TODO')

          this.mainTodo = new MainTodo(); // Création d'un nouveau todo
          this.todo = this.mainTodo;

          if (params['teamId']){ // Nouveau todo dans l'espace team
            this.mainTodo.onTeamSpace = true;
            this.mainTodo.spaceId = params['teamId'];

            

          }

          if (params['day'] && params['month'] && params['year']){ // Nouveau todo avec date venant du calendrier

            // Configuration à l'avance de la date
            this.todo.properties.config.date = true;
            const formattedDate = TodoDate.getFormattedDateFromYearMonthDay(params['year'], params['month'], params['day'])
            this.todo.properties.date = formattedDate;
            document.getElementById('datePicker')?.setAttribute('value', this.todo.properties.date);
          }

          this.isNewTodo = true;
          this.editMode = true;
        }
        // EXISTING TODO
        // Si un id est présent dans les paramètres, c'est un todo existant
        else { 
          if (this.todos.length == 0) return;

          // Recherche du todo principal, dans la liste des todos
          let mainTodo = this.todos.find(todo => todo.id == params['id']);

          // POSSIBLY SUB TODO
          // Si le todo principal n'est pas trouvé, c'est peut-être un sous-todo
          if (mainTodo == undefined){ 

            let findTodo = false;

            for (let todo of this.todos){
              let subTodo = TodoUtils.findSubTodoById(todo, params['id']);
              if (subTodo){
                this.mainTodo = todo; // Le todo principal est le todo parent contenant le sous-todo
                this.todo = subTodo;  // Le todo est le sous-todo trouvé avec l'id
                findTodo = true;
                break;
              }
            }
            if (!findTodo) return; // Si le sous-todo n'est pas trouvé, on ne fait rien
          }

          // FOUND MAIN TODO
          // Sinon le todo principal est trouvé
          else{
            this.mainTodo = mainTodo;

            // Si nous avions déjà un todo, nous le recherchons dans la liste des sous-todos pour l'actualiser
            // Permet de gérer les cas d'actualisation de la page avec un todo déjà ouvert
            // Sinon, le todo actuel devient le mainTodo
            if (this.todo){
              // Actualization du todo actuel
              this.todo = TodoUtils.findSubTodoById(this.mainTodo, this.todo.id) || this.mainTodo;
  
              // Réinitialization de l'historique des todos par leurs todos actualisés
              for (let i = 0; i < this.todoHistoryList.length; i++) {
                this.todoHistoryList[i] = TodoUtils.findSubTodoById(this.mainTodo, this.todoHistoryList[i].id) || this.mainTodo;
              }
            }
            else{
              // Si le todo actuel n'est pas trouvé, nous venons de charger la page, le todo actuel est le mainTodo
              this.todo = this.mainTodo;
            }
          }
        }


        // Récupération de la team si le todo est dans l'espace team
        if (this.mainTodo.onTeamSpace){
          this.teamService.getTeamById(this.mainTodo.spaceId).subscribe((team: Team | null) => {
            if (team){
              this.team = team;
            }
          });
        }

        // Initialisation pour drag and drop indexs
        // Permet d'actualiser les sous-todos et les niveaux de profondeur pour les drags and drops à chaque actualization des todos
        if (this.todo){
          this.initializeDragDropList(); 
        }

        // Vérification de la synchronisation du todo
        // Si le todo n'est pas nouveau et pas synchronisé avec le localstorage, on l'actualise
        // if ( !this.isNewTodo && !this.isMainTodoSynchronized() ) {
        //   console.log("TODO NOT SYNCHRONIZED ON ROUTE PARAMS ACTUALIZATION")
        //   this.taskService.updateTodo(this.mainTodo);
        // }
      });
    });
  }

  // * SYNCHRONIZATION
  // Vérifie si le mainTodo est bien synchronisé avec le localstorage
  // Permet de savoir si l'utilisateur a modifié le todo
  isMainTodoSynchronized(): boolean {
    let synchronized: boolean = this.mainTodo && JSON.stringify(this.mainTodo) == JSON.stringify(this.taskService.getTodosAsInStorageWithoutSync().find(todo => todo.id == this.mainTodo.id));
    // console.log("TODO SYNCHRONIZED", synchronized)

    if (!synchronized && !this.isNewTodo && this.mainTodo != undefined && !this.synchronizationInProgress) {

      // Permet de vérifier si le todo est toujours dans la liste des todos à synchroniser
      // Evite le cas d'actualization après une suppression du mainTodo
      let todo = this.taskService.getTodosAsInStorageWithoutSync().find(todo => todo.id == this.mainTodo.id);

      if (todo){
        console.log("LAUNCH SYNCHRONIZATION", synchronized)
        this.synchronizationInProgress = true;
        
        setTimeout(() => {
          this.taskService.updateTodo(this.mainTodo);   
          this.synchronizationInProgress = false;
        }, 100);
      }
    }

    return synchronized;
  }


  // * DRAG AND DROP SETUP
  // Actualise la liste des sous-todos et les niveaux de profondeur pour les drags and drops
  // Cette liste permet de gérer les données des containers pour les drags and drops
  // Elle est transféré au composant todo-subtasks-tree qui la transmet à [cdkDropListData]
  // La fonction doit être appelée à chaque fois que l'arbre des todos est modifié 
  initializeDragDropList(){

    this.dragAndDropTodosDatas = [];

    // Permet d'avoir la liste des taches visibles dans l'arbre des todos
    for (let subTask of this.todo.list!) {
      if (!this.mainTodo.hideDoneTasks || !subTask.properties.isDone){

        // Pour chaque sous tache du premier niveau, 
        // on ajoute tous les enfants de celui-ci sous forme de liste en ordre descendant (dfs)
        this.dragAndDropTodosDatas.push(TodoUtils.transformTodoInListByDepth(subTask, this.mainTodo.hideDoneTasks));
      }
      else{
        // Ajout d'une liste vide pour les taches cachées
        // Permet de conserver la structure de l'arbre des todos et éviter des décalages d'indexs
        this.dragAndDropTodosDatas.push([]); 
      }
    }
    console.log('INITIALIZE SUBTASK FOR DRAG AND DROP', this.dragAndDropTodosDatas)
  }


  // * SCROLL Tree / Graph management
  // Permet de gérer le scroll de la page et de bloquer le scroll sur la division scroll-step
  // Permet de gérer la hauteur du graphique en fonction du scroll
  onContentScroll(event : any){

    // Référence de la position du scroll, position y du haut de la page
    this.scrollTop = event.detail.scrollTop;

    // Calcul de la hauteur du graphique en fonction du scroll
    this.calcGraphHeightOnScroll(event)

    // Permet de bloquer le scroll sur la division scroll-step
    // La division scroll-step est utilisée pour permettre un scroll pouvant agrandir le graphique
    // Il faut quand même bloquer le scroll pour éviter de scroller plus loin que nécessaire en mode "tree
    if (this.subMode == 'tree'){

      // La classe list-page est la division contenant toutes les informations de la page
      // Excepté le graphique, le header et les modals
      const contentHeight = this.elRef.nativeElement.querySelector('.list-page').clientHeight;

      // Si le scroll dépasse la hauteur de la division list-page, on bloque le scroll car on est au bout de la page
      // La hauteur du header est de 100px, on laisse 80px de marge
      // TODO : fix lagging effect when scrolling to the bottom
      if (this.scrollTop >= contentHeight - window.innerHeight + 180) {

        console.log("scroll stop on tree mode")
        // Bloque le scroll à la position maximale
        event.target.scrollToPoint(0, contentHeight - window.innerHeight + 180);
        return;
      }
    } 
  }

  // * GRAPH HEIGHT CALCULATION
  // Permet de calculer la hauteur du graphique en fonction du scroll si le mode graph est activé
  calcGraphHeightOnScroll(event : any){

    // Si le graphique est activé
    if (this.graphComponent){


      const contentHeight = this.elRef.nativeElement.querySelector('.list-page').clientHeight;
      const windowHeight = window.innerHeight;

      // Calculez la nouvelle hauteur pour le graphique
      // La hauteur du graphique est égale à la hauteur de la page (windowHeight)
      // moins la hauteur de la division list-page visible (contentHeight - this.scrollTop)
      // moins la hauteur du header (100px) moins la hauteur du footer tabs (56px)
      let graphHeight = windowHeight - contentHeight + this.scrollTop - 156;

      // console.log("calc graph height on scroll", graphHeight)

      // Pour éviter de scroller plus loin que nécessaire
      // Si le scroll dépasse la hauteur de la division list-page, on bloque le scroll car on est au bout de la page
      // On soustrait 56 pour garder le ion-segment "tree" ou "graph" visible
      if (this.scrollTop >= contentHeight - 56) {
        // console.log("scroll stop")
        if (event && event.target && typeof event.target.scrollToPoint === 'function') {
          event.target.scrollToPoint(0, contentHeight - 56);
        }
        return;
      }

      // Ajustez la taille du graphique
      // On appelle la fonction resizeGraph du graphComponent qui se met à jour lui même
      this.graphComponent.resizeGraph(graphHeight);
    }
  }

  // Permet d'initialiser la hauteur du graphique lors du changement de mode
  initializeGraphHeight(){

    console.log(this.subMode)

    // Attendre 0ms pour que le graphique soit bien initialisé
    setTimeout(() => {
      if (this.graphComponent){
        // Actualisation de la hauteur du graphique
        this.calcGraphHeightOnScroll({detail: {scrollTop: this.scrollTop}});
      }
    }, 0)
  }

  // Change le mode de visualisation entre "tree" et "graph"
  changeSubMode(subMode : string){
    this.subMode = subMode;

    if (subMode == 'graph'){
      // Actualisation du système de subIds / parentIds pour la construction du graphique
      this.assignIds();

      // Actualisation de la hauteur du graphique
      this.initializeGraphHeight();
    }
  }



  // * NAVIGATION
  // Permet de naviguer entre les différents sous todos de mainTodo
  // S'active lors de la sélection d'un todo dans le composant todo-subtasks-tree ou dans le graph
  onNewTodoSelected(todo: SubTodo | MainTodo){

    // Si le todo sélectionné est différent du todo actuel, on le sélectionne
    if (todo !== this.todo){ 

      // Si le todo sélectionné est différent de mainTodo, on actualise l'historique des todos
      // Sinon, on vide l'historique des todos
      // Permet de savoir ou aller lors du click sur le bouton retour
      if (todo != this.mainTodo){
        this.todoHistoryList.push(this.todo);
      }
      else{
        this.todoHistoryList = [];
      }

      // Actualisation du todo actuel
      this.todo = todo;

      // Actualisation de la hauteur du scroll pour voir toutes les informations du todo
      console.log("automatic scroll to top")
      this.content.scrollToTop(300);
      // Actualisation de la hauteur du graphique
      this.initializeGraphHeight();
      // Actualisation de la liste des sous-todos pour les drags and drops
      this.initializeDragDropList();
    }
  }

  // Permet de retourner en arrière lors de la sélection du bouton retour (header back button ou platform back button)
  // Suit l'historique des todos pour revenir en arrière
  goBackTodo(){

    // Si l'historique des todos n'est pas vide et que le mode est "tree" on revient vers le todo précédent
    if (this.todoHistoryList.length > 0 && this.subMode == 'tree'){
      this.todo = this.todoHistoryList.pop()!;
    }
    // Sinon, on retourne vers la page précédente
    else{

      // Si le todo est nouveau et que le titre n'est pas vide ou que la config n'est pas vide, on demande une confirmation avant de quitter la page 
      if (this.isNewTodo && (this.mainTodo.properties.title != "" || JSON.stringify(this.mainTodo.properties.config) != JSON.stringify(new MainTodo().properties.config))) {

        this.showCloseConfirm();
      }
      else{
        // Retour à la page précédente
        this.navCtrl.back();
      }
    }

    // On actualise la liste des sous-todos pour les drags and drops
    this.initializeDragDropList();
  }



  // * MANIPULATION DU TODO
  // Permet le toggle du mode modification
  modifyTodo(editMode : boolean){ 

    // Met à jour le mode modification
    this.editMode = editMode;
  }



  // MODIFICATION PROPRIETES TODO

  // Set todo as DONE
  setTodoValidation(isDone: boolean){
    this.todo.properties.isDone = isDone;

    if (this.user){
      this.userService.setUserTodosTracker(this.user, this.todo);
    }
  }



  // * AJOUT D'UN NOUVEAU TODO DANS LE STORAGE

  // Permet de sauvegarder un nouveau todo 
  saveNewTodo(){

    // Set subId and parentId for each todo, pas forcément nécessaire, surtout utile pour le graph
    this.assignIds(); // A vérifier

    // Ajout du todo dans le storage par TaskService 
    this.taskService.addTodo(this.mainTodo);

    // Retour à la page précédente
    this.navCtrl.back()
  }

  // Vérifie qu'il y'ait assez d'informations pour sauvegarder un nouveau todo
  canSaveTodo(){
    if (this.todo.properties.title == undefined || this.todo.properties.title == "") {
      return false;
    }
    return true;
  }

  

  // Assignes les subIds et parentIds pour chaque todo et sous-todo
  // Surtout utile pour construire le graph
  assignIds(): void {

    console.log("assign ids function")

    // this.newTodo.mainId = this.newTodo.id;

    let copyList = [...this.mainTodo.list!];

    let queue = [{ list: copyList, parentId: 0 }];

    let id = 1;

    for (let i = 0; i < queue.length; i++) {
      while (queue[i].list.length > 0) {

        let todo = queue[i].list.shift()!;

        // todo.main = false;
        todo.subId = id++;
        todo.parentId = queue[i].parentId;

        if (todo.list) {
          queue.push({ list: [...todo.list], parentId: todo.subId });
        }
      }
    }
  }


  // * MESSAGE POP UP : DELETE TODO, CONFIRMATION, CANCEL

  // * DELETE TODO
  // Message de confirmation avant de supprimer un todo
  showConfirmDeleteTodo = async () => {

    console.log("show confirm delete todo", this.todo.properties.title)

    // Vérifie si l'utilisateur veut vraiment supprimer le todo
    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: `${this.translate.instant('DELETE MESSAGE')} `+ this.todo.properties.title +` ?`,
    });

    // Si l'utilisateur confirme la suppression, alors on supprime le todo
    if (value) {

      console.log("delete todo", this.todo.properties.title)

      // Suppression du todo par TaskService
      this.taskService.deleteTodoById(this.mainTodo, this.todo);

      // Retour à la page précédente si le todo supprimé est le mainTodo
      if (this.todo == this.mainTodo){
        this.navCtrl.back();
      }
      // Sinon, on revient au todo parent
      else{
        this.onNewTodoSelected(this.mainTodo);
      }
    }
  };


    

    // Message de confirmation avant de quitter la page
    // Utilisé seulement lors de la création d'un nouveau todo
    showCloseConfirm = async () => {

      // Vérifie si l'utilisateur veut vraiment quitter la page sans sauvegarder le nouveau todo
      const { value } = await Dialog.confirm({
        title: 'Confirm',
        message: `${this.translate.instant('LOOSE CHANGE MESSAGE')}`,
      });
  
      // Si l'utilisateur confirme, alors on quitte la page
      if (value) {
        console.log("should loose change")
        
        this.navCtrl.back();
      }
      
    };
  

}

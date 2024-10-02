import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ItemReorderEventDetail, NavController, Platform } from '@ionic/angular';
import { Todo } from 'src/app/models/todo';
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


@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit, OnDestroy {

  constructor(
    private navCtrl: NavController, 
    private route : ActivatedRoute, 
    private router : Router,
    private platform : Platform,
    private translate : TranslateService,
    private userService : UserService,
    private taskService : TaskService,
    private settingsService : SettingsService,
    private elRef: ElementRef
  ){}

  // User
  userSubscription! : Subscription;
  user : User | null = null;

  // Todo objects
  // todoSubscription! : Subscription;
  todos: Todo[] = [];

  mainTodo! : Todo;
  todo!: Todo;

  initialTodoWithoutModification! : Todo | undefined;


  isNewTodo : boolean = false;
  editMode : boolean = false;

  modalConfig: TaskModal = new TaskModal();

  
  // History for navigation
  todoHistoryList : Todo[] = [];

  // Drag and drop need
  subTasksList : {todo: Todo, level: number}[][] = [];

  // Visualisation

  // Toggle sub task
  // hideDoneTasks : boolean = false;

  // changePositionSubMode : boolean = false;
  subMode : string = "tree";

  // graphHeight : number = 300;
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

    this.platform.backButton.subscribeWithPriority(0, async () => {
      this.goBackTodo();
    });
    

    this.userService.getUser().subscribe((user : User | null) => {
      console.log('Todo page : User get', user)
      this.user = user;
    });

    this.route.params.subscribe((params) => {

      this.settingsService.initPage(this.translate);

      this.taskService.getTodos().subscribe((todos: Todo[]) =>{

        if (this.todos.length != 0 && JSON.stringify(this.todos) == JSON.stringify(todos)) return;

        console.log('Todos loaded in todo page:', todos, this.todos)
        this.todos = todos;

        if (params['id'] == undefined) { // NEW TODO

          // TODO : Add calendar creation case
          this.mainTodo = new Todo();
          this.todo = this.mainTodo;

          if (params['day'] && params['month'] && params['year']){ // Nouveau todo avec date

            this.todo.config.date = true;
    
            const formattedDate = TodoDate.getFormattedDateFromYearMonthDay(params['year'], params['month'], params['day'])
    
            this.todo.date = formattedDate;
            document.getElementById('datePicker')?.setAttribute('value', this.todo.date);
          }

          this.isNewTodo = true;
          this.editMode = true;
        
        }
        else { // EXISTING TODO
          if (this.todos.length == 0) return;

          // if (this.isTodoSynchronized()) return;
          // this.todoHistoryList = [];

          let mainTodo = this.todos.find(todo => todo.id == params['id']);

          if (mainTodo == undefined){ // POSSIBLY SUB TODO

            let findTodo = false;

            for (let todo of this.todos){
              let subTodo = TodoUtils.findSubTodoById(todo, params['id']);
              if (subTodo){
                this.mainTodo = todo;
                this.todo = subTodo;
                findTodo = true;
                break;
              }
            }
            if (!findTodo) return;
          }
          else{
            this.mainTodo = mainTodo;

            if (this.todo){
              this.todo = TodoUtils.findSubTodoById(this.mainTodo, this.todo.id) || this.mainTodo;
  
              // Re init todoHistoryList
              for (let i = 0; i < this.todoHistoryList.length; i++) {
                this.todoHistoryList[i] = TodoUtils.findSubTodoById(this.mainTodo, this.todoHistoryList[i].id) || this.mainTodo;
              }
            }
            else{
              this.todo = this.mainTodo;
            }
          }
        }
        
        // Initialisation pour drag and drop indexs

        if (this.todo){
          this.initializeDragDropList(); 
        }
        if (!this.isTodoSynchronized() && !this.isNewTodo) {
          console.log("TODO NOT SYNCHRONIZED")
          this.taskService.updateTodo(this.mainTodo);
        }
      });
    });
  }


  ngOnDestroy(){
    console.log("TODO PAGE ON DESTROY")

    if (!this.isTodoSynchronized() && this.mainTodo != undefined && !this.isNewTodo) {
      console.log("TODO NOT SYNCHRONIZED")

      let todo = this.taskService.getTodosAsInStorageWithoutSync().find(todo => todo.id == this.mainTodo.id);

      if (todo){
        this.taskService.updateTodo(this.mainTodo);      
      }
    }

    if (this.userSubscription){
      this.userSubscription.unsubscribe();
    }
    // if (this.todoSubscription){
    //   this.todoSubscription.unsubscribe();
    // }
  }


  isTodoSynchronized(): boolean {
    return this.mainTodo && JSON.stringify(this.mainTodo) == JSON.stringify(this.taskService.getTodosAsInStorageWithoutSync().find(todo => todo.id == this.mainTodo.id));
  }


  // DRAG AND DROP SETUP

  // updateDragDropListWhenDoneTasksChanged(){
  //   setTimeout(() => {
  //     this.initializeDragDropList();
  //   }, 1000);
  // }


  initializeDragDropList(){

    // this.actualizeWhenDeveloppedClicked();

    this.subTasksList = [];

    for (let subTask of this.todo.list!) {
      if (!this.mainTodo.hideDoneTasks || !subTask.isDone){
        this.subTasksList.push(TodoUtils.transformTodoInListByDepth(subTask, this.mainTodo.hideDoneTasks));
      }
    }
    console.log('INITIALIZE SUBTASK FOR DRAG AND DROP',this.subTasksList)
  }

  
  

  // handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
   
  //   console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
  //   ev.detail.complete(this.todo.list);
  //   console.log(this.todo.list);
  // }


  // SCROLL Tree / Graph management

  onContentScroll(event : any){

    this.scrollTop = event.detail.scrollTop;

    // graph height calculation
    this.calcGraphHeightOnScroll(event)

    // Permet de bloquer le scroll sur la division scroll-step
    if (this.subMode == 'tree'){
      const contentHeight = this.elRef.nativeElement.querySelector('.list-page').clientHeight;

      if (this.scrollTop >= contentHeight - window.innerHeight + 180) {
        console.log("scroll stop on tree mode")
        event.target.scrollToPoint(0, contentHeight - window.innerHeight + 180);
        return;
      }
    } 
  }

  // GRAPH HEIGHT CALCULATION

  calcGraphHeightOnScroll(event : any){
    if (this.graphComponent){

      const contentHeight = this.elRef.nativeElement.querySelector('.list-page').clientHeight;
      const windowHeight = window.innerHeight;

      // Calculez la nouvelle hauteur pour le graphique
      let graphHeight = windowHeight - contentHeight + this.scrollTop - 156;

      // console.log("calc graph height on scroll", graphHeight)

      // Pour éviter de scroller plus loin que nécessaire
      if (this.scrollTop >= contentHeight) {
        // console.log("scroll stop")
        event.target.scrollToPoint(0, contentHeight);
        return;
      }

      // Ajustez la taille du graphique
      this.graphComponent.resizeGraph(graphHeight);
    }
  }


  initializeGraphHeight(){

    console.log(this.subMode)


    setTimeout(() => {
      if (this.graphComponent){

        // console.log("INIT GRAPH SIZE WHEN CLICKED")

        const contentHeight = this.elRef.nativeElement.querySelector('.list-page').clientHeight;
        const windowHeight = window.innerHeight;

        // Calculez la nouvelle hauteur pour le graphique
        let graphHeight = windowHeight - contentHeight + this.scrollTop - 156;
        
        // // Ajustez la taille du graphique
        this.graphComponent.resizeGraph(graphHeight);
      }
    }, 0)
  }



  // NAVIGATION

  onNewTodoSelected(todo: Todo){

    if (todo !== this.todo){

      if (todo != this.mainTodo){
        this.todoHistoryList.push(this.todo);
      }
      else{
        this.todoHistoryList = [];
      }
      this.todo = todo;

      // window.scrollTo(0, 0);

      console.log("automatic scroll to top")
      this.content.scrollToTop(300);
      
      this.initializeGraphHeight();
      this.initializeDragDropList();
    }
  }

  goBackTodo(){
    if (this.todoHistoryList.length > 0 && this.subMode == 'tree'){
      this.todo = this.todoHistoryList.pop()!;
    }
    else{

      if (this.isNewTodo) {
        // this.navCtrl.back();

        this.showCloseConfirm();

      }
      else{
        this.navCtrl.back();
      }

      // Quit page
      // this.navCtrl.back();
    }
    this.initializeDragDropList();
  }


  modifyTodo(editMode : boolean){ // toggle edit button

    this.editMode = editMode;

    if (!editMode){
      
      if (!this.isTodoSynchronized()) {
        console.log("TODO NOT SYNCHRONIZED")

        this.taskService.updateTodo(this.mainTodo);
      }
    }
  }


  


  changeSubMode(subMode : string){
    this.subMode = subMode;

    if (subMode == 'graph'){
      this.assignIds();
      this.initializeGraphHeight();
    }
  }


  // changeHideDoneTasks(hideDoneTasks : boolean){
  //   this.mainTodo.hideDoneTasks = hideDoneTasks;
  //   // this.updateDragDropListWhenDoneTasksChanged();
  //   this.initializeDragDropList();
  // }

  


  // MODIFICATION PROPRIETES TODO


  setTodoValidation(isDone: boolean){
    this.todo.isDone = isDone;
    // this.taskService.actualizeTodos(this.todos);
    // this.taskService.updateTodo(this.mainTodo);
  }



   // SAVE TODO

   canSaveTodo(){
    if (this.todo.title == undefined || this.todo.title == "") {
      return false;
    }
    return true;
  }


  saveNewTodo(){

    // console.log(this.todos)
    this.assignIds(); // A vérifier

    this.taskService.addTodo(this.mainTodo);
    this.navCtrl.back()

    // console.log(this.todos)

    this.initializeDragDropList();
  }


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


  // MESSAGE POP UP : DELETE TODO, CONFIRMATION, CANCEL

  showConfirmDeleteTodo = async () => {

    console.log("show confirm delete todo", this.todo.title)

    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: `${this.translate.instant('DELETE MESSAGE')} `+ this.todo.title +` ?`,
    });

    if (value) {

      console.log("delete todo", this.todo.title)

      this.taskService.deleteTodoById(this.mainTodo, this.todo);
      this.initializeDragDropList();

      if (this.todo == this.mainTodo){
        this.navCtrl.back();
      }
      else{
        this.todo = this.mainTodo;
        this.todoHistoryList = [];
      }
    }
  };


    // TODO : On modify button, on go back arrow, on platform back button


    showCloseConfirm = async () => {
      
        const { value } = await Dialog.confirm({
          title: 'Confirm',
          message: `${this.translate.instant('LOOSE CHANGE MESSAGE')}`,
        });
    
        if (value) {
          console.log("should loose change")
  
          // this.newTodo = this.initialTodo;
          
          // // Replace newTodo with initialTodo in todos list
          // const index = this.todos.findIndex(todo => todo.id === this.newTodo.id);
          // if (index !== -1) {
          //   this.todos[index] = this.initialTodo;
          // }
          
          this.navCtrl.back();
        }
      
    };
  

}

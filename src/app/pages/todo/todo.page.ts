import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemReorderEventDetail, NavController, Platform } from '@ionic/angular';
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
import { Subscription } from 'rxjs';
import { GraphComponent } from 'src/app/components/graph/graph.component';


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
  todoSubscription! : Subscription;
  todos: Todo[] = [];

  mainTodo! : Todo;
  todo!: Todo;
  
  // Drag and drop need

  subTasksList : {todo: Todo, level: number}[][] = [];

  // Visualisation

  // Toggle sub task
  hideDoneTasks : boolean = false;


  // Tree / Graph mode 
  hideSubToolbar: boolean = false;

  changePositionSubMode : boolean = false;
  subMode : string = "tree";

  // Graph conceptor
  @ViewChild(GraphComponent) graphComponent!: GraphComponent;


  ngOnInit() {

    this.userService.getUser().subscribe((user : User | null) => {
      console.log('Todo page : User get', user)
      this.user = user;
    });

    // TODO : simplify route.queryParams.subscribe

    this.route.params.subscribe((params) => {

      this.settingsService.initPage(this.translate);

      // TODO : could be change with getTodoById
      this.taskService.getTodos().subscribe((todos: Todo[]) =>{

        console.log('Todos loaded in todo page:', todos)
        this.todos = todos;

        if (this.todos.length == 0) return;

        this.initializeTodoPage(params);
        // Initialisation pour drag and drop indexs

        if (this.todo){
          this.initializeSubTasksList();
        }
      });
    });
  }


  ngOnDestroy(){

    console.log("TODO PAGE ON DESTROY")

    if (this.userSubscription){
      this.userSubscription.unsubscribe();
    }
    if (this.todoSubscription){
      this.todoSubscription.unsubscribe();
    }
  }



  // INITIALIZATION

  initializeTodoPage(params : any){

    if (params['subId'] == undefined) { // MAIN TODO

      this.mainTodo = this.todos.find(todo => todo.id == params['id'])!;
      this.todo = this.mainTodo;
    }
    else{ // SUB TODO

      this.mainTodo = this.todos.find(todo => todo.id == params['id'])!;
      this.todo = TodoUtils.findSubTodoById(this.mainTodo, +params['subId'])!;
    } 
  }


  // DRAG AND DROP SETUP

  actualizeWhenDeveloppedClicked(){
    let developTask = Array.from(document.getElementsByClassName("develop-task"));

    for (let dev of developTask) {
      dev.removeEventListener("click", () => this.initializeSubTasksList());
      dev.addEventListener("click", () => this.initializeSubTasksList());
    }
  }


  hideSubTasksClicked(){
    setTimeout(() => {
      this.initializeSubTasksList();
    }, 1000);
  }


  initializeSubTasksList(){

    this.actualizeWhenDeveloppedClicked();

    this.subTasksList = [];

    for (let subTask of this.todo.list!) {
      if (!this.hideDoneTasks || !subTask.isDone){
        this.subTasksList.push(TodoUtils.transformTodoInListByDepth(subTask, this.hideDoneTasks));
      }
    }
    console.log(this.subTasksList)
  }

  
  async drop(event: CdkDragDrop<any[]>) {

    // TODO : fix drop event

    // await DragAndDrop.drop(event, this.mainTodo, this.translate);
    // this.initializeSubTasksList();
    // // localStorage.setItem('todos', JSON.stringify(this.todos));
    // this.taskService.actualizeTodos(this.todos, this.user);
  }

  // handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
   
  //   console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
  //   ev.detail.complete(this.todo.list);
  //   console.log(this.todo.list);
  // }



  // NAVIGATION

  goBackTodo(){
    this.navCtrl.back();
  }


  goToConceptor(){
    console.log("go to conceptor")

    const segment = document.querySelectorAll('.tree-segment') as NodeListOf<HTMLIonSegmentElement>;

    this.subMode = "tree";
    this.router.navigate(['/conceptor', this.mainTodo.id]);

    console.log("navigation to conceptor done")

    segment!.forEach((seg) => {
      seg!.value = "tree";
    })
  }


  modifyTodo(){ // redirection to add page

    const params = this.route.snapshot.params;

    if (params['subId'] == undefined) {
      this.router.navigate(['/add', this.mainTodo.id]);
    } else {
      this.router.navigate(['/add', this.mainTodo.id, params['subId']]);
    }
  }


  // SCROLL Tree / Graph management

  onContentScroll(event : any){

    console.log('scroll')

    // subMode

    const subTaskMode = document.getElementById('sub-task-mode')!;
    let subTaskModePosY = subTaskMode.getBoundingClientRect().top;

    if (subTaskModePosY < -20) {
      this.changePositionSubMode = true;
      this.hideSubToolbar = true;
    }
    else {
      this.changePositionSubMode = false;
      this.hideSubToolbar = false;
    }

    // graph height calculation

    if (this.graphComponent){
      const scrollTop = event.detail.scrollTop;
      const contentHeight = this.elRef.nativeElement.querySelector('.list-page').clientHeight;
      const windowHeight = window.innerHeight;
  
      // Calculez la nouvelle hauteur pour le graphique
      const newHeight = windowHeight - contentHeight + scrollTop - 156;
  
      // Ajustez la taille du graphique
      this.graphComponent.resizeGraph(newHeight);
  
      // Pour éviter de scroller plus loin que nécessaire
      if (scrollTop >= contentHeight) {
        event.target.scrollToPoint(0, contentHeight);
      }
    }

    
  }


  // GESTION TODOS

  showConfirmDeleteTodo = async () => {
    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: `${this.translate.instant('DELETE MESSAGE')} `+ this.todo.title +` ?`,
    });

    if (value) {

      this.taskService.deleteTodoById(this.mainTodo, this.todo);
      this.navCtrl.back();
    }
  };



  // MODIFICATION PROPRIETES TODO

  validateTodo(){
    this.todo.isDone = true;
    // this.taskService.actualizeTodos(this.todos, this.user);
    this.taskService.updateTodo(this.mainTodo);
  }


  unvalidateTodo(){
    this.todo.isDone = false;
    // this.taskService.actualizeTodos(this.todos);
    this.taskService.updateTodo(this.mainTodo);
  }


  // DISPLAY INFORMATIONS TODO

  passedDate(){
    return TodoDate.passedDate(this.todo);
  }


  formatDateToCustomString() {
    return TodoDate.formatDateToCustomString(this.todo, this.translate); 
  }


  validDate(){
    if (this.todo.config.date){
      let date = TodoDate.getDate(this.todo.date!, this.todo.time);
      let now = new Date();
      return date! > now;
    }
    if (this.todo.config.repeat && this.todo.repeat!.delayType){
      return true;
    }
    return false;
  }

  contrastColor(){
    let color = TodoColor.getCorrectTextColor(this.todo.category.color);
    return color
  }


}

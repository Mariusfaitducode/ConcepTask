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


  isNewTodo : boolean = false;
  editMode : boolean = false;

  
  // History for navigation
  todoHistoryList : Todo[] = [];

  // Drag and drop need
  subTasksList : {todo: Todo, level: number}[][] = [];

  // Visualisation

  // Toggle sub task
  hideDoneTasks : boolean = false;

  // changePositionSubMode : boolean = false;
  subMode : string = "tree";

  // graphHeight : number = 300;
  scrollTop : number = 0;

  // Graph conceptor
  @ViewChild(GraphComponent) graphComponent!: GraphComponent;

  @ViewChild(IonContent, { static: false }) content!: IonContent;


  ngOnInit() {

    this.userService.getUser().subscribe((user : User | null) => {
      console.log('Todo page : User get', user)
      this.user = user;
    });

    this.route.params.subscribe((params) => {

      this.settingsService.initPage(this.translate);

      this.taskService.getTodos().subscribe((todos: Todo[]) =>{

        if (JSON.stringify(this.todos) == JSON.stringify(todos)) return;

        console.log('Todos loaded in todo page:', todos)
        this.todos = todos;

        if (params['id'] == undefined) { // NEW TODO

          this.mainTodo = new Todo();
          this.todo = this.mainTodo;

          this.isNewTodo = true;
          this.editMode = true;
        
        }
        else { // EXISTING TODO
          if (this.todos.length == 0) return;

          this.mainTodo = this.todos.find(todo => todo.id == params['id'])!;
          this.todo = this.mainTodo;
        }
        
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
    if (this.todoHistoryList.length > 0 && this.subMode == 'tree'){
      this.todo = this.todoHistoryList.pop()!;
    }
    else{
      this.navCtrl.back();
    }
  }


  modifyTodo(){ // redirection to add page

    this.editMode = !this.editMode;

    // if (this.mainTodo == this.todo){ 
    //   this.router.navigate(['/add', this.mainTodo.id]);
    // } 
    // else {
    //   this.router.navigate(['/add', this.mainTodo.id, this.todo.id]);
    // }
  }


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
    this.taskService.updateTodo(this.mainTodo);  // WARNING : restart the page with todos.subscription
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemReorderEventDetail, NavController } from '@ionic/angular';
import { Todo } from 'src/app/model/todo';
import { ModalService } from 'src/app/service/modal.service';
import { Dialog } from '@capacitor/dialog';

import { LocalNotifications } from '@capacitor/local-notifications';
import { CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragAndDrop } from 'src/app/model/drag-and-drop';
import { Notif } from 'src/app/model/notif';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {

  // @ViewChild ('.sub-toolbar') subToolbar!: HTMLElement;


  todos: Todo[] = [];

  mainTodo! : Todo;

  todo! : Todo;
  index : number = 0;


  subTasksList : any[] = [];

  // originalIndex : number = 0;

  inSubTask : boolean = false;
  // openModal: boolean = false;

  configMode : boolean = false;

  hideSubTasks : boolean = false;

  lastScrollPosition: number = 0;
  hideSubToolbar: boolean = false;

  changePositionSubMode : boolean = false;
  subMode : string = "tree";

  subTaskModePosY = 0;
  

  newTodoOnListTitle: string = "";

  constructor(private navCtrl: NavController, private route : ActivatedRoute, private router : Router) { 
    let settings = JSON.parse(localStorage.getItem('settings') || '{}');

    if (settings.darkMode) {
      document.body.setAttribute('color-theme', 'dark');
    }
    else{
      document.body.setAttribute('color-theme', 'light');
    }
  }

  ngOnInit() {

    this.route.params.subscribe((params) => {

      if (params['subId'] == undefined) {

        //In the main todo

        this.inSubTask = false;
        this.index = +params['id'];

        //Détermine main todo
        this.loadTodo(this.index);
      }
      else{
        //In a subTodo
        this.inSubTask = true;
        this.index = +params['id'];
        //Détermine main todo
        this.loadTodo(this.index);

        //Détermine sub todo
        this.todo = Todo.findSubTodoById(this.mainTodo, +params['subId']!)!;
      }
    });
    this.initializeSubTasksList();

    console.log(this.subTasksList);
    console.log(this.todo)
  }

  ngAfterViewInit() {
    this.actualizeWhenDeveloppedClicked();
  }

  onContentScroll(event : any){

    const subTaskMode = document.getElementById('sub-task-mode')!;
    const header = document.getElementById('header')!;

    // console.log(subTaskMode)
    // console.log(event.detail.scrollTop)

    let headerPosY = header.getBoundingClientRect().top;

    if (subTaskMode){
      this.subTaskModePosY = subTaskMode.getBoundingClientRect().top;
      
      console.log(this.subTaskModePosY, headerPosY)
    }

    if (this.subTaskModePosY < -20) {
      this.changePositionSubMode = true;
      this.hideSubToolbar = true;
    }
    else {
      this.changePositionSubMode = false;
      this.hideSubToolbar = false;
    }

    this.lastScrollPosition = event.detail.scrollTop;
  }


  actualizeWhenDeveloppedClicked(){
    let developTask = Array.from(document.getElementsByClassName("develop-task"));

    for (let dev of developTask) {
      dev.removeEventListener("click", () => this.initializeSubTasksList());
      dev.addEventListener("click", () => this.initializeSubTasksList());
    }
  }


  initializeSubTasksList(){

    this.actualizeWhenDeveloppedClicked();

    console.log("initialize subtask list")

    this.subTasksList = [];

    for (let subTask of this.todo.list!) {
      this.subTasksList.push(Todo.transformTodoInListByDepth(subTask));
    }
  }


  async drop(event: CdkDragDrop<any[]>) {

    await DragAndDrop.drop(event, this.mainTodo);
    this.initializeSubTasksList();
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }


  //Reset config au cas ou
  setConfig(){
    console.log("set config")
    let configArray = {
       description: this.todo.description ? true : false ,
       priority: this.todo.priority ? true : false,
       date: this.todo.date ? true : false ,
       repeat: this.todo.repeat ? true : false ,
      // { key: 'note', value: false },
       subtasks: this.todo.list?.length ? true : false ,
    };

    this.todo.config = configArray;
  }


  loadTodo(id : number){
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    console.log(this.todos)
    this.todo = this.todos.find(todo => todo.mainId == id)!;
    this.mainTodo = this.todos.find(todo => todo.mainId == id)!;
  }


  goBackTodo(){
    // this.navCtrl.back();
    // localStorage.setItem('todos', JSON.stringify(this.todos));

    if (this.inSubTask) {

      console.log("in subtask");

      console.log(this.todo.parentId);

      if (this.todo.parentId != undefined && this.todo.parentId != 0){
        console.log("parent")
        this.navCtrl.back();
      }
      else{
        console.log("no parent")
        this.router.navigate(['/todo', this.index]);
      }
    }
    else{
      this.router.navigate(['/home']);
    }
  }


  modifyTodo(){

    const params = this.route.snapshot.params;

    if (params['subId'] == undefined) {
      this.router.navigate(['/add', this.index]);
    } else {
      this.router.navigate(['/add', this.index, params['subId']]);
    }
  }


  deleteTodo(){
    // this.todos.splice(this.index, 1);

    console.log("delete");

    if (this.todo.main == true){
      console.log("main")
      this.todos = this.todos.filter(todo => todo.mainId != this.todo.mainId);
    }
    else{
      Todo.deleteTodoById(this.mainTodo, this.todo.subId!);
      console.log(this.mainTodo.list)
    }
    localStorage.setItem('todos', JSON.stringify(this.todos));

    Notif.cancelNotification(this.todo);

    this.navCtrl.back();
  }

  showConfirm = async () => {
    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: `Are you sure to delete `+ this.todo.title +` ?`,
    });
  
    console.log('Confirmed:', value);

    if (value) {
      this.deleteTodo();
      
    }
  };


  validateTodo(){
    this.todo.isDone = true;
    localStorage.setItem('todos', JSON.stringify(this.todos));
    console.log(this.todos);
  }


  unvalidateTodo(){
    this.todo.isDone = false;
    localStorage.setItem('todos', JSON.stringify(this.todos));
    console.log(this.todos);
  }


  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
   
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    ev.detail.complete(this.todo.list);
    console.log(this.todo.list);
  }


  addTodoOnList(){

    this.newTodoOnListTitle = '';
    console.log(this.todo);
  }

  haveProperties(){
    return this.exist(this.todo.description) || this.exist(this.todo.date) || this.exist(this.todo.time) || this.exist(this.todo.repeat)
  }

  exist(item : any){
    return item != undefined && item != '';
  }


  goToConceptor(){
    console.log("go to conceptor")

    const segment = document.querySelectorAll('.tree-segment') as NodeListOf<HTMLIonSegmentElement>;

      this.subMode = "tree";
      console.log(this.subMode)

      this.router.navigate(['/conceptor', this.index]);

      segment!.forEach((seg) => {
        console.log(seg)
        seg!.value = "tree";
      })
  
  }
 

  passedDate(){
    return Todo.passedDate(this.todo);
  }


  formatDateToCustomString() {
    return Todo.formatDateToCustomString(this.todo); 
  }


  validDate(){
    if (this.todo.config.date){
      let date = Todo.getDate(this.todo.date!, this.todo.time);
      let now = new Date();
      return date! > now;
    }
    if (this.todo.config.repeat && this.todo.repeat!.delayType){
      return true;
    }
    return false;
  }

  contrastColor(){

    // console.log(this.todo.category.color)
    let color = Todo.getCorrectTextColor(this.todo.category.color);
    
    // console.log(color)
    return color
  
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemReorderEventDetail, NavController, Platform } from '@ionic/angular';
import { Todo } from 'src/app/models/todo';
import { Dialog } from '@capacitor/dialog';

import { CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragAndDrop } from 'src/app/models/drag-and-drop';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from 'src/app/models/settings';
import { TaskService } from 'src/app/services/task.service';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {

  constructor(private navCtrl: NavController, 
    private route : ActivatedRoute, 
    private router : Router,
    private translate : TranslateService,

    private taskService : TaskService,
  ){}


  todos: Todo[] = [];

  mainTodo! : Todo;
  // mainId : number = 0;

  todo! : Todo;
  


  subTasksList : {todo: Todo, level: number}[][] = [];

  inSubTask : boolean = false;
  configMode : boolean = false;
  hideSubTasks : boolean = false;

  lastScrollPosition: number = 0;
  hideSubToolbar: boolean = false;

  changePositionSubMode : boolean = false;
  subMode : string = "tree";

  subTaskModePosY : number = 0;
  

  newTodoOnListTitle: string = "";

 

  ngOnInit() {

    this.route.params.subscribe((params) => {

      let settings = new Settings();
      settings.initPage(this.translate);

      if (params['subId'] == undefined) { // Into the main todo

        this.inSubTask = false;
        let mainId = +params['id'];

        // this.loadTodo(this.index);

        this.todos = this.taskService.loadTodos();
        this.mainTodo = this.todos.find(todo => todo.mainId == mainId)!;
        this.todo = this.todos.find(todo => todo.mainId == mainId)!;

      }
      else{ // Into a sub todo

        this.inSubTask = true;
        let mainId = +params['id'];
        let subId = +params['subId']!;

        // this.loadTodo(this.mainId);

        this.todos = this.taskService.loadTodos();
        this.mainTodo = this.todos.find(todo => todo.mainId == mainId)!;

        this.todo = Todo.findSubTodoById(this.mainTodo, subId)!;
      }
    });

    // Initialisation pour drag and drop indexs
    this.initializeSubTasksList();
  }


  ngAfterViewInit() {
    this.actualizeWhenDeveloppedClicked();
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

    console.log("initialize subtask list")

    this.subTasksList = [];

    for (let subTask of this.todo.list!) {
      if (!this.hideSubTasks || !subTask.isDone){
        this.subTasksList.push(Todo.transformTodoInListByDepth(subTask, this.hideSubTasks));
      }
    }
    console.log(this.subTasksList)
  }

  async drop(event: CdkDragDrop<any[]>) {

    await DragAndDrop.drop(event, this.mainTodo, this.translate);
    this.initializeSubTasksList();
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  // NAVIGATION

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
        this.router.navigate(['/todo', this.mainTodo.mainId]);
      }
    }
    else{
      if (this.todo.isDone){
        this.router.navigate(['/done-task']);
      }
      else{
        this.router.navigate(['/home']);
      }
    }
  }

  onContentScroll(event : any){

    const subTaskMode = document.getElementById('sub-task-mode')!;
    const header = document.getElementById('header')!;

    let headerPosY = header.getBoundingClientRect().top;

    if (subTaskMode){
      this.subTaskModePosY = subTaskMode.getBoundingClientRect().top;
      
      // console.log(this.subTaskModePosY, headerPosY)
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


  


  


  // Réinitialisation config todo en cas de besoin

  // setConfig(){
  //   console.log("set config")
  //   let configArray = {
  //      description: this.todo.description ? true : false ,
  //      priority: this.todo.priority ? true : false,
  //      date: this.todo.date ? true : false ,
  //      repeat: this.todo.repeat ? true : false ,
  //     // { key: 'note', value: false },
  //      subtasks: this.todo.list?.length ? true : false ,
  //   };

  //   this.todo.config = configArray;
  // }



  // GESTION TODO LIST

  // loadTodo(id : number){

  //   this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
  //   console.log(this.todos)
    
  //   this.todo = this.todos.find(todo => todo.mainId == id)!;
    
  //   this.mainTodo = this.todos.find(todo => todo.mainId == id)!;
  // }


  


  modifyTodo(){

    const params = this.route.snapshot.params;

    if (params['subId'] == undefined) {
      this.router.navigate(['/add', this.mainTodo.mainId]);
    } else {
      this.router.navigate(['/add', this.mainTodo.mainId, params['subId']]);
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

    // Notif.cancelNotification(this.todo);

    this.navCtrl.back();
  }



  showConfirm = async () => {
    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: `${this.translate.instant('DELETE MESSAGE')} `+ this.todo.title +` ?`,
    });
  
    console.log('Confirmed:', value);

    if (value) {
      this.deleteTodo();
      
    }
  };


  // MODIFICATION PROPRIETES TODO

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


  // handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
   
  //   console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
  //   ev.detail.complete(this.todo.list);
  //   console.log(this.todo.list);
  // }




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

      this.router.navigate(['/conceptor', this.mainTodo.mainId]);

      segment!.forEach((seg) => {
        console.log(seg)
        seg!.value = "tree";
      })
  
  }
 

  passedDate(){
    return Todo.passedDate(this.todo);
  }


  formatDateToCustomString() {
    return Todo.formatDateToCustomString(this.todo, this.translate); 
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

  // async exportTodo(){
  //   console.log("export")
  //   // console.log(this.todo)
  //   // let todo = Todo.transformTodoInListByDepth(this.todo);
  //   // console.log(todo)
  //   let todoString = JSON.stringify(this.todo);
  //   console.log(todoString)

  //   const blob = new Blob([todoString], { type: 'text/plain' });

  //   const a = document.createElement('a');
  //   a.href = window.URL.createObjectURL(blob);
  //   a.download = this.todo.title + '.json';
  //   // document.body.appendChild(a);
  //   a.click();

  //   // document.body.removeChild(a);


  // //   const downloadPath = (
  // //     this.platform.is('android')
  // //  ) ? this.file.externalDataDirectory : this.file.documentsDirectory;
   
   
  // //  let vm = this;
   
  // //  /** HttpClient - @angular/common/http */
  // //  this.http.get(
  // //     uri, 
  // //     {
  // //        responseType: 'blob', 
  // //        headers: {
  // //           'Authorization': 'Bearer ' + yourTokenIfYouNeed,
  // //        }
  // //     }
  // //  ).subscribe((fileBlob: Blob) => {
  // //     /** File - @ionic-native/file/ngx */
  // //     vm.file.writeFile(downloadPath, "YourFileName.pdf", fileBlob, {replace: true});
  // //  });

  // }

}

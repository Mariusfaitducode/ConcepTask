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
import { TodoDate } from 'src/app/utils/todo-date';
import { TodoColor } from 'src/app/utils/todo-color';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { SyncService } from 'src/app/services/sync.service';


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
    private userService : UserService,
    private syncService : SyncService
  ){}


  user : User | null = null;

  // Todo objects

  todos: Todo[] = [];

  mainTodo! : Todo;
  todo: Todo = new Todo();
  
  // Drag and drop need

  subTasksList : {todo: Todo, level: number}[][] = [];

  // Visualisation

  // Toggle sub task
  hideDoneTasks : boolean = false;


  // Tree / Graph mode 
  hideSubToolbar: boolean = false;

  changePositionSubMode : boolean = false;
  subMode : string = "tree";


  // Scroll position
  // lastScrollPosition: number = 0;
  // subTaskModePosY : number = 0;
  

  // newTodoOnListTitle: string = "";

 

  ngOnInit() {

    

    this.userService.getUser().subscribe((user : User | null) => {
      console.log('Todo page : User get', user)
      this.user = user;
    });

    this.route.params.subscribe((params) => {

      let settings = new Settings();
      settings.initPage(this.translate);

      this.syncService.getTodos().subscribe((todos: Todo[]) => {

        console.log('Todos loaded in todo page:', todos)
        this.todos = todos;

        if (this.todos.length == 0) return;

        if (params['subId'] == undefined) { // Into the main todo
          let mainId = +params['id'];
  
          // this.todos = this.taskService.loadTodos();
          this.mainTodo = this.todos.find(todo => todo.mainId == mainId)!;
          this.todo = this.mainTodo;
        }
        else{ // Into a sub todo
          let mainId = +params['id'];
          let subId = +params['subId']!;
  
          // this.todos = this.taskService.loadTodos();
          this.mainTodo = this.todos.find(todo => todo.mainId == mainId)!;
  
          this.todo = Todo.findSubTodoById(this.mainTodo, subId)!;
        }

        // Initialisation pour drag and drop indexs
        this.initializeSubTasksList();
      });

      
    });

    
  }


  ngAfterViewInit() {
    // this.actualizeWhenDeveloppedClicked();
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
        this.subTasksList.push(Todo.transformTodoInListByDepth(subTask, this.hideDoneTasks));
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

    // if (this.inSubTask) { // If we are in a subtask

    //   console.log(this.todo.parentId);

    //   if (this.todo.parentId != undefined && this.todo.parentId != 0){
        
    //     // Retourne au parent du subTodo
    //     this.navCtrl.back();
    //   }
    //   else{
        
    //     // Retourne au mainTodo
    //     this.router.navigate(['/todo', this.mainTodo.mainId]);
    //   }
    // }
    // else{ // Retour à la page d'accueil

    //   if (this.todo.isDone){
    //     this.router.navigate(['/done-task']);
    //   }
    //   else{
    //     this.router.navigate(['/home']);
    //   }
    // }
  }

  goToConceptor(){
    console.log("go to conceptor")

    const segment = document.querySelectorAll('.tree-segment') as NodeListOf<HTMLIonSegmentElement>;

      this.subMode = "tree";
      this.router.navigate(['/conceptor', this.mainTodo.mainId]);

      segment!.forEach((seg) => {
        seg!.value = "tree";
      })
  }

  modifyTodo(){ // redirection to add page

    const params = this.route.snapshot.params;

    if (params['subId'] == undefined) {
      this.router.navigate(['/add', this.mainTodo.mainId]);
    } else {
      this.router.navigate(['/add', this.mainTodo.mainId, params['subId']]);
    }
  }


  // SCROLL Tree / Graph management

  onContentScroll(){

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
  }


  // GESTION TODOS

  showConfirmDeleteTodo = async () => {
    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: `${this.translate.instant('DELETE MESSAGE')} `+ this.todo.title +` ?`,
    });

    if (value) {


      this.syncService.deleteTodoById(this.mainTodo, this.todo);
      
      this.navCtrl.back();
    }
  };



  // MODIFICATION PROPRIETES TODO

  validateTodo(){
    this.todo.isDone = true;
    // this.taskService.actualizeTodos(this.todos, this.user);
    this.syncService.updateTodo(this.todo);
  }


  unvalidateTodo(){
    this.todo.isDone = false;
    // this.taskService.actualizeTodos(this.todos);
    this.syncService.updateTodo(this.todo);
  }



  // DISPLAY INFORMATIONS

  // haveProperties(){
  //   return this.exist(this.todo.description) || this.exist(this.todo.date) || this.exist(this.todo.time) || this.exist(this.todo.repeat)
  // }

  // exist(item : any){
  //   return item != undefined && item != '';
  // }


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


  // UTILS

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

  // Export todo

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

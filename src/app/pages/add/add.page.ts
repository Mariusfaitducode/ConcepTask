import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NavController, Platform } from '@ionic/angular';

import { Todo } from 'src/app/models/todo';

import { Dialog } from '@capacitor/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragAndDrop } from 'src/app/utils/drag-and-drop';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from 'src/app/models/settings';
import { TaskModal } from 'src/app/models/task-modal';
import { Category } from 'src/app/models/category';
// import { TaskService } from 'src/app/services/task.service';
import { TodoDate } from 'src/app/utils/todo-date';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { TaskService } from 'src/app/services/task/task.service';
import { TodoUtils } from 'src/app/utils/todo-utils';
import { SettingsService } from 'src/app/services/settings/settings.service';


@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {


  constructor(private navCtrl: NavController, 
    private route : ActivatedRoute, 
    private platform : Platform,
    private translate: TranslateService,
    private userService : UserService,
    private taskService : TaskService,
    private settingsService : SettingsService
  ) 
  {}

  // User

  user : User | null = null;

  // Todo objects

  todos : Todo[] = [];

  newTodo!: Todo;
  initialTodo! : Todo;

  modifyExistingTodo : boolean = false;


  // Drag and drop need
  subTasksList : {todo: Todo, level: number}[][] = [];


  // Modal

  modalConfig: TaskModal = new TaskModal();
  newModalConfig: TaskModal = new TaskModal();

  // Categories

  categories : Category[] = [];
  categoryName : string = "";



  ngOnInit() {

    this.categories = this.settingsService.getLocalSettings().categories

    

    this.userService.getUser().subscribe((user : User | null) => {
      console.log('Add page : get user = ', user)
      this.user = user;
    });


    

    // Récupère chemins et paramètres de la route active -> provenance : Todo / Home  
    this.route.params.subscribe((params) => {

      console.log('add page changed');

      // Initilisation des settings
      this.settingsService.initPage(this.translate);

      // Setup android back button
      this.setupBackButtonHandler();


      this.taskService.getTodos().subscribe((todos: Todo[]) => {
        console.log("Add page : get todos = ", todos)
        this.todos = todos;

        this.initializeAddPage(params)

        if (this.newTodo){
          // Initialisation pour drag and drop indexs
          this.initializeSubTasksList();
          // Todo without modif in case of abandon
          this.initialTodo = JSON.parse(JSON.stringify(this.newTodo));
        }
      });
    });
  }


  ngAfterViewInit() {
    this.actualizeWhenDeveloppedClicked();
  }


  // INITIALIZATION


  initializeAddPage(params : any){

    // MODIFICATION D'UN TODO EXISTANT
    if (params['id']) {  

      console.log('MODIFICATION TODO EXISTANT')
      this.modifyExistingTodo = true;

      if (this.todos.length == 0) return;
      
      this.newTodo = this.todos.find((todo:Todo) => todo.id == params['id'])!;
      this.categoryName = this.newTodo.category.name;

      if (params['subId']){ // Modification d'un sous-todo

        // TODO : verify and simplify TaskModal

        this.modalConfig.open = true
        this.modalConfig.task = TodoUtils.findSubTodoById(this.newTodo, params['subId'])
        this.modalConfig.modify = true
        this.modalConfig.parentTask = null
      }
    }
    // NOUVEAU TODO
    else{

      this.modifyExistingTodo = false;

      // TODO : Initialize new todo basis

      this.newTodo = new Todo();
      this.newTodo.main = true;

      if (params['day'] && params['month'] && params['year']){ // Nouveau todo avec date

        this.newTodo.config.date = true;

        const formattedDate = TodoDate.getFormattedDateFromYearMonthDay(params['year'], params['month'], params['day'])

        this.newTodo.date = formattedDate;
        document.getElementById('datePicker')?.setAttribute('value', this.newTodo.date);
      }
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


  initializeSubTasksList(){

    this.actualizeWhenDeveloppedClicked();

    console.log("initialize subtask list")

    this.subTasksList = [];

    for (let subTask of this.newTodo.list!) {
      this.subTasksList.push(TodoUtils.transformTodoInListByDepth(subTask));
    }
  }

  
  async drop(event: CdkDragDrop<any[]>) {

    await DragAndDrop.drop(event, this.newTodo, this.translate);
    this.initializeSubTasksList();
  }


  // SAVE TODO

  canSaveTodo(){
    if (this.newTodo.title == undefined || this.newTodo.title == "") {
      return false;
    }
    return true;
  }


  saveTodo(){

    console.log(this.todos)

    this.assignIds(); // A vérifier

    if (this.modifyExistingTodo) {  // Modification d'un Todo existant

      this.taskService.updateTodo(this.newTodo);

      // this.navCtrl.navigateForward('/todo/' + this.newTodo.id);
      this.navCtrl.back()
    }
    else{

      this.taskService.addTodo(this.newTodo);

      // this.navCtrl.navigateForward('/home');
      this.navCtrl.back()
    }

    console.log(this.todos)

    this.newTodo = new Todo();
  }


  // NAVIGATION

  showCloseConfirm = async () => {

    if (!TodoUtils.areSameTodos(this.newTodo, this.initialTodo)){

      const { value } = await Dialog.confirm({
        title: 'Confirm',
        message: `${this.translate.instant('LOOSE CHANGE MESSAGE')}`,
      });
  
      if (value) {
        this.navCtrl.back();
      }
    }
    else{
      this.navCtrl.back();
    }
  };


  // A vérifier
  setupBackButtonHandler() { // Verify if there is change when modify task
    this.platform.backButton.subscribeWithPriority(0, async () => {
      
      if (!TodoUtils.areSameTodos(this.newTodo, this.initialTodo) && window.location.pathname.includes("add")){

        const { value } = await Dialog.confirm({
          title: 'Confirm',
          message: `${this.translate.instant('LOOSE CHANGE MESSAGE')}`,
        });
      
        console.log('Confirmed:', value);
    
        if (value) {
          console.log("change")
          this.navCtrl.back();
        }
      }
      else{
  
        console.log("no change")
  
        this.navCtrl.back();
      }
    });
  }




  // UTILS 

  //Id 

  // TODO : simplify this system

  // Fonction pour parcourir l'arbre et attribuer des IDs
  assignIds(): void {

    console.log("assign ids function")

    // this.newTodo.mainId = this.newTodo.id;

    let copyList = [...this.newTodo.list!];

    let queue = [{ list: copyList, parentId: 0 }];

    let id = 1;

    for (let i = 0; i < queue.length; i++) {
      while (queue[i].list.length > 0) {

        let todo = queue[i].list.shift()!;

        todo.main = false;

        // TODO : verify mainId use
        // todo.mainId = this.newTodo.mainId; 
        todo.subId = id++;
        todo.parentId = queue[i].parentId;

        if (todo.list) {
          queue.push({ list: [...todo.list], parentId: todo.subId });
        }
      }
    }
  }



  changeCategory(){
    console.log(this.categoryName)
    this.newTodo.category = this.categories.find((category: Category) => category.name === this.categoryName)!;
  }
  

  passedDate(){
    return TodoDate.passedDate(this.newTodo);
  }
  
 }

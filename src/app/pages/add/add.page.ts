import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NavController, Platform } from '@ionic/angular';

import { Todo } from 'src/app/models/todo';

import { Dialog } from '@capacitor/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragAndDrop } from 'src/app/models/drag-and-drop';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from 'src/app/models/settings';
import { TaskModal } from 'src/app/models/task-modal';
import { Category } from 'src/app/models/category';
import { TaskService } from 'src/app/services/task.service';
import { TodoDate } from 'src/app/utils/todo-date';


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
    private taskService : TaskService,
  ) 
  {}


  // Todo objects

  todos : Todo[] = [];

  newTodo!: Todo;
  initialTodo : Todo = new Todo();

  modifyExistingTodo : boolean = false;

  // Drag and drop need
  subTasksList : {todo: Todo, level: number}[][] = [];


  // Modal

  modalConfig: TaskModal = new TaskModal();
  newModalConfig: TaskModal = new TaskModal();


  // index?: number = undefined;

  subType: string = 'customize';

  categories : Category[] = [];
  categoryName : string = "";


  showDate: boolean = false;

  


  ngOnInit() {

    this.categories = JSON.parse(localStorage.getItem('categories') || '[]');


    // Récupère chemins et paramètres de la route active -> provenance : Todo / Home  
    this.route.params.subscribe((params) => {

      console.log('add page changed')


      this.todos = this.taskService.loadTodos();

      // Setup android back button
      this.setupBackButtonHandler();


      // Initilisation des settings
      let settings = new Settings();
      settings.initPage(this.translate);

      // MODIFICATION D'UN TODO EXISTANT
      if (params['id']) {  

        this.modifyExistingTodo = true;

        let mainId = +params['id'];

        
        this.newTodo = this.todos.find((todo:Todo) => todo.mainId == mainId)!;

        this.categoryName = this.newTodo.category.name;

        if (params['subId']){ // Modification d'un sous-todo

          this.modalConfig.open = true
          this.modalConfig.task = Todo.findSubTodoById(this.newTodo, params['subId'])
          this.modalConfig.modify = true
          this.modalConfig.parentTask = null
        }
      }
      // NOUVEAU TODO

      else{

        this.modifyExistingTodo = false;

        this.newTodo = new Todo();

        if (params['day'] && params['month'] && params['year']){ // Nouveau todo avec date


          console.log(params['day'], params['month'], params['year'])

          // this.newTodo = new Todo();
          this.newTodo.config.date = true;
          let date = new Date(params['year'], params['month'], params['day'])

          const year = date.getFullYear(); // Obtenir l'année au format complet (YYYY)
          const month = (date.getMonth()).toString().padStart(2, "0"); // Obtenir le mois au format deux chiffres (MM)
          const day = date.getDate().toString().padStart(2, "0"); // Obtenir le jour au format deux chiffres (DD)

          const formattedDate = `${year}-${month}-${day}`;

          this.newTodo.date = formattedDate;
          document.getElementById('datePicker')?.setAttribute('value', this.newTodo.date);
        }
      }
      this.setMainTodoId();
      
      // Initialisation pour drag and drop indexs
      this.initializeSubTasksList();

      this.initialTodo = JSON.parse(JSON.stringify(this.newTodo));
    });
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


  initializeSubTasksList(){

    this.actualizeWhenDeveloppedClicked();

    console.log("initialize subtask list")

    this.subTasksList = [];

    for (let subTask of this.newTodo.list!) {
      this.subTasksList.push(Todo.transformTodoInListByDepth(subTask));
    }
  }

  
  async drop(event: CdkDragDrop<any[]>) {

    await DragAndDrop.drop(event, this.newTodo, this.translate);
    this.initializeSubTasksList();
  }




  // SET TODO -> TODO CLASS

  //Remplacer par unique id avec database

  setMainTodoId(){
    let todoId = JSON.parse(localStorage.getItem('mainTodoId') || '0');

    if (this.newTodo.mainId) {
      this.newTodo.main = true;
    }
    else{
      this.newTodo.main = true;
      this.newTodo.mainId = todoId++;
    }

    localStorage.setItem('mainTodoId', JSON.stringify(todoId));
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

      this.todos = this.taskService.updateTodoById(this.todos, this.newTodo);

      this.navCtrl.navigateForward('/todo/' + this.newTodo.mainId);
    }
    else{
      this.todos.push(this.newTodo);

      this.taskService.setTodos(this.todos);

      this.navCtrl.navigateForward('/home');
    }

    console.log(this.todos)

    this.newTodo = new Todo();
  }


  // NAVIGATION

  showCloseConfirm = async () => {

    if (!Todo.areSameTodos(this.newTodo, this.initialTodo)){

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
  private setupBackButtonHandler() {
    this.platform.backButton.subscribeWithPriority(0, async () => {
      
      if (!Todo.areSameTodos(this.newTodo, this.initialTodo) && window.location.pathname.includes("add")){

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

  // Fonction pour parcourir l'arbre et attribuer des IDs
  assignIds(): void {

    let copyList = [...this.newTodo.list!];

    let queue = [{ list: copyList, parentId: 0 }];

    let id = 1;

    for (let i = 0; i < queue.length; i++) {
      while (queue[i].list.length > 0) {

        let todo = queue[i].list.shift()!;

        todo.main = false;
        todo.mainId = this.newTodo.mainId;
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

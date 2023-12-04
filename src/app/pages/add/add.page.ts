import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NavController, Platform } from '@ionic/angular';

import { ModalController } from '@ionic/angular';

import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';

import { ItemReorderEventDetail } from '@ionic/core';

import { Todo } from 'src/app/model/todo';

import { ModalService } from 'src/app/service/modal.service';
import { set } from 'firebase/database';

import { Dialog } from '@capacitor/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragAndDrop } from 'src/app/model/drag-and-drop';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  todos = JSON.parse(localStorage.getItem('todos') || '[]');

  newTodo!: Todo;
  index?: number = undefined;

  subType: string = 'customize';

  categories : any[] = [];
  categoryName : string = "";

  initialTodo : Todo = new Todo();


  subTasksList : any[] = [];

  showDate: boolean = false;

  modalConfig: any = {
    open: false,
    task: Todo,
    modify: false,
    parentTask: Todo,
  };

  newModalConfig: any = {
    open: false,
    task: Todo,
    modify: false,
    parentTask: Todo,
  };

  constructor(private navCtrl: NavController, 
              private route : ActivatedRoute, 
              private platform : Platform,
              private translate: TranslateService) 
  {
    let settings = JSON.parse(localStorage.getItem('settings') || '{}');

    if (settings.darkMode) {
      document.body.setAttribute('color-theme', 'dark');
    }
    else{
      document.body.setAttribute('color-theme', 'light');
    }

    this.translate.setDefaultLang(settings.language);
    this.translate.use(settings.language); 
  }

  ngOnInit() {

    this.setupBackButtonHandler();

    this.categories = JSON.parse(localStorage.getItem('categories') || '[]');

    // Récupère chemins et paramètres de la route active -> provenance : Todo / Home  
    this.route.params.subscribe((params) => {

      // Modification d'un Todo existant
      if (params['id']) {

        this.index = +params['id'];
        this.loadTodo(this.index);

        this.categoryName = this.newTodo.category.name;

        if (params['subId']){

          this.modalConfig.open = true
          this.modalConfig.task = Todo.findSubTodoById(this.newTodo, params['subId'])
          this.modalConfig.modify = true
          this.modalConfig.parentTask = undefined
        }
      }
      else if (params['day'] && params['month'] && params['year']){

        console.log(params['day'], params['month'], params['year'])

        this.newTodo = new Todo();
        this.newTodo.config.date = true;
        let date = new Date(params['year'], params['month'], params['day'])

        const year = date.getFullYear(); // Obtenir l'année au format complet (YYYY)
        const month = (date.getMonth()).toString().padStart(2, "0"); // Obtenir le mois au format deux chiffres (MM)
        const day = date.getDate().toString().padStart(2, "0"); // Obtenir le jour au format deux chiffres (DD)

        const formattedDate = `${year}-${month}-${day}`;

        this.newTodo.date = formattedDate;
        document.getElementById('datePicker')?.setAttribute('value', this.newTodo.date);
      }
      else{ // Nouveau todo
        this.newTodo = new Todo();
      }
      this.setMainTodoId();
      this.initializeSubTasksList();
      // Todo.setConfig(this.newTodo);

      this.initialTodo = JSON.parse(JSON.stringify(this.newTodo));
    });
  }


  ngAfterViewInit() {
    this.actualizeWhenDeveloppedClicked();
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

    for (let subTask of this.newTodo.list!) {
      this.subTasksList.push(Todo.transformTodoInListByDepth(subTask));
    }
  }

  
  async drop(event: CdkDragDrop<any[]>) {

    await DragAndDrop.drop(event, this.newTodo);
    this.initializeSubTasksList();
  }

  

  loadTodo(id : number){
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    console.log(this.todos)
    this.newTodo = this.todos.find((todo:Todo) => todo.mainId == id)!;
    
    // this.mainTodo = this.todos[id] 
  }


  //A vérifier si on en a besoin
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

  // getId(){
  //   return this.todos.length + 1;
  // }

  //Config

  //Reset config au cas ou


  canSaveTodo(){

    if (this.newTodo.title == undefined || this.newTodo.title == "") {
      return false;
    }

    return true;
  }


  saveTodo(){
    console.log(this.newTodo);

    this.assignIds();


    if (this.index != undefined) {
      // this.todos[this.index] = this.newTodo;

      this.todos.forEach((todo: Todo, index: number) => {
        if (todo.mainId === this.newTodo.mainId) {
          // Remplacez l'élément par le nouveau todo

          console.log("find id")

          this.todos[index] = this.newTodo;
        }
      });

      localStorage.setItem('todos', JSON.stringify(this.todos));
      this.newTodo = new Todo();
      //this.newSubTodo = new Todo();

      console.log("navigate to todo page")
      this.navCtrl.navigateForward('/todo/' + this.index);
    }
    else{
      this.todos.push(this.newTodo);

      localStorage.setItem('todos', JSON.stringify(this.todos));
      this.newTodo = new Todo();
      //this.newSubTodo = new Todo();

      this.navCtrl.navigateForward('/home');
    }
    //this.todos.push(this.newTodo);

  }


  showCloseConfirm = async () => {

    if (!Todo.areSameTodos(this.newTodo, this.initialTodo)){

      const { value } = await Dialog.confirm({
        title: 'Confirm',
        message: `Your change will be loosed ?`,
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
  };


  private setupBackButtonHandler() {
    this.platform.backButton.subscribeWithPriority(0, async () => {
      
      if (!Todo.areSameTodos(this.newTodo, this.initialTodo) && window.location.pathname.includes("add")){

        const { value } = await Dialog.confirm({
          title: 'Confirm',
          message: `Your change will be loosed ?`,
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






  // findTodoById(id: number): Todo {
  //   return this.todos.find((todo: { id: number; }) => todo.id === id)!;
  // }


  //List 



  changeCategory(){
    console.log(this.categoryName)
    this.newTodo.category = this.categories.find((category: any) => category.name === this.categoryName)!;
  }
  

  passedDate(){
    return Todo.passedDate(this.newTodo);
  }

// Notifications

  
 }

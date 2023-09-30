import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NavController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';

import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';

import { ItemReorderEventDetail } from '@ionic/core';

import { Todo } from 'src/app/model/todo';

import { ModalService } from 'src/app/service/modal.service';
import { set } from 'firebase/database';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  todos = JSON.parse(localStorage.getItem('todos') || '[]');

  newTodo!: Todo;
  index?: number = undefined;

  date: any = {date: '', time: ''};


  subType: string = 'customize';


  showDate: boolean = false;
  modalConfig: any = {
    open: false,
    task: Todo,
    modify: false,
    parentTask: Todo,
  };

  constructor(private navCtrl: NavController, private route : ActivatedRoute, private modalService: ModalService) 
  { }

  ngOnInit() {

    // Récupère chemins et paramètres de la route active -> provenance : Todo / Home  
    this.route.params.subscribe((params) => {

      // Modification d'un Todo existant
      if (params['id']) {

        this.index = +params['id'];
        this.loadTodo(this.index);

        if (params['subId']){

          this.modalConfig.open = true
          this.modalConfig.task = Todo.findSubTodoById(this.newTodo, params['subId'])
          this.modalConfig.modify = true
          this.modalConfig.parentTask = undefined
        }
        
        
      }
      else{ // Nouveau todo
        this.newTodo = new Todo();
      }
      this.setMainTodoId();
      //this.setConfig();
    });
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
  setConfig(){
    console.log("set config")
    let configArray = [
      { key: 'description', value: this.newTodo.description ? true : false },
      { key: 'priority', value: this.newTodo.priority ? true : false },
      { key: 'date', value: this.newTodo.date ? true : false },
      { key: 'repeat', value: this.newTodo.repeat ? true : false },
      // { key: 'note', value: false },
      { key: 'sub tasks', value: this.newTodo.list?.length ? true : false },
    ];

    this.newTodo.config = configArray;
  }

  
  findOnConfig(key: string): boolean {
    const configItem = this.newTodo.config.find(item => item.key === key);
    
    return configItem ? configItem.value : false;
  }

  closeOnConfig(key: string) {
    const configItem = this.newTodo.config.find(item => item.key === key);
    
    configItem!.value = false;
  }

  saveTodo(){
    console.log(this.newTodo);

    this.assignIds();


    if (this.index != undefined) {
      // this.todos[this.index] = this.newTodo;

      this.todos.forEach((todo: Todo, index: number) => {
        if (todo.mainId === this.newTodo.mainId) {
          // Remplacez l'élément par le nouveau todo
          this.todos[index] = this.newTodo;
        }
      });

      localStorage.setItem('todos', JSON.stringify(this.todos));
      this.newTodo = new Todo();
      //this.newSubTodo = new Todo();

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



  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    //ev.detail.complete(this.newTodo.list);

    //console.log(this.newTodo.list);
  }


// Notifications

  
 }

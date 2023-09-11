import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';

import { ItemReorderEventDetail } from '@ionic/core';

import { Todo } from 'src/app/model/todo';
import { Config } from 'src/app/model/todo';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  todos = JSON.parse(localStorage.getItem('todos') || '[]');

  newTodo!: Todo;

  //newSubTodo!: Todo;



  configArray: { key: string, value: boolean }[] = [
    { key: 'description', value: false },
    { key: 'date', value: false },
    { key: 'time', value: false },
    { key: 'repetition', value: false },
    { key: 'sub tasks', value: true },
    // { key: 'sub tasks', value: false },

  ];

  configCustomizedArray: { key: string, value: boolean }[] = this.configArray;

  // todoList: any[] = [];

  newTodoOnListTitle: string = "";

  showDate: boolean = false;
  openModal: any = {
    open: false,
    task: new Todo(),
    modify: false
  };

  constructor(private navCtrl: NavController, private modalService: ModalService) { }

  ngOnInit() {

    //Trouver id du Todo
    this.newTodo = new Todo();
    //this.newSubTodo = new Todo();

    this.modalService.openModal$.subscribe(openModal => {
      console.log("main open modal");
      if (openModal == 0) {
        this.openModal.open = false;
      } else {
        this.openModal.open = true;
      }
    });
    this.modalService.subTask$.subscribe(subTask => {

      if (subTask.level == 0 && subTask.todo) {

        console.log("subtask level 0");
        this.newTodo.list!.push(subTask.todo);
        subTask.todo = null;
        //this.newSubTodo = new Todo();
      }
      console.log(this.newTodo);
      //this.subTask = subTask;
      // Vous pouvez effectuer des opérations supplémentaires avec l'objet SubTask ici
    });
  }

  saveTodo(){
    console.log(this.newTodo);

    this.todos.push(this.newTodo);

    localStorage.setItem('todos', JSON.stringify(this.todos));

    this.newTodo = new Todo();
    //this.newSubTodo = new Todo();

    this.navCtrl.navigateForward('/home');
  }


  findOnConfig(key: string): boolean {
    const configItem = this.configArray.find(item => item.key === key);
    
    return configItem ? configItem.value : false;
  }

  closeOnConfig(key: string) {
    const configItem = this.configArray.find(item => item.key === key);
    
    configItem!.value = false;
  }


  onTypeChange(){

    switch (this.newTodo.type){
      
      case 'customize' :
        //this.config.customizedConfig();
        this.configArray = this.configCustomizedArray!;
        break;

      case 'todo' :
        this.configArray = [
          { key: 'description', value: false },
          { key: 'date', value: false },
          { key: 'time', value: false },
          { key: 'repetition', value: false },
          { key: 'sub tasks', value: false },
        ];
        break;

      case 'todo list':
        //this.config.todoListConfig();
        this.configArray = [
          { key: 'description', value: true },
          { key: 'date', value: true },
          { key: 'time', value: true },
          { key: 'repetition', value: false },
          { key: 'sub tasks', value: true },
        ];
        break;

      default:
        //Search in localStorage
        break;


    }
  }


  getId(){
    return this.todos.length + 1;
  }


  findTodoById(id: number): Todo {
    return this.todos.find((todo: { id: number; }) => todo.id === id)!;
  }



  addTodoOnList(){

    let newTodoOnList = new Todo(this.newTodoOnListTitle, 'todo');

    this.newTodo.list?.push(newTodoOnList);

    this.newTodoOnListTitle = '';
    console.log(this.newTodo);
  }


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


  addTaskOnList(){
    console.log(this.openModal);
    this.openModal.task = new Todo();
    this.openModal.open = true;
    this.openModal.modify = false;
  }


  modifyTaskOnList(subTask : any){
    this.openModal.task = subTask;
    this.openModal.open = true;
    this.openModal.modify = true;
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemReorderEventDetail, NavController } from '@ionic/angular';
import { Todo } from 'src/app/model/todo';
import { ModalService } from 'src/app/service/modal.service';
import { Dialog } from '@capacitor/dialog';

import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {


  todos: Todo[] = [];

  mainTodo! : Todo;

  todo! : Todo;
  index : number = 0;


  // originalIndex : number = 0;

  inSubTask : boolean = false;
  // openModal: boolean = false;

  configMode : boolean = false;

  

  newTodoOnListTitle: string = "";

  constructor(private navCtrl: NavController, private route : ActivatedRoute, private router : Router, private modalService : ModalService) { }

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
        this.todo = this.findSubTodo(+params['subId']!);
      }
    });

    this.setConfig();
  }


  //Reset config au cas ou
  setConfig(){
    console.log("set config")
    let configArray = [
      { key: 'description', value: this.todo.description ? true : false },
      { key: 'priority', value: this.todo.priority ? true : false },
      { key: 'date', value: this.todo.date ? true : false },
      { key: 'repeat', value: this.todo.repeat ? true : false },
      // { key: 'note', value: false },
      { key: 'sub tasks', value: this.todo.list?.length ? true : false },
    ];

    this.todo.config = configArray;
  }


  loadTodo(id : number){
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    console.log(this.todos)
    this.todo = this.todos.find(todo => todo.mainId == id)!;
    this.mainTodo = this.todos.find(todo => todo.mainId == id)!;
  }

  
  findSubTodo(subId : number){

    let copyList = [...this.mainTodo.list!];

    // Bfs algorithm
    while (copyList.length > 0) {

      let todo = copyList.shift()!;

      if (todo.subId == subId) {
        return todo;
      }

      for (let subTodo of todo.list!) {
        copyList.push(subTodo);
      }
    }
    return new Todo();
  }


  goBackTodo(){
    // this.navCtrl.back();
    // localStorage.setItem('todos', JSON.stringify(this.todos));

    if (this.inSubTask) {

      console.log("in subtask");

      console.log(this.todo.parentId);

      if (this.todo.parentId != undefined && this.todo.parentId != 0){
        console.log("parent")
        // this.router.navigate(['/todo', this.index , this.todo.parentId]);
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

    this.route.params.subscribe((params) => {

      if (params['subId'] == undefined) {
        this.router.navigate(['/add', this.index]);
      }
      else{
        this.router.navigate(['/add', this.index, params['subId']]);
      }

    });

    
    
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



  findOnConfig(key: string): boolean {
    const configItem = this.todo.config.find(item => item.key === key);
    
    return configItem ? configItem.value : false;
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

    // this.todo.list.push({
    //   type: 'todo',
    //   title: this.newTodoOnListTitle,
    // });

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
    this.router.navigate(['/conceptor', this.index]);
  }
 

  // manageNotification(){

  //   console.log("click")

  //   console.log("manage notification")
  //   console.log(this.todo.reminder);
  //   // this.newTodo.sayHello();
  //   if (this.todo.reminder) {
  //     Todo.scheduleNotification(this.todo);
  //   }
  //   else{
  //     Todo.cancelNotification(this.todo);
  //   }
  // }

}

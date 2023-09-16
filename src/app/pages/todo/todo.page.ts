import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemReorderEventDetail, NavController } from '@ionic/angular';
import { Todo } from 'src/app/model/todo';
import { ModalService } from 'src/app/service/modal.service';

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
  openModal: boolean = false;

  newTodoOnListTitle: string = "";

  constructor(private navCtrl: NavController, private route : ActivatedRoute, private router : Router, private modalService : ModalService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {

      if (params['subId'] == undefined) {
        this.inSubTask = false;
        this.index = +params['id'];

        this.loadTodo(this.index);
      }
      else{
        this.inSubTask = true;
        this.index = +params['id'];
        
        this.loadTodo(this.index);

        this.todo = this.findSubTodo(+params['subId']!);
      }

      
    });
  }
  
  findSubTodo(subId : number){

    let copyList = [...this.mainTodo.list!];

    // let queue = [{ list: copyList, parentId: 0 }];

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
    this.navCtrl.back();
    // localStorage.setItem('todos', JSON.stringify(this.todos));

    // if (this.inSubTask) {

    //   console.log("in subtask");

    //   console.log(this.todo.parentId);

    //   if (this.todo.parentId != undefined && this.todo.parentId != 0){
    //     console.log("parent")
    //     // this.router.navigate(['/todo', this.index , this.todo.parentId]);
    //   }
    //   else{
    //     console.log("no parent")
    //     this.router.navigate(['/todo', this.index]);
    //   }
      
    // }
    // else{
    //   this.router.navigate(['/home']);
    // }
  }


  loadTodo(id : number){
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    console.log(this.todos)
    this.todo = this.todos[id]
    this.mainTodo = this.todos[id]
  }

  deleteTodo(){
    this.todos.splice(this.index, 1);
    localStorage.setItem('todos', JSON.stringify(this.todos));

    //this.router.navigate(['/home']);
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
  

}

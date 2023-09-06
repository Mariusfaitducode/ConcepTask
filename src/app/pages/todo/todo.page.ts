import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemReorderEventDetail } from '@ionic/angular';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {


  todos = [];
  todo : any = {};
  index : number = 0;

  // originalIndex : number = 0;

  inSubTask : boolean = false;
  openModal: boolean = false;

  newTodoOnListTitle: string = "";

  constructor(private route : ActivatedRoute, private router : Router, private modalService : ModalService) { }

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

        this.todo = this.todo.list[params['subId']];
      }

      
    });

    this.modalService.openModal$.subscribe(openModal => {
      if (openModal) {
        this.openModal= true;
      } else {
        this.openModal = false;
      }
    });

    this.modalService.subTask$.subscribe(subTask => {

      if (subTask) {
        this.todo.list.push(subTask);
        subTask = null;
      }
      console.log(this.todo);
      //this.subTask = subTask;
      // Vous pouvez effectuer des opérations supplémentaires avec l'objet SubTask ici
    });
  }

  actualizeTodo(){
    localStorage.setItem('todos', JSON.stringify(this.todos));

    if (this.inSubTask) {
      this.router.navigate(['/todo', this.index]);
    }
    else{
      this.router.navigate(['/home']);
    }
  }


  loadTodo(id : number){
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    console.log(this.todos)
    this.todo = this.todos[id]
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

    this.todo.list.push({
      type: 'todo',
      title: this.newTodoOnListTitle,
    });

    this.newTodoOnListTitle = '';
    console.log(this.todo);
  }
  

}

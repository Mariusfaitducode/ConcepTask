import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog } from '@capacitor/dialog';
import { path } from 'd3';
import { Todo } from 'src/app/model/todo';

@Component({
  selector: 'app-node-modal',
  templateUrl: './node-modal.component.html',
  styleUrls: ['./node-modal.component.scss'],
})
export class NodeModalComponent implements OnInit {

  todos : Todo[] = [];
  todo : Todo = new Todo();
  mainTodo : Todo = new Todo();

  constructor(private route : ActivatedRoute, private router : Router) { }

  ngOnInit() {

    this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    // console.log(this.todos)
    // this.todo = this.todos.find(todo => todo.mainId == id)!;
    // this.mainTodo = this.todos.find(todo => todo.mainId == id)!;


    this.route.paramMap.subscribe(params => {

      console.log("CHANGE MODAAAAL")

      console.log(params)


      // if (params['modalId']) {
      //   console.log(params['modalId'])
      // }
    });
  }


  loadTodo(){

    let pathAr = window.location.pathname.split('/');

    let id = Number(pathAr[2]);
    let modalId = Number(pathAr[3]);

    // console.log(id)
    // console.log(modalId)

    //Détermine main todo
    let mainTodo = this.todos.find(todo => todo.mainId == id)!;
    this.mainTodo = mainTodo;

    console.log(modalId)

    if (modalId === 0){
      this.todo = mainTodo;
    }
    else{
      this.todo = Todo.findSubTodoById(mainTodo, modalId)!;
    }
  }
  

  closeModal() {
    //this.modalService.closeModal();
    var modal = document.getElementById("modal-node");
    modal!.classList.add('close-modal');

    let selectedNodes = document.getElementsByClassName('selected');

    for (let i = 0; i < selectedNodes.length; i++) {
      selectedNodes[i].classList.remove('selected');
    }
  }


  showConfirm = async () => {

    this.loadTodo()
    
    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: `Are you sure to delete `+ this.todo.title +` ?`,
    });
  
    console.log('Confirmed:', value);

    if (value) {
      this.deleteTodo(); 
    }
  };

  deleteTodo(){
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
    
    window.location.reload();
  }

  validateTodo(){
    this.loadTodo()

    this.todo.isDone = true;
    localStorage.setItem('todos', JSON.stringify(this.todos));
    console.log(this.todos);
    window.location.reload();
  }

  unvalidateTodo(){
    this.loadTodo()

    this.todo.isDone = false;
    localStorage.setItem('todos', JSON.stringify(this.todos));
    console.log(this.todos);
    window.location.reload();
  }

  modifyTodo(){

    this.loadTodo()
    console.log(this.todo)

    if (this.todo.main == false){
      this.router.navigate(['/add', this.mainTodo.mainId, this.todo.subId]);
    }
    else{
      this.router.navigate(['/add', this.mainTodo.mainId]);
    }
    
  }

}

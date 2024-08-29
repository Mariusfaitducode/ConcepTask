import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog } from '@capacitor/dialog';
import { TranslateService } from '@ngx-translate/core';
import { path } from 'd3';
import { Todo } from 'src/app/models/todo';
import { User } from 'src/app/models/user';
import { TaskService } from 'src/app/services/task/task.service';
import { UserService } from 'src/app/services/user/user.service';
import { TodoUtils } from 'src/app/utils/todo-utils';

@Component({
  selector: 'app-node-modal',
  templateUrl: './node-modal.component.html',
  styleUrls: ['./node-modal.component.scss'],
})
export class NodeModalComponent implements OnInit {

  constructor(
    private route : ActivatedRoute, 
    private router : Router, 
    private translate : TranslateService,
    private userService : UserService,
    private taskService : TaskService
  ) { }


  user : User | null = null;  

  todos : Todo[] = [];

  todo! : Todo;

  mainTodo! : Todo;


  ngOnInit() {

    this.taskService.getTodos().subscribe((todos: Todo[]) => {

      console.log('Todos loaded node modal:', todos)
      this.todos = todos;
    });

    this.userService.getUser().subscribe((user : User | null) => {
      console.log('Node modal component :User get', user)
      this.user = user;
    });


    // console.log(this.todos)
    // this.todo = this.todos.find(todo => todo.mainId == id)!;
    // this.mainTodo = this.todos.find(todo => todo.mainId == id)!;


    this.route.paramMap.subscribe(params => {

      console.log("CHANGE MODAAAAL")

      console.log(params)

      this.loadTodo()


      // if (params['modalId']) {
      //   console.log(params['modalId'])
      // }
    });
  }


  loadTodo(){

    let pathAr = window.location.pathname.split('/');

    let id = pathAr[pathAr.length-2];
    let modalId = Number(pathAr[pathAr.length-1]);

    // console.log("id",id)
    // console.log("modalId",modalId)

    //Détermine main todo
    let mainTodo = this.todos.find(todo => todo.id == id)!;
    this.mainTodo = mainTodo;

    console.log(this.todos)
    console.log(mainTodo)

    console.log(modalId)

    if (modalId === 0){
      this.todo = mainTodo;
    }
    else{
      this.todo = TodoUtils.findSubTodoById(mainTodo, modalId)!;
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
      message: `${this.translate.instant('DELETE MESSAGE')} `+ this.todo.title +` ?`,
    });
  
    console.log('Confirmed:', value);

    if (value) {
      this.deleteTodo(); 
    }
  };

  deleteTodo(){
    console.log("delete");

    this.taskService.deleteTodoById(this.mainTodo, this.todo);

    // if (this.todo.main == true){
    //   console.log("main")
    //   this.todos = this.todos.filter(todo => todo.mainId != this.todo.mainId);
    // }
    // else{
    //   Todo.deleteTodoById(this.mainTodo, this.todo.subId!);
    //   console.log(this.mainTodo.list)
    // }
    // localStorage.setItem('todos', JSON.stringify(this.todos));
    
    window.location.reload();
  }

  validateTodo(){
    this.loadTodo()

    this.todo.isDone = true;
    // localStorage.setItem('todos', JSON.stringify(this.todos));
    
    // this.taskService.actualizeTodos(this.todos, this.user);

    this.taskService.updateTodo(this.todo);



    console.log(this.todos);
    // window.location.reload();
  }

  unvalidateTodo(){
    this.loadTodo()

    this.todo.isDone = false;
    // localStorage.setItem('todos', JSON.stringify(this.todos));

    // this.taskService.actualizeTodos(this.todos, this.user);

    this.taskService.updateTodo(this.todo);

    console.log(this.todos);
    // window.location.reload();
  }

  modifyTodo(){

    this.loadTodo()
    console.log(this.todo)

    if (this.todo.main == false){
      this.router.navigate(['/add', this.mainTodo.id, this.todo.subId]);
    }
    else{
      this.router.navigate(['/add', this.mainTodo.id]);
    }
    
  }

}

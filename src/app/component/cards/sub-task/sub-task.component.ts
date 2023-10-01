import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Todo } from 'src/app/model/todo';

@Component({
  selector: 'app-sub-task',
  templateUrl: './sub-task.component.html',
  styleUrls: ['./sub-task.component.scss'],
})
export class SubTaskComponent  implements OnInit {

  constructor(private router : Router) { }

  @Input() todos?: Todo[];
  @Input() subTask: Todo = new Todo();

  //Main Todo
  @Input() parentTask: Todo = new Todo();
  
  //Index = mainTodo in todo page / subTodo in add page
  @Input() index: any;
  @Input() page: string = "";
  @Input() level: number = 0;

  // developped: boolean = false;

  @Input() openModal: any = {
    open: false,
    task: Todo,
    modify: false
  };

  subType : string = "customize";

  ngOnInit() {
    // Todo.setConfig(this.subTask);
  }

  backgroundColor(){
    const levelShade = 200 + (this.level * 50);

    return 'var(--ion-color-step-' + levelShade + ')';
  }

  marginLeft(){

    if (this.level!=0) {
      return '-2px';
    }
    return '10px';
  }

  developSubTaskPressed(event: Event){
    event.stopPropagation();
    this.subTask.developped = true;
  }


  // Use to have no erros but should be remove on new todos


  developSubTask(event: Event){
    event.stopPropagation();
    this.subTask.developped = !this.subTask.developped;
  }

  clickSubTask(){
    // [routerLink]="'/todo/' + this.index + '/' + subTodo.subId"

    if (this.page == "todo") {

      if (this.todos){
        console.log(this.todos);
        localStorage.setItem('todos', JSON.stringify(this.todos));
      }

      this.router.navigate(['/todo', this.subTask.mainId, this.subTask.subId]);
    }
    else{
      this.modifyTaskOnList(this.subTask);
    }

  }

  modifyTaskOnList(subTask : any){
    this.openModal.task = subTask;
    this.openModal.open = true;
    this.openModal.modify = true;
    this.openModal.parentTask = this.parentTask;
    this.openModal.index = this.index;
  }

  addSubTaskOnList(){
    this.openModal.task = new Todo();
    this.openModal.open = true;
    this.openModal.modify = false;
    this.openModal.parentTask = this.subTask;
  }

  
}

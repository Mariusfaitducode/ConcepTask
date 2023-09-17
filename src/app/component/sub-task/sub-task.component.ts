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

  @Input() subTask: Todo = new Todo();
  @Input() todo: Todo = new Todo();
  @Input() index: any;
  @Input() page: string = "";
  @Input() level: number = 0;

  developped: boolean = false;

  @Input() openModal: any = {
    open: false,
    task: new Todo(),
    modify: false
  };

  ngOnInit() {}

  // deleteSubTask(){
  //   this.todo.list.splice(this.index, 1);
  // }

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
    this.developped = true;
  }


  developSubTask(event: Event){
    event.stopPropagation();
    this.developped = !this.developped;
  }

  clickSubTask(){
    // [routerLink]="'/todo/' + this.index + '/' + subTodo.subId"

    if (this.page == "todo") {

      this.router.navigate(['/todo', this.index , this.subTask.subId]);
    }
    else{
      this.modifyTaskOnList(this.subTask);
    }

  }

  modifyTaskOnList(subTask : any){
    this.openModal.task = subTask;
    this.openModal.open = true;
    this.openModal.modify = true;
  }

}

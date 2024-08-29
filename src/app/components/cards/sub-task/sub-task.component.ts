import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Todo } from 'src/app/models/todo';

import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskModal } from 'src/app/models/task-modal';
import { TodoDate } from 'src/app/utils/todo-date';

@Component({
  selector: 'app-sub-task',
  templateUrl: './sub-task.component.html',
  styleUrls: ['./sub-task.component.scss'],
})
export class SubTaskComponent  implements OnInit {

  constructor(
    private router : Router,
    // private taskService : TaskService
    ) { }

  @Input() mainId!: string;

  @Input() todos?: Todo[];
  @Input() subTask!: Todo;

  //Main Todo
  @Input() parentTask!: Todo;
  
  //Index = mainTodo in todo page / subTodo in add page
  // @Input() index: number = 0;
  @Input() page: string = "";
  @Input() level: number = 0;

  @Input() hideSubTasks: boolean = false;

  @Input() openModal: TaskModal = new TaskModal();

  subType : string = "customize";

  isDragged: boolean = false;

  ngOnInit() {
  }

  startDrag(){
    console.log("Start Timer")
    

    if ('vibrate' in navigator) {
      console.log("Vibrate")
      navigator.vibrate(100);
    }

    this.isDragged = true;
  }

  stopDrag(){
    this.isDragged = false;
  }


  backgroundColor(){
    const levelShade = 50 + (this.level * 50);

    return 'var(--ion-color-step-' + levelShade + ')';
  }


  marginLeft(){

    if (this.level!=0) {
      return '-2px';
    }
    return '8px';
  }


  developSubTaskPressed(event: Event){
    event.stopPropagation();
    this.subTask.developped = true;
  }


  developSubTask(event: Event){
    event.stopPropagation();
    this.subTask.developped = !this.subTask.developped;

    // localStorage.setItem('todos', JSON.stringify(this.todos));

  }


  clickSubTask(){
    // [routerLink]="'/todo/' + this.index + '/' + subTodo.subId"

    if (this.page == "todo") {

      // if (this.todos){
      //   console.log(this.todos);
      //   localStorage.setItem('todos', JSON.stringify(this.todos));
      // }

      this.router.navigate(['/todo', this.mainId, this.subTask.subId]);
    }
    else{

      // add page
      this.modifyTaskOnList(this.subTask);
    }
  }

  modifyTaskOnList(subTask : Todo){

    this.openModal.openModifyTaskModal(subTask, this.parentTask);
  }

  addSubTaskOnList(){

    this.openModal.openNewTaskModal(this.subTask);
  }


  numberOfDoneSubTask(){
    if (this.subTask.list) {
      return this.subTask.list.filter((subTodo : Todo) => subTodo.isDone).length;
    }
    return 0;
  }
  
  passedDate(){
    return TodoDate.passedDate(this.subTask);
  }
}

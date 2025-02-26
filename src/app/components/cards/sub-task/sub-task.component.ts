import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// import { Todo } from 'src/app/models/todo';

import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskModal } from 'src/app/models/task-modal';
import { TodoDate } from 'src/app/utils/todo-date';
import { SubTodo } from 'src/app/models/todo/sub-todo';
import { MainTodo } from 'src/app/models/todo/main-todo';

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

  // @Input() todos?: Todo[];
  @Input() subTask!: SubTodo;

  @Output() todoSelectedEmitter = new EventEmitter<SubTodo>();

  @Output() todoDeveloppedEmitter = new EventEmitter();

  //Parent of subTask
  @Input() parentTask!: MainTodo | SubTodo;
  
  
  @Input() level: number = 0;

  @Input() hideSubTasks: boolean = false;

  @Input() openModal: TaskModal = new TaskModal();

  @Input() developped: boolean = true;

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


  // developSubTaskPressed(event: Event){
  //   event.stopPropagation();
  //   this.subTask.developped = true;
  // }


  developSubTask(event: Event){
    event.stopPropagation();
    this.subTask.properties.developped = !this.subTask.properties.developped;

    // localStorage.setItem('todos', JSON.stringify(this.todos));

    this.todoDeveloppedEmitter.emit();
  }

  onTodoDevelopped(){
    this.todoDeveloppedEmitter.emit();
  }


  // Navigation

  onNewTodoSelected(todo: SubTodo){
    this.todoSelectedEmitter.emit(todo);
  }


  clickSubTask(){

    this.todoSelectedEmitter.emit(this.subTask);
  }

  modifyTaskOnList(subTask : SubTodo){

    this.openModal.openModifyTaskModal(subTask, this.parentTask);
  }

  // addSubTaskOnList(){

  //   this.openModal.openNewTaskModal(this.subTask);
  // }


  numberOfDoneSubTask(){
    if (this.subTask.list) {
      return this.subTask.list.filter((subTodo : SubTodo) => subTodo.properties.isDone).length;
    }
    return 0;
  }
  
  passedDate(){
    return TodoDate.passedDate(this.subTask);
  }
}

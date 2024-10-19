import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MainTodo } from 'src/app/models/todo/main-todo';
import { SubTodo } from 'src/app/models/todo/sub-todo';
import { TodoDate } from 'src/app/utils/todo-date';
// import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-maintodo-subtask',
  templateUrl: './maintodo-subtask.component.html',
  styleUrls: ['./maintodo-subtask.component.scss',
    '../../cards/sub-task/sub-task.component.scss'
  ],
})
export class MaintodoSubtaskComponent  implements OnInit {

  @Input() mainTodo!: MainTodo;
  @Input() todo!: SubTodo;

  // @Input() todos!: Todo[];

  @Input() hideDoneTasks: boolean = false;

  @Output() todoSelectedEmitter = new EventEmitter<SubTodo>();

  
  

  constructor() { }

  ngOnInit() {}


  onNewTodoSelected(todo: SubTodo){
    this.todoSelectedEmitter.emit(todo);
  }



  backgroundColor(){
    const levelShade = 50 + (0 * 50);

    return 'var(--ion-color-step-' + levelShade + ')';
  }


  marginLeft(){

    
    return '8px';
  }


  // developSubTaskPressed(event: Event){
  //   event.stopPropagation();
  //   this.subTask.developped = true;
  // }


  // Navigation


  clickSubTask(){

    this.todoSelectedEmitter.emit(this.mainTodo);
  }

  // addSubTaskOnList(){

  //   this.openModal.openNewTaskModal(this.subTask);
  // }


  numberOfDoneSubTask(){
    if (this.mainTodo.list) {
      return this.mainTodo.list.filter((subTodo : SubTodo) => subTodo.properties.isDone).length;
    }
    return 0;
  }
  
  passedDate(){
    return TodoDate.passedDate(this.mainTodo);
  }
}

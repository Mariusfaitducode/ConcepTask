import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskModal } from 'src/app/models/task-modal';
// import { Todo } from 'src/app/models/todo';
import { MainTodo } from 'src/app/models/todo/main-todo';
import { SubTodo } from 'src/app/models/todo/sub-todo';

@Component({
  selector: 'app-button-add-sub-task',
  templateUrl: './button-add-sub-task.component.html',
  styleUrls: ['./button-add-sub-task.component.scss'],
})
export class ButtonAddSubTaskComponent  implements OnInit {

  @Input() parentTask!: MainTodo | SubTodo;
  @Input() modalConfig!: TaskModal;

  // @Input() todosList!: MainTodo[];

  @Output() initializeDragDropListEmitter = new EventEmitter();

  subType : string = "customize";
  newTodoOnListTitle: string = "";

  constructor() { }

  ngOnInit() {}


  // Add simple todo
  addTodoOnList(){
    let newTodoOnList = new SubTodo();
    newTodoOnList.properties.title = this.newTodoOnListTitle;
    this.parentTask.list?.push(newTodoOnList);
    this.newTodoOnListTitle = '';
    this.initializeDragDropListEmitter.emit();
  }


  // Add sub task with modal
  addTaskOnList(){

    this.modalConfig.openNewTaskModal(this.parentTask)

    console.log(this.modalConfig);
  }

}

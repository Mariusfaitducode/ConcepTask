import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskModal } from 'src/app/models/task-modal';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-button-add-sub-task',
  templateUrl: './button-add-sub-task.component.html',
  styleUrls: ['./button-add-sub-task.component.scss'],
})
export class ButtonAddSubTaskComponent  implements OnInit {

  @Input() parentTask!: Todo;
  @Input() modalConfig!: TaskModal;

  @Input() todosList!: Todo[];

  @Output() initializeDragDropListEmitter = new EventEmitter();

  subType : string = "customize";
  newTodoOnListTitle: string = "";

  constructor() { }

  ngOnInit() {}


  // Add simple todo
  addTodoOnList(){
    let newTodoOnList = new Todo(this.todosList.length);
    newTodoOnList.title = this.newTodoOnListTitle;
    this.parentTask.list?.push(newTodoOnList);
    this.newTodoOnListTitle = '';
    this.initializeDragDropListEmitter.emit();
  }


  // Add sub task with modal
  addTaskOnList(){

    this.modalConfig.openNewTaskModal(this.parentTask, this.todosList.length)

    console.log(this.modalConfig);
  }

}

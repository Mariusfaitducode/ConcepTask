import { Component, OnInit, Input } from '@angular/core';
import { TaskModal } from 'src/app/models/task-modal';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-button-add-sub-task',
  templateUrl: './button-add-sub-task.component.html',
  styleUrls: ['./button-add-sub-task.component.scss'],
})
export class ButtonAddSubTaskComponent  implements OnInit {

  @Input() parentTask!: Todo;
  @Input() modalConfig: TaskModal = new TaskModal();

  subType : string = "customize";
  newTodoOnListTitle: string = "";

  constructor() { }

  ngOnInit() {}


  // Add simple todo
  addTodoOnList(){
    let newTodoOnList = new Todo();
    newTodoOnList.title = this.newTodoOnListTitle;
    this.parentTask.list?.push(newTodoOnList);
    this.newTodoOnListTitle = '';
  }


  // Add sub task with modal
  addTaskOnList(){
    this.modalConfig.task = new Todo();
    this.modalConfig.open = true;
    this.modalConfig.modify = false;
    this.modalConfig.parentTask = this.parentTask;
    console.log(this.modalConfig);
  }

}

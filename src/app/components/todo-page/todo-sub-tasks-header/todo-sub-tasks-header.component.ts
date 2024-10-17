import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { Todo } from 'src/app/models/todo';
import { MainTodo } from 'src/app/models/todo/main-todo';
import { SubTodo } from 'src/app/models/todo/sub-todo';

@Component({
  selector: 'app-todo-sub-tasks-header',
  templateUrl: './todo-sub-tasks-header.component.html',
  styleUrls: ['./todo-sub-tasks-header.component.scss'],
})
export class TodoSubTasksHeaderComponent  implements OnInit {


  @Input() todo!: MainTodo | SubTodo;
  @Input() mainTodo!: MainTodo;
  subMode : string = "tree";
  // hideDoneTasks : boolean = false;

  @Output() subModeChangeEmitter = new EventEmitter<string>();
  // @Output() hideDoneTasksChangeEmitter = new EventEmitter<boolean>();
  @Output() initializeDragDropListEmitter = new EventEmitter();



  constructor() { }

  ngOnInit() {}

  changeSubMode(){
    // this.subMode = this.subMode === "tree" ? "graph" : "tree";
    this.subModeChangeEmitter.emit(this.subMode);

    console.log(this.subMode)
  }

  changeHideDoneTasks(){
    // this.hideDoneTasks = !this.hideDoneTasks;
    // this.hideDoneTasksChangeEmitter.emit(this.hideDoneTasks);
    this.initializeDragDropListEmitter.emit();
  }
}

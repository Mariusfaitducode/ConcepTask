import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-todo-sub-tasks-header',
  templateUrl: './todo-sub-tasks-header.component.html',
  styleUrls: ['./todo-sub-tasks-header.component.scss'],
})
export class TodoSubTasksHeaderComponent  implements OnInit {


  // @Input() todo!: Todo;
  subMode : string = "tree";
  hideDoneTasks : boolean = false;

  @Output() subModeChangeEmitter = new EventEmitter<string>();
  @Output() hideDoneTasksChangeEmitter = new EventEmitter<boolean>();



  constructor() { }

  ngOnInit() {}

  changeSubMode(){
    // this.subMode = this.subMode === "tree" ? "graph" : "tree";
    this.subModeChangeEmitter.emit(this.subMode);

    console.log(this.subMode)
  }

  changeHideDoneTasks(){
    // this.hideDoneTasks = !this.hideDoneTasks;
    this.hideDoneTasksChangeEmitter.emit(this.hideDoneTasks);
  }
}

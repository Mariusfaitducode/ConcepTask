import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-todo-header-right-buttons',
  templateUrl: './todo-header-right-buttons.component.html',
  styleUrls: ['./todo-header-right-buttons.component.scss'],
})
export class TodoHeaderRightButtonsComponent  implements OnInit {

  @Input() todo!: Todo;

  @Input() isNewTodo!: boolean;

  editMode: boolean = false;

  @Output() editModeEmitter = new EventEmitter<boolean>();

  @Output() deleteEmitter = new EventEmitter();

  @Output() validationEmitter = new EventEmitter<boolean>();



  constructor() { }

  ngOnInit() {}

  modifyTodo(){
    this.editMode = !this.editMode;
    this.editModeEmitter.emit(this.editMode);
  }

  deleteTodo(){
    this.deleteEmitter.emit();
  }

  validateTodo(){
    this.validationEmitter.emit(true);
  }

  unvalidateTodo(){
    this.validationEmitter.emit(false);
  }



}

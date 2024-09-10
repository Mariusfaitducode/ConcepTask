import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-todo-subtasks-tree',
  templateUrl: './todo-subtasks-tree.component.html',
  styleUrls: ['./todo-subtasks-tree.component.scss'],
})
export class TodoSubtasksTreeComponent  implements OnInit {

  @Input() mainTodo!: Todo;
  @Input() todo!: Todo;

  @Input() todos!: Todo[];

  @Input() hideDoneTasks: boolean = false;

  @Input() subTasksList: {todo: Todo, level: number}[][] = [];

  @Output() todoSelectedEmitter = new EventEmitter<Todo>();

  constructor() { }

  ngOnInit() {}

  onNewTodoSelected(todo: Todo){
    this.todoSelectedEmitter.emit(todo);
  }


  async drop(event: CdkDragDrop<any[]>) {

    // TODO : fix drop event

    // await DragAndDrop.drop(event, this.mainTodo, this.translate);
    // this.initializeSubTasksList();
    // // localStorage.setItem('todos', JSON.stringify(this.todos));
    // this.taskService.actualizeTodos(this.todos, this.user);
  }
}

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Todo } from 'src/app/models/todo';
import { DragAndDrop } from 'src/app/utils/drag-and-drop';

@Component({
  selector: 'app-todo-subtasks-tree',
  templateUrl: './todo-subtasks-tree.component.html',
  styleUrls: ['./todo-subtasks-tree.component.scss'],
})
export class TodoSubtasksTreeComponent  implements OnInit {

  @Input() mainTodo!: Todo;
  @Input() todo!: Todo;

  @Input() todos!: Todo[];

  @Input() dragAndDropTodosDatas: {todo: Todo, level: number}[][] = [];

  @Output() todoSelectedEmitter = new EventEmitter<Todo>();

  @Output() initializeDragDropListEmitter = new EventEmitter();



  constructor(
    private translate : TranslateService) { }

  ngOnInit() {}

  onNewTodoSelected(todo: Todo){
    this.todoSelectedEmitter.emit(todo);
  }

  onTodoDevelopped(){
    this.initializeDragDropListEmitter.emit();
  }


  async drop(event: CdkDragDrop<any[]>) {

    // TODO : fix drop event


    console.log("DROP MOMENT : ", this.dragAndDropTodosDatas);

    await DragAndDrop.drop(event, this.mainTodo, this.translate);
    this.initializeDragDropListEmitter.emit();
    // this.initializeSubTasksList();
    // localStorage.setItem('todos', JSON.stringify(this.todos));
    // this.taskService.actualizeTodos(this.todos, this.user);
  }
}

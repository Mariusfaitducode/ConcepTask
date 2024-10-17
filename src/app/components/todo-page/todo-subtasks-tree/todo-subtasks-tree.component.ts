import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// import { Todo } from 'src/app/models/todo';
import { DragAndDrop } from 'src/app/utils/drag-and-drop';
import { MainTodo } from 'src/app/models/todo/main-todo';
import { SubTodo } from 'src/app/models/todo/sub-todo';


@Component({
  selector: 'app-todo-subtasks-tree',
  templateUrl: './todo-subtasks-tree.component.html',
  styleUrls: ['./todo-subtasks-tree.component.scss'],
})
export class TodoSubtasksTreeComponent  implements OnInit {

  @Input() mainTodo!: MainTodo;
  @Input() todo!: MainTodo | SubTodo;

  // @Input() todos!: Todo[];

  @Input() dragAndDropTodosDatas: {todo: SubTodo, level: number}[][] = [];

  @Output() todoSelectedEmitter = new EventEmitter<SubTodo>();

  @Output() initializeDragDropListEmitter = new EventEmitter();



  constructor(
    private translate : TranslateService) { }

  ngOnInit() {}

  onNewTodoSelected(todo: SubTodo){
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

import { Component, OnInit, Input } from '@angular/core';
import { Todo } from 'src/app/model/todo';

@Component({
  selector: 'app-button-add-sub-task',
  templateUrl: './button-add-sub-task.component.html',
  styleUrls: ['./button-add-sub-task.component.scss'],
})
export class ButtonAddSubTaskComponent  implements OnInit {

  @Input() parentTask!: Todo;
  @Input() modalConfig: any = {};

  subType : string = "customize";
  newTodoOnListTitle: string = "";

  constructor() { }

  ngOnInit() {}

  findOnConfig(key: string): boolean {
    const configItem = this.parentTask.config.find(item => item.key === key);
    
    return configItem ? configItem.value : false;
  }


  addTodoOnList(){

    let newTodoOnList = new Todo(this.newTodoOnListTitle, 'todo');

    this.parentTask.list?.push(newTodoOnList);

    this.newTodoOnListTitle = '';
    //console.log(this.newTodo);
  }


  addTaskOnList(){
    this.modalConfig.task = new Todo();
    this.modalConfig.open = true;
    this.modalConfig.modify = false;
    this.modalConfig.parentTask = this.parentTask;
    console.log(this.modalConfig);
  }

}

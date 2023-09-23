import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Todo } from 'src/app/model/todo';

@Component({
  selector: 'app-sub-task',
  templateUrl: './sub-task.component.html',
  styleUrls: ['./sub-task.component.scss'],
})
export class SubTaskComponent  implements OnInit {

  constructor(private router : Router) { }

  @Input() subTask: Todo = new Todo();

  //Main Todo
  @Input() todo: Todo = new Todo();
  @Input() index: any;
  @Input() page: string = "";
  @Input() level: number = 0;

  developped: boolean = false;

  @Input() openModal: any = {
    open: false,
    task: Todo,
    modify: false
  };

  subType : string = "customize";

  ngOnInit() {
    this.setConfig();
  }

  // deleteSubTask(){
  //   this.todo.list.splice(this.index, 1);
  // }

  backgroundColor(){
    const levelShade = 200 + (this.level * 50);

    return 'var(--ion-color-step-' + levelShade + ')';
  }

  marginLeft(){

    if (this.level!=0) {
      return '-2px';
    }
    return '10px';
  }

  developSubTaskPressed(event: Event){
    event.stopPropagation();
    this.developped = true;
  }


  // Use to have no erros but should be remove on new todos
  setConfig(){
    let configArray = [
      { key: 'description', value: this.subTask.description ? true : false },
      { key: 'date', value: this.subTask.date ? true : false },
      { key: 'time', value: this.subTask.time ? true : false },
      { key: 'repetition', value: this.subTask.repetition ? true : false },
      { key: 'sub tasks', value: this.subTask.list?.length ? true : false },
    ];

    this.subTask.config = configArray;
  }


  findOnConfig(key: string): boolean {
    const configItem = this.subTask.config.find(item => item.key === key);
    
    return configItem ? configItem.value : false;
  }


  developSubTask(event: Event){
    event.stopPropagation();
    this.developped = !this.developped;
  }

  clickSubTask(){
    // [routerLink]="'/todo/' + this.index + '/' + subTodo.subId"

    if (this.page == "todo") {

      this.router.navigate(['/todo', this.index , this.subTask.subId]);
    }
    else{
      this.modifyTaskOnList(this.subTask);
    }

  }

  modifyTaskOnList(subTask : any){
    this.openModal.task = subTask;
    this.openModal.open = true;
    this.openModal.modify = true;
  }

  addSubTaskOnList(){
    this.openModal.task = new Todo();
    this.openModal.open = true;
    this.openModal.modify = false;
    this.openModal.parentTask = this.subTask;
  }

}

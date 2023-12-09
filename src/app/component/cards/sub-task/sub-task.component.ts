import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Todo } from 'src/app/model/todo';

import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sub-task',
  templateUrl: './sub-task.component.html',
  styleUrls: ['./sub-task.component.scss'],
})
export class SubTaskComponent  implements OnInit {

  constructor(private router : Router) { }

  @Input() todos?: Todo[];
  @Input() subTask: Todo = new Todo();

  //Main Todo
  @Input() parentTask: Todo = new Todo();
  
  //Index = mainTodo in todo page / subTodo in add page
  @Input() index: any;
  @Input() page: string = "";
  @Input() level: number = 0;

  @Input() hideSubTasks: boolean = false;
  

  // developped: boolean = false;

  @Input() openModal: any = {
    open: false,
    task: Todo,
    modify: false
  };

  subType : string = "customize";

  isDragged: boolean = false;

  // @ViewChild('dragElement') dragElement?: CdkDrag;

  ngOnInit() {
    // Todo.setConfig(this.subTask);
  }

  // drop(event: CdkDragDrop<any[]>) {
  //   console.log("Element dropped")
  //   console.log(event.previousContainer.id);
  //   console.log(event.container.id);

  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //     return;
  //   }
  //   else{
  //     // event.container.data.push(event.previousContainer.data[event.previousIndex])
  //     //event.container.data.splice(0, 0, event.previousContainer.data[event.previousIndex]);
  //     //event.previousContainer.data.splice(event.previousIndex, 1);
      
  //   }
  //   // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  // }

  // drag(event: any) {
  //   console.log("Element dragStart")
  //   console.log(event);
  // }

  startDrag(){
    console.log("Start Timer")
    

    if ('vibrate' in navigator) {
      console.log("Vibrate")
      navigator.vibrate(100);
    }

    this.isDragged = true;
  }

  stopDrag(){
    this.isDragged = false;
  }

  // onEntered(event: any) {
  //   console.log("Element entered")
  //   console.log(event);

  // //   const element = event.getPlaceholderElement();
  // // if (element) {
  // //   element.parentElement.style.backgroundColor = 'lightblue'; // Exemple de style à appliquer
  // // }
  // }

  // clearTimer(){
  //   console.log("Clear Timer")
  // }

  // onDragStarted(event: any) {
  //   console.log("Element dragStart")
  //   console.log(event);
  // }

  // onDragEnded(event: any) 
  // {
  //   console.log("Element dragEnd")
  //   console.log(event);
  // }


  backgroundColor(){
    const levelShade = 50 + (this.level * 50);

    return 'var(--ion-color-step-' + levelShade + ')';
  }

  marginLeft(){

    if (this.level!=0) {
      return '-2px';
    }
    return '8px';
  }

  developSubTaskPressed(event: Event){
    event.stopPropagation();
    this.subTask.developped = true;
  }


  // Use to have no erros but should be remove on new todos


  developSubTask(event: Event){
    event.stopPropagation();
    this.subTask.developped = !this.subTask.developped;
  }

  clickSubTask(){
    // [routerLink]="'/todo/' + this.index + '/' + subTodo.subId"

    if (this.page == "todo") {

      if (this.todos){
        console.log(this.todos);
        localStorage.setItem('todos', JSON.stringify(this.todos));
      }

      this.router.navigate(['/todo', this.subTask.mainId, this.subTask.subId]);
    }
    else{
      this.modifyTaskOnList(this.subTask);
    }
  }

  modifyTaskOnList(subTask : any){
    this.openModal.task = subTask;
    this.openModal.open = true;
    this.openModal.modify = true;
    this.openModal.parentTask = this.parentTask;
    this.openModal.index = this.index;
  }

  addSubTaskOnList(){
    this.openModal.task = new Todo();
    this.openModal.open = true;
    this.openModal.modify = false;
    this.openModal.parentTask = this.subTask;
  }


  numberOfDoneSubTask(){
    if (this.subTask.list) {
      return this.subTask.list.filter((subTodo : any) => subTodo.isDone).length;
    }
    return 0;
  }
  
  passedDate(){
    return Todo.passedDate(this.subTask);
  }
}

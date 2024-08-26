import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { ItemReorderEventDetail, ModalController, NavController } from '@ionic/angular';
import { set } from 'firebase/database';
import { Todo } from 'src/app/models/todo';
import { Dialog } from '@capacitor/dialog';

import { LocalNotifications } from '@capacitor/local-notifications';
import { TranslateService } from '@ngx-translate/core';
import { Category } from 'src/app/models/category';
import { TaskModal } from 'src/app/models/task-modal';
import { TodoDate } from 'src/app/utils/todo-date';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss'],
})
export class AddModalComponent implements OnInit, AfterViewInit {

  //@ViewChild('child') childComponentRef!: ElementRef;

  @Input() modalConfig: TaskModal = new TaskModal();

  @Input() newModalConfig: TaskModal = new TaskModal();


  //@Input() subTodo! : Todo;
  subTask!: Todo;

  initialSubTask : Todo = new Todo();

  modify : boolean = false;

  showDate: boolean = false;
  subType: string = 'customize';
  categories : Category[] = [];


  constructor(private translate : TranslateService) { }

  ngAfterViewInit() {
    
    let doc = document.getElementsByClassName('content');

    for (let con of Array.from(doc)) {
      con.classList.add('start-effect');
    }
  }


  ngOnInit() {

    this.categories = JSON.parse(localStorage.getItem('categories') || '[]');


    this.subTask = this.modalConfig.task!;
    this.modify = this.modalConfig.modify;

    //this.setConfig();
    
    this.initialSubTask = JSON.parse(JSON.stringify(this.subTask));
  }

 


  showConfirm = async () => {
    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: `${this.translate.instant('DELETE MESSAGE')} `+ this.subTask.title +` ?`,
    });
  
    console.log('Confirmed:', value);

    if (value) {
      this.deleteSubTask();
    }
  };


  // showCloseConfirm = async () => {

  //   if (!Todo.areSameTodos(this.subTask, this.initialSubTask)){

  //     const { value } = await Dialog.confirm({
  //       title: 'Confirm',
  //       message: `Your change will be loosed ?`,
  //     });
    
  //     console.log('Confirmed:', value);
  
  //     if (value) {
  //       this.modalConfig.open = false;
  //     }
  //   }
  //   else{
  //     this.modalConfig.open = false;
  //   }
  // };



  deleteSubTask(){
    this.modalConfig.parentTask!.list!.splice(this.modalConfig.index!, 1);

    //this.modalConfig.parentTask.list.filter((item: Todo) => item !== this.subTask)

    
    console.log( this.modalConfig.parentTask!.list )
    this.modalConfig.open = false;
  }


  addSubTask(){

    
    
    console.log( this.subTask )

    this.modalConfig.parentTask!.list.push(this.subTask);

    this.closeSubTask();
    
  }

  closeSubTask(){
    this.modalConfig.open = false;
  }



  

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    ev.detail.complete(this.subTask.list);

    console.log(this.subTask.list);
  }


  
  manageNotification(){

    console.log("click")

    console.log("manage notification")
    console.log(this.subTask.reminder);
    // this.newTodo.sayHello();
    if (this.subTask.reminder) {
      // Todo.scheduleNotification(this.subTask);
    }
    else{
      // Todo.cancelNotification(this.subTask);
    }
  }

  passedDate(){
    return TodoDate.passedDate(this.subTask);
  }
}

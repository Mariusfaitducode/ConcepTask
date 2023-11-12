import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { ItemReorderEventDetail, ModalController, NavController } from '@ionic/angular';
import { set } from 'firebase/database';
import { Todo } from 'src/app/model/todo';
import { ModalService } from 'src/app/service/modal.service';
import { Dialog } from '@capacitor/dialog';

import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss'],
})
export class AddModalComponent implements OnInit, AfterViewInit {

  //@ViewChild('child') childComponentRef!: ElementRef;

  @Input() modalConfig: any = {};

  @Input() newModalConfig: any = {};

  @Output() childModified = new EventEmitter<boolean>();

  //@Input() subTodo! : Todo;
  subTask!: Todo;

  //@Input() level! : number;

  // newSubTodo: Todo = new Todo();

  //@Input() modify : boolean = false;
  modify : boolean = false;

  // newTodoOnListTitle: string = "";

  showDate: boolean = false;

  subType: string = 'customize';

  changeTodo: boolean = false;

  categories : any[] = [];

  /*openModal: any = {
    open: false,
    task: new Todo(),
    modify: false
  };*/

  constructor(private modalService: ModalService) { }

  ngAfterViewInit() {
    
    let doc = document.getElementsByClassName('content');

    for (let con of Array.from(doc)) {
      con.classList.add('start-effect');
    }
  }


  ngOnInit() {

    this.categories = JSON.parse(localStorage.getItem('categories') || '[]');


    this.subTask = this.modalConfig.task;
    this.modify = this.modalConfig.modify;

    //this.setConfig();
  }

 


  showConfirm = async () => {
    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: `Are you sure to delete `+ this.subTask.title +` ?`,
    });
  
    console.log('Confirmed:', value);

    if (value) {
      this.deleteSubTask();
    }
  };


  showCloseConfirm = async () => {

    if (this.changeTodo){

      const { value } = await Dialog.confirm({
        title: 'Confirm',
        message: `Your change will be loosed ?`,
      });
    
      console.log('Confirmed:', value);
  
      if (value) {
        this.modalConfig.open = false;
        
      }
    }
    else{
      this.modalConfig.open = false;
    }
  };



  deleteSubTask(){
    this.modalConfig.parentTask.list!.splice(this.modalConfig.index, 1);

    //this.modalConfig.parentTask.list.filter((item: Todo) => item !== this.subTask)

    
    console.log( this.modalConfig.parentTask.list )
    this.modalConfig.open = false;
  }


  addSubTask(){

    
    
    console.log( this.subTask )

    this.modalConfig.parentTask.list.push(this.subTask);

    this.closeSubTask();
    
  }

  closeSubTask(){
    this.childModified.emit(true)
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
    return Todo.passedDate(this.subTask);
  }
}

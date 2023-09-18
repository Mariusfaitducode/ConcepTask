import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
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

  @ViewChild('child') childComponentRef!: ElementRef;

  // @Input() openModal : boolean = true;

  @Input() subTodo! : Todo;

  @Input() level! : number;

  // newSubTodo: Todo = new Todo();


  configArray: { key: string, value: boolean }[] = [
    { key: 'description', value: false },
    { key: 'date', value: false },
    { key: 'time', value: false },
    { key: 'repetition', value: false },
    { key: 'sub tasks', value: true },
    // { key: 'sub tasks', value: false },

  ];

  @Input() modify : boolean = false;

  newTodoOnListTitle: string = "";

  showDate: boolean = false;

  subType: string = 'customize';

  openModal: any = {
    open: false,
    task: new Todo(),
    modify: false
  };

  constructor(private modalService: ModalService) { }

  ngAfterViewInit() {
    
    let classes = document.getElementsByClassName('list-page');

    for (let c of Array.from(classes)) {
      console.log("size list page")

      console.log(c.clientHeight);
    }
    
    let doc = document.getElementsByClassName('content');

    for (let con of Array.from(doc)) {
      con.classList.add('start-effect');
    }
  }


  ngOnInit() {

    console.log(this.level)

    // this.onTypeChange();

    this.modalService.openModal$.subscribe(openModal => {

      console.log("sub open modal");
      if (openModal == this.level) {
        this.openModal.open = false;
      } 
    });
    this.modalService.subTask$.subscribe(subTask => {

      if (subTask.level == this.level && subTask.todo) {

        console.log("add sub task in level : " + this.level)

        this.subTodo.list!.push(subTask.todo);
        
        //this.newSubTodo = new Todo();

        console.log(this.subTodo);

        setTimeout(() => {
          console.log(this.subTodo.list);
          console.log("timeout");
          subTask.todo = null;
          
        } , 200);

      }
      //this.subTask = subTask;
      // Vous pouvez effectuer des opérations supplémentaires avec l'objet SubTask ici
    });

    this.setConfig();
  }

  setConfig(){
    this.configArray = [
      { key: 'description', value: this.subTodo.description ? true : false },
      { key: 'date', value: this.subTodo.date ? true : false },
      { key: 'time', value: this.subTodo.time ? true : false },
      { key: 'repetition', value: this.subTodo.repetition ? true : false },
      { key: 'sub tasks', value: this.subTodo.list?.length ? true : false },
    ];
  }

  // openModal() {
  //   this.modalService.setOpenModal(true);
  // }

  // getMaxHeight(){
  //   let classes = document.getElementsByClassName('content');

  //   let max = 0;

  //   for (let c of Array.from(classes)) {
  //     console.log("size list page")

  //     console.log(c.clientHeight);

  //     if(c.clientHeight > max){
  //       max = c.clientHeight;
  //     }
  //   }
  //   return max + 60 + 60;
  // }
  
  closeModal() {
    console.log("close modal" + this.level);

    this.modalService.setOpenModal(this.decrementLevel());
  }


  // showConfirm = async () => {
  //   const { value } = await Dialog.confirm({
  //     title: 'Confirm',
  //     message: `Are you sure to delete `+ this.subTodo.title +` ?`,
  //   });
  
  //   console.log('Confirmed:', value);

  //   if (value) {
  //     //this.deleteTodo();
  //   }
  // };



  addSubTask(){
    this.closeModal();
    this.modalService.setSubTask({level: this.decrementLevel(), todo: this.subTodo});
    this.subTodo = new Todo();
    // this.newSubTodo = new Todo();
  }


  incrementLevel(){
    const level = this.level;
    return level + 1;
  }

  decrementLevel(){
    const level = this.level;
    return level - 1;
  }


  findOnConfig(key: string): boolean {
    const configItem = this.configArray.find(item => item.key === key);
    
    return configItem ? configItem.value : false;
  }

  closeOnConfig(key: string) {
    const configItem = this.configArray.find(item => item.key === key);
    
    configItem!.value = false;
  }


  addOnList(){

    /*this.subTask.list.push({
      title: this.newTodoOnListTitle,
    });*/

    this.newTodoOnListTitle = '';
    // console.log(this.newTodo);
  }


  addTodoOnList(){

    let newTodoOnList = new Todo(this.newTodoOnListTitle, 'todo');

    this.subTodo.list?.push(newTodoOnList);

    this.newTodoOnListTitle = '';
    console.log(this.subTodo);
  }

  addTaskOnList(){
    console.log(this.openModal);
    this.openModal.task = new Todo();
    this.openModal.open = true;
    this.openModal.modify = false;
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete(this.subTodo.list);

    console.log(this.subTodo.list);
  }


  
  manageNotification(){

    console.log("click")

    console.log("manage notification")
    console.log(this.subTodo.reminder);
    // this.newTodo.sayHello();
    if (this.subTodo.reminder) {
      Todo.scheduleNotification(this.subTodo);
    }
    else{
      Todo.cancelNotification(this.subTodo);
    }
  }
}

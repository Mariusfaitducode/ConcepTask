import { Component, Input, OnInit } from '@angular/core';
import { ItemReorderEventDetail, ModalController, NavController } from '@ionic/angular';
import { set } from 'firebase/database';
import { Todo } from 'src/app/model/todo';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss'],
})
export class AddModalComponent  implements OnInit {

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

  configCustomizedArray: { key: string, value: boolean }[] = this.configArray;


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
  }

  // openModal() {
  //   this.modalService.setOpenModal(true);
  // }
  
  closeModal() {
    console.log("close modal" + this.level);

    this.modalService.setOpenModal(this.decrementLevel());
  }

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

  // onTypeChange(){

  //   switch (this.subTodo.type){
      
  //     case 'customize' :
  //       //this.config.customizedConfig();
  //       this.configArray = this.configCustomizedArray!;
  //       break;

  //     case 'todo' :
  //       this.configArray = [
  //         { key: 'description', value: false },
  //         { key: 'date', value: false },
  //         { key: 'time', value: false },
  //         { key: 'repetition', value: false },
  //         { key: 'sub tasks', value: false },
  //       ];
  //       break;

  //     case 'todo list':
  //       //this.config.todoListConfig();
  //       this.configArray = [
  //         { key: 'description', value: true },
  //         { key: 'date', value: true },
  //         { key: 'time', value: true },
  //         { key: 'repetition', value: false },
  //         { key: 'sub tasks', value: true },
  //       ];
  //       break;

  //     default:
  //       //Search in localStorage
  //       break;
  //   }
  // }


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

}

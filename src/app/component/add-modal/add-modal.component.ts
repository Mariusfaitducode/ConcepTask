import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { ItemReorderEventDetail, ModalController, NavController } from '@ionic/angular';
import { set } from 'firebase/database';
import { Todo } from 'src/app/model/todo';
import { ModalService } from 'src/app/service/modal.service';

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


  
  manageNotification(){

    console.log("click")

    console.log("manage notification")
    console.log(this.subTodo.reminder);
    // this.newTodo.sayHello();
    if (this.subTodo.reminder) {
      this.scheduleNotification();
    }
    else{
      this.cancelNotification();
    }
    
  }

  async scheduleNotification() {
    try {
      // Vérifier si les notifications sont disponibles
      const available = await LocalNotifications.requestPermissions();

      let notifId = JSON.parse(localStorage.getItem('notifId') || '[]');

      if (!notifId) {
        notifId = 1;
      }
      else{
        notifId++;
      }

      localStorage.setItem('notifId', JSON.stringify(notifId));
      
      if (available && this.subTodo.date! > new Date()) {


        if(this.subTodo.time){
          this.subTodo.date?.setHours(this.subTodo.time.getHours());
          this.subTodo.date?.setMinutes(this.subTodo.time.getMinutes());
        }
        else{
          this.subTodo.date?.setHours(0);
          this.subTodo.date?.setMinutes(0);
        }

        // Planifier la notification
        await LocalNotifications.schedule({
          notifications: [
            {
              title: 'Nouvelle tâche',
              body: `N'oubliez pas : ${this.subTodo.title}`,
              id: notifId, // Un identifiant unique pour la notification
              schedule: { at: this.subTodo.date }, // Date et heure de la notification
              //sound: null, // Chemin vers un fichier audio de notification (facultatif)
              //attachments: null, // Pièces jointes (facultatif)
              actionTypeId: '', // Identifiant d'action personnalisée (facultatif)
            },
          ],
        });
      }
    } catch (error) {
      console.error('Erreur lors de la planification de la notification', error);
    }
  }

  async cancelNotification() {
    try {
      console.log("remove notification");

      await LocalNotifications.cancel({ notifications: [{ id: this.subTodo.notifId! }] });
    } catch (error) {
      console.error('Erreur lors de l`annulation de la notification', error);
    }
  }
}

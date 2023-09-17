import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NavController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';

import { LocalNotifications } from '@capacitor/local-notifications';

import { ItemReorderEventDetail } from '@ionic/core';

import { Todo } from 'src/app/model/todo';

import { ModalService } from 'src/app/service/modal.service';
import { set } from 'firebase/database';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  todos = JSON.parse(localStorage.getItem('todos') || '[]');

  newTodo!: Todo;
  index?: number = undefined;

  //newSubTodo!: Todo;

  subType: string = 'customize';


  configArray: { key: string, value: boolean }[] = [
    { key: 'description', value: false },
    { key: 'date', value: false },
    { key: 'time', value: false },
    { key: 'repetition', value: false },
    { key: 'sub tasks', value: false },
    // { key: 'sub tasks', value: false },
  ];

  // configCustomizedArray: { key: string, value: boolean }[] = this.configArray;

  // todoList: any[] = [];

  newTodoOnListTitle: string = "";

  showDate: boolean = false;
  openModal: any = {
    open: false,
    task: new Todo(),
    modify: false
  };

  constructor(private navCtrl: NavController, private route : ActivatedRoute, private modalService: ModalService) 
  { }

  ngOnInit() {


    this.route.params.subscribe((params) => {

      if (params['id'] != undefined) {
        
        this.index = +params['id'];

        this.loadTodo(this.index);
      }
      else{
        this.newTodo = new Todo();
      }
      this.setConfig();

      
    });

    //Trouver id du Todo
    //this.newTodo = new Todo();
    //this.newSubTodo = new Todo();

    this.modalService.openModal$.subscribe(openModal => {
      console.log("main open modal");
      if (openModal == 0) {
        console.log("close modal 0");
        this.openModal.open = false;
      } else {
        this.openModal.open = true;
      }
    });
    this.modalService.subTask$.subscribe(subTask => {

      if (subTask.level == 0 && subTask.todo) {

        console.log("subtask level 0");
        this.newTodo.list!.push(subTask.todo);
        //this.newSubTodo = new Todo();

        setTimeout(() => {
          
          console.log("timeout");
          subTask.todo = null;
          
        } , 200);
      }
      console.log(this.newTodo);
      //this.subTask = subTask;
      // Vous pouvez effectuer des opérations supplémentaires avec l'objet SubTask ici
    });
  }

  loadTodo(id : number){
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    console.log(this.todos)
    this.newTodo = this.todos[id]
    // this.mainTodo = this.todos[id] 
  }

  setConfig(){
    this.configArray = [
      { key: 'description', value: this.newTodo.description ? true : false },
      { key: 'date', value: this.newTodo.date ? true : false },
      { key: 'time', value: this.newTodo.time ? true : false },
      { key: 'repetition', value: this.newTodo.repetition ? true : false },
      { key: 'sub tasks', value: this.newTodo.list?.length ? true : false },
    ];

  }

  saveTodo(){
    console.log(this.newTodo);

    this.assignIds(this.newTodo.list!);


    if (this.index != undefined) {
      this.todos[this.index] = this.newTodo;

      localStorage.setItem('todos', JSON.stringify(this.todos));
      this.newTodo = new Todo();
      //this.newSubTodo = new Todo();

      this.navCtrl.navigateForward('/todo/' + this.index);
    }
    else{
      this.todos.push(this.newTodo);

      localStorage.setItem('todos', JSON.stringify(this.todos));
      this.newTodo = new Todo();
      //this.newSubTodo = new Todo();

      this.navCtrl.navigateForward('/home');
    }
    //this.todos.push(this.newTodo);

    
  }

    // Fonction pour parcourir l'arbre et attribuer des IDs
    // Not working
  assignIds(list : Todo[]): void {

    let copyList = [...list];

    let queue = [{ list: copyList, parentId: 0 }];

    let id = 1;

    for (let i = 0; i < queue.length; i++) {
      while (queue[i].list.length > 0) {

        let todo = queue[i].list.shift()!;

        todo.subId = id++;
        todo.parentId = queue[i].parentId;

        if (todo.list) {
          queue.push({ list: [...todo.list], parentId: todo.subId });
        }
      }
    }
  }


  findOnConfig(key: string): boolean {
    const configItem = this.configArray.find(item => item.key === key);
    
    return configItem ? configItem.value : false;
  }

  closeOnConfig(key: string) {
    const configItem = this.configArray.find(item => item.key === key);
    
    configItem!.value = false;
  }

  getId(){
    return this.todos.length + 1;
  }


  findTodoById(id: number): Todo {
    return this.todos.find((todo: { id: number; }) => todo.id === id)!;
  }



  addTodoOnList(){

    let newTodoOnList = new Todo(this.newTodoOnListTitle, 'todo');

    this.newTodo.list?.push(newTodoOnList);

    this.newTodoOnListTitle = '';
    console.log(this.newTodo);
  }


  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    //ev.detail.complete(this.newTodo.list);

    //console.log(this.newTodo.list);
  }


  addTaskOnList(){
    //console.log(this.openModal);
    this.openModal.task = new Todo();
    this.openModal.open = true;
    this.openModal.modify = false;
    console.log(this.openModal);
  }


  modifyTaskOnList(subTask : any){
    this.openModal.task = subTask;
    this.openModal.open = true;
    this.openModal.modify = true;
  }


  manageNotification(){

    console.log("click")

    console.log("manage notification")
    console.log(this.newTodo.reminder);
    // this.newTodo.sayHello();
    if (this.newTodo.reminder) {
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
      
      if (available && this.newTodo.date! > new Date()) {


        if(this.newTodo.time){
          this.newTodo.date?.setHours(this.newTodo.time.getHours());
          this.newTodo.date?.setMinutes(this.newTodo.time.getMinutes());
        }
        else{
          this.newTodo.date?.setHours(0);
          this.newTodo.date?.setMinutes(0);
        }

        // Planifier la notification
        await LocalNotifications.schedule({
          notifications: [
            {
              title: 'Nouvelle tâche',
              body: `N'oubliez pas : ${this.newTodo.title}`,
              id: notifId, // Un identifiant unique pour la notification
              schedule: { at: this.newTodo.date }, // Date et heure de la notification
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

      await LocalNotifications.cancel({ notifications: [{ id: this.newTodo.notifId! }] });
    } catch (error) {
      console.error('Erreur lors de l`annulation de la notification', error);
    }
  }
}

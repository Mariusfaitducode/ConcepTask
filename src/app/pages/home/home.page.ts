import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

import { ItemReorderEventDetail, MenuController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { Todo } from '../../models/todo';

import { TranslateService } from '@ngx-translate/core';
import { Settings } from 'src/app/models/settings';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { TaskService } from 'src/app/services/task/task.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  constructor(
    private translate: TranslateService,
    private route : ActivatedRoute,
    private taskService : TaskService,
    private userService : UserService,
    private settingsService : SettingsService
  )
  {}

  userSubscription! : Subscription;
  user : User | null = null;

  todoSubscription! : Subscription;
  todos : Todo[] = []
  results : Todo[] = []

  darkMode : boolean = false; // Used for ConcepTask logo version


  ngOnInit() {

    this.taskService.getTodos().subscribe((todos: Todo[]) => {

      if (this.todos.length != 0 && JSON.stringify(this.todos) == JSON.stringify(todos)) return;

      console.log('Todos loaded in home page:', todos)
      this.todos = todos;

      this.results = [...this.todos].sort((a, b) => a.index - b.index);
    });

    this.userService.getUser().subscribe((user : User | null) => {
      console.log('Home page : User get', user)
      this.user = user;
    });

    // Actualise la page à chaque changement
    this.route.queryParams.subscribe(params =>{

      this.settingsService.initPage(this.translate);
      this.darkMode = this.settingsService.settings.darkMode;
    
    });
  }

  ngOnDestroy(){

    console.log("HOME PAGE ON DESTROY")

    if (this.userSubscription){
      this.userSubscription.unsubscribe();
    }
    if (this.todoSubscription){
      this.todoSubscription.unsubscribe();
    }
  }


  // Drag and drop reorder
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {

    // ev.preventDefault()
    ev.stopPropagation();

    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    ev.detail.complete(this.results);
    // console.log();

    

    for (let i = 0; i < this.results.length; i++) {

      console.log(this.results[i].index, i)

      if (this.results[i].index != i){
        this.results[i].index = i;
        this.taskService.updateTodo(this.results[i]);
      }
    }

    this.todos = [...this.results];
    // this.taskService.actualizeTodos(this.todos, this.user);
  }


  // SearchBar
  handleInput(event : any) {
    const query = event.target.value.toLowerCase();
    this.results = [...this.results.filter((d) => d.title.toLowerCase().indexOf(query) > -1 || d.category.name.toLowerCase().indexOf(query) > -1)];

    if (query == '') {
      this.results = [...this.todos];
    }
  }
}

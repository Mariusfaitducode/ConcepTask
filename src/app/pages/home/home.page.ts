import { Component, Inject, PLATFORM_ID } from '@angular/core';

import { ItemReorderEventDetail, MenuController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { Todo } from '../../models/todo';

import { TranslateService } from '@ngx-translate/core';
import { Settings } from 'src/app/models/settings';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { SyncService } from 'src/app/services/sync.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private translate: TranslateService,
    private route : ActivatedRoute,
    private syncService : SyncService,
    private userService : UserService,
  )
  {}

  user : User | null = null;

  todos : Todo[] = []
  results : Todo[] = []

  darkMode : boolean = false;

  // filters = {
  //   today: false,
  //   week: false,
  //   month: false,
  //   overdue: false,
  //   done: false,
  //   priority: false,
  //   priorityChoosed: '',
  //   category: false,
  //   categoryChoosed: '',
  // };
  

  ngOnInit() {

    this.syncService.getTodos().subscribe((todos: Todo[]) => {

      console.log('Todos loaded in home page:', todos)
      this.todos = todos;
      this.results = [...this.todos];
    });

    this.userService.getUser().subscribe((user : User | null) => {
      console.log('Home page : User get', user)
      this.user = user;
    });

    

    // Actualise la page à chaque changement
    this.route.queryParams.subscribe(params =>{

      let settings = new Settings();
      settings.initPage(this.translate);

      this.darkMode = settings.darkMode;

      // this.todos = this.taskService.loadTodos();
      
    });
  }


  // Drag and drop reorder
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {

    // TODO : fix drop event

    // console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    // ev.detail.complete(this.results);
    // console.log();
    // ev.stopPropagation();

    // this.todos = [...this.results];
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

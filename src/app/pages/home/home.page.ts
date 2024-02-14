import { Component, Inject, PLATFORM_ID } from '@angular/core';

import { ItemReorderEventDetail, MenuController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { Todo } from '../../models/todo';

import { TranslateService } from '@ngx-translate/core';
import { Settings } from 'src/app/models/settings';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private translate: TranslateService,
    private route : ActivatedRoute,
    private taskService : TaskService,
  )
  {}

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
    // Actualise la page à chaque changement
    this.route.queryParams.subscribe(params =>{

      let settings = new Settings();
      settings.initPage(this.translate);

      this.darkMode = settings.darkMode;

      this.todos = this.taskService.loadTodos();
      this.results = [...this.todos];
    });
  }


  // Drag and drop reorder
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {

    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    ev.detail.complete(this.results);
    console.log();
    ev.stopPropagation();

    this.todos = [...this.results];
    this.taskService.setTodos(this.todos);
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
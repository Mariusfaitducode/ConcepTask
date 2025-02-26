import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

import { ItemReorderEventDetail, MenuController } from '@ionic/angular';

import { ActivatedRoute, Router } from '@angular/router';
// import { Todo } from '../../models/todo';

import { TranslateService } from '@ngx-translate/core';
import { Settings } from 'src/app/models/settings';
import { UserService } from 'src/app/services/user/user.service';
import { User, UserSimplified } from 'src/app/models/user';
import { TaskService } from 'src/app/services/task/task.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { Subscribable, Subscription } from 'rxjs';
import { TeamService } from 'src/app/services/team/team.service';
import { Team } from 'src/app/models/team';
import { MainTodo } from 'src/app/models/todo/main-todo';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  constructor(
    private translate: TranslateService,
    private route : ActivatedRoute,
    private router : Router,
    private taskService : TaskService,
    private userService : UserService,
    private settingsService : SettingsService,
    private teamService : TeamService
  )
  {}

  userSubscription! : Subscription;
  user : User | null = null;

  todoSubscription! : Subscription;
  todos :MainTodo[] = []
  results : MainTodo[] = []

  darkMode : boolean = false; // Used for ConcepTask logo version


  space : string = 'profile';



  ngOnInit() {

    this.taskService.getTodos().subscribe((todos: MainTodo[]) => {

      if (this.todos.length != 0 && JSON.stringify(this.todos) == JSON.stringify(todos)) return;

      console.log('Todos loaded in home page:', todos)
      this.todos = todos;

      // On filtre les todos en fonction de l'espace sélectionné
      this.results = [...this.todos].filter((todo: MainTodo) => {
        
        if (this.space == 'profile'){
          return !todo.onTeamSpace;
        }
        else{
          return todo.onTeamSpace && todo.spaceId == this.space;
        }
      });

      this.results = [...this.results].sort((a, b) => a.index - b.index);


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



  importData(){}

  exportData(){}


  // Drag and drop reorder
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {

    // ev.preventDefault()
    ev.stopPropagation();

    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    ev.detail.complete(this.results);
    

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
    this.results = [...this.results.filter((d) => d.properties.title.toLowerCase().indexOf(query) > -1 || d.properties.category.name.toLowerCase().indexOf(query) > -1)];

    if (query == '') {
      this.results = [...this.todos];
    }
  }


  // Spaces

  selectTeamSpace(teamId : string){
    console.log('Select team space', teamId)

    this.space = teamId;

    this.results = [...this.todos].filter((todo: MainTodo) => todo.onTeamSpace && todo.spaceId == teamId);
  }

  selectProfileSpace(){
    console.log('Select profile space')

    this.space = 'profile';
    this.results = [...this.todos].filter((todo: MainTodo) => !todo.onTeamSpace);
  }


  createTodo(){
    console.log('Create todo')

    if (this.space == 'profile'){
      this.router.navigate(['/todo']);
    }
    else{
      this.router.navigate(['/todo', {teamId: this.space}]);
    }
  }
}

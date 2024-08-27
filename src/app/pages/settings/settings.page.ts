import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dialog } from '@capacitor/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Category } from 'src/app/models/category';
import { Settings } from 'src/app/models/settings';
import { Todo } from 'src/app/models/todo';
import { User } from 'src/app/models/user';
import { WelcomeTodo } from 'src/app/models/welcome-todo';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { TaskService } from 'src/app/services/task/task.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private route : ActivatedRoute, 
    private translate: TranslateService,
    private userService : UserService,
    private taskService : TaskService,
    private settingsService : SettingsService
  ) 
    {
  }

  user : User | null = null;

  settings : Settings = new Settings();

  todos : Todo[] = []

  darkMode : boolean = this.settings.darkMode;
  themeColor : string = '#3880ff';

  newCategory : Category = new Category();

  ngOnInit() {

    this.userService.getUser().subscribe((user : User | null) => {
      console.log('Settings page :User get', user)
      this.user = user;
    });

    this.taskService.getTodos().subscribe((todos: Todo[]) => {
      console.log('Todos loaded in settings:', todos)
      this.todos = todos;
    });

    this.route.queryParams.subscribe(params =>{
      this.settingsService.initPage(this.translate);
    });

  }


  showConfirmDelete(category : Category) {
    Dialog.confirm({
      title: 'Delete category',
      message: `${this.translate.instant('DELETE MESSAGE')} ${category.name} category ?`,
      okButtonTitle: 'Delete',
      cancelButtonTitle: 'Cancel',
    }).then((result) => {
      if (result.value) {
        this.removeCategory(category);
      }
    });
  }


  removeCategory(category : Category){
    this.settings.categories = this.settings.categories.filter((c) => c.id !== category.id);
    this.settingsService.updateSettings(this.user, this.settings);
  }


  addCategory(){

    if (!this.newCategory.name) return;
    this.settings.categories.push({
      id: this.settings.categories.length,
      name: this.newCategory.name,
      color: this.newCategory.color,
    });

    this.newCategory = new Category();
    this.settingsService.updateSettings(this.user, this.settings);
  }


  onColorChange(event: Event, category : Category) {
    const colorInput = event.target as HTMLInputElement;
    const selectedColor = colorInput.value;
    category.color = selectedColor;

    this.updateColorCategory(category);

    this.settingsService.updateSettings(this.user, this.settings);
  }


  updateColorCategory(cat : Category){
    // let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    this.todos.forEach((todo : Todo) => {
      if (todo.category.name == cat.name){
        todo.category.color = cat.color;
        this.taskService.updateTodo(todo);
      }
    });
  }


  toggleDarkMode() {

    if (this.darkMode) {
      document.body.setAttribute('color-theme', 'dark');      
    }
    else{
      document.body.setAttribute('color-theme', 'light');
    }
    this.settings.darkMode = this.darkMode;
    this.settingsService.updateSettings(this.user, this.settings);
  }


  onThemeColorChange(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    const selectedColor = colorInput.value;
    this.themeColor = selectedColor;

    this.settings.themeColor = this.themeColor;

    this.settingsService.updateSettings(this.user, this.settings);

    this.applyTheme(this.themeColor)
  }


  applyTheme(color: string) {

    console.log("applyTheme", color)

    // Appliquer la couleur comme thème en modifiant les variables CSS
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --ion-color-primary: ${color};
        --ion-color-primary-contrast: #ffffff;
        --ion-color-primary-shade: mix(black, var(--ion-color-primary), 15%);
        --ion-color-primary-tint: mix(white, var(--ion-color-primary), 15%);
      }
    `;
    document.head.appendChild(style);
  }


  onLanguageChange() {
    this.translate.use(this.settings.language); 

    for (let todo of this.todos){  // TODO : find a better way to do this
      if (todo.welcomeTodo === true){

        console.log("found welcome todo", todo)
        // this.todos.splice(this.todos.indexOf(todo), 1);

        if (this.settings.language === 'en'){
          todo = WelcomeTodo.getWelcomeTodo() as Todo;
        }
        else{
          todo = WelcomeTodo.getWelcomeTodoFr() as Todo;
        }

        this.taskService.updateTodo(todo);

        // this.todos.push(todo);
        break;
      }
    }
    
    this.settingsService.updateSettings(this.user, this.settings);
  }
}

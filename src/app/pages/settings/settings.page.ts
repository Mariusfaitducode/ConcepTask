import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog } from '@capacitor/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Settings } from 'src/app/models/settings';
// import { Todo } from 'src/app/models/todo';
import { User } from 'src/app/models/user';
import { WelcomeTodo } from 'src/app/models/welcome-todo';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { TaskService } from 'src/app/services/task/task.service';
import { UserService } from 'src/app/services/user/user.service';

import { MainTodo } from 'src/app/models/todo/main-todo';
import { SubTodo } from 'src/app/models/todo/sub-todo';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  constructor(
    private router : Router,
    private route : ActivatedRoute, 
    private translate: TranslateService,
    private userService : UserService,
    private taskService : TaskService,
    private settingsService : SettingsService
  ) 
    {
  }

  @ViewChild('pageContent') pageElement!: ElementRef;

  userSubscription! : Subscription;
  user : User | null = null;

  // Get settings from local storage in the constructor
  settings : Settings = new Settings();

  todoSubscription! : Subscription;
  todos : MainTodo[] = []

  // darkMode : boolean = this.settings.darkMode;
  // themeColor : string = '#3880ff';

  newCategory : Category = new Category();


  // colorChanged : boolean = false;
  categoryChanged : boolean = false;

  // TODO : réfléchir si on garde le changement de thème 

  ngOnInit() {

    this.userService.getUser().subscribe((user : User | null) => {
      console.log('Settings page :User get', user)
      this.user = user;
    });

    this.taskService.getTodos().subscribe((todos: MainTodo[]) => {
      console.log('Todos loaded in settings:', todos)
      this.todos = todos;
    });

    this.route.queryParams.subscribe(params =>{

      this.settings = new Settings();

      this.settingsService.initPage(this.translate);
    });

  }


  ngOnDestroy(){

    console.log("SETTINGS PAGE ON DESTROY")

    if (this.userSubscription){
      this.userSubscription.unsubscribe();
    }
    if (this.todoSubscription){
      this.todoSubscription.unsubscribe();
    }
  }



  saveNewSettings(){
    // this.settings = new Settings();

    if (this.categoryChanged){
      // this.updateColorCategory(this.categoryChanged);

      let initialCategories = JSON.parse(localStorage.getItem('settings') || '{}').categories


      for (let cat of this.settings.categories){

        let initialCat = initialCategories.find((c: Category) => c.id === cat.id);

        if (initialCat && initialCat.color !== cat.color){
          this.updateColorCategory(cat);
        }
      }
    }

    this.settingsService.updateSettings(this.user, this.settings);

    this.router.navigate(['/profile']);

  }

  // Vérifier si les paramètres sont synchronisés avec le local storage
  // Sinon cela signifie que les paramètres ont été modifiés et qu'on peut les mettre à jour
  areSettingsSynchronized(){
    return this.settings && JSON.stringify(this.settings) == JSON.stringify(JSON.parse(localStorage.getItem('settings') || '{}'));
  }


  // Suppression d'une catégorie
  // On envoie un message de confirmation avant de supprimer
  // TODO : vérifier les conséquences sur les todos
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

  // Suppression d'une catégorie dans les paramètres
  removeCategory(category : Category){
    this.settings.categories = this.settings.categories.filter((c) => c.id !== category.id);
    // this.settingsService.updateSettings(this.user, this.settings);
  }

  // Ajout d'une catégorie dans les paramètres
  addCategory(){

    if (!this.newCategory.name) return;
    this.settings.categories.push({
      id: this.settings.categories.length,
      name: this.newCategory.name,
      color: this.newCategory.color,
    });

    this.newCategory = new Category();
    // this.settingsService.updateSettings(this.user, this.settings);
  }


  // Changement de la couleur d'une catégorie à partir de l'interface
  onColorChange(event: Event, category : Category) {
    const colorInput = event.target as HTMLInputElement;
    const selectedColor = colorInput.value;
    category.color = selectedColor;

    // this.updateColorCategory(category);

    this.categoryChanged = true;

    // this.settingsService.updateSettings(this.user, this.settings);
  }


  // Mise à jour de la couleur d'une catégorie dans tous les todos ayant cette catégorie
  // TODO : incomplet car ne pas à jour les sous todos
  updateColorCategory(cat : Category){
    // let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    this.todos.forEach((todo : MainTodo) => {
      if (todo.properties.category.name == cat.name){
        todo.properties.category.color = cat.color;
        this.taskService.updateTodo(todo);
      }
    });
  }


  // Activation ou désactivation du mode sombre
  toggleDarkMode() {

    // N'a pas de répercussion sur les autres pages car le thème de celles-ci est réinitialisé avec initPage
    if (this.settings.darkMode) {
      document.body.setAttribute('color-theme', 'dark');      
    }
    else{
      document.body.setAttribute('color-theme', 'light');
    }
    // this.settings.darkMode = this.darkMode;
    // this.settingsService.updateSettings(this.user, this.settings);
  }


  onThemeColorChange(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    const selectedColor = colorInput.value;
    

    this.settings.themeColor = selectedColor;

    // this.settingsService.updateSettings(this.user, this.settings);

    // this.applyTheme(this.themeColor)
  }


  applyTheme(color: string) {
    console.log("applyTheme", color);

    // // Apply the color theme only to this page
    // // const pageElement = this.elRef.nativeElement;
    // this.pageElement.nativeElement.style.setProperty('--ion-color-primary', color);
    // this.pageElement.nativeElement.style.setProperty('--ion-color-primary-contrast', '#ffffff');
    // // pageElement.style.setProperty('--ion-color-primary-shade: mix(black, var(--ion-color-primary), 15%)');
    // // pageElement.style.setProperty('--ion-color-primary-tint', this.tintColor(color, 15));
  
  
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

    // TODO : find a way to translate the welcome todo ?

    // for (let todo of this.todos){  
    //   if (todo.welcomeTodo === true){

    //     console.log("found welcome todo", todo)
    //     // this.todos.splice(this.todos.indexOf(todo), 1);

    //     // if (this.settings.language === 'en'){
    //     //   todo = WelcomeTodo.getWelcomeTodo() as Todo;
    //     // }
    //     // else{
    //     //   todo = WelcomeTodo.getWelcomeTodoFr() as Todo;
    //     // }

    //     this.taskService.updateTodo(todo);

    //     // this.todos.push(todo);
    //     break;
    //   }
    // }
    
    // this.settingsService.updateSettings(this.user, this.settings);
  }
}

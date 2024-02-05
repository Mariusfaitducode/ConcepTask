import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Dialog } from '@capacitor/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Category } from 'src/app/models/category';
import { Settings } from 'src/app/models/settings';
import { Todo } from 'src/app/models/todo';
import { WelcomeTodo } from 'src/app/models/welcome-todo';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private translate: TranslateService) {
    this.settings = new Settings();
    this.settings.initPage(translate);
  }

  settings : Settings = new Settings();
  darkMode : boolean = false;
  themeColor : string = this.settings.themeColor || '#3880ff';

  categories : Category[] = [];

  newCategory : Category = new Category();

  ngOnInit() {

    this.categories = JSON.parse(localStorage.getItem('categories') || '[]');
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
    this.categories = this.categories.filter((c) => c.id !== category.id);
    this.saveCategory();
  }


  addCategory(){

    if (!this.newCategory.name) return;
    this.categories.push({
      id: this.categories.length,
      name: this.newCategory.name,
      color: this.newCategory.color,
    });

    this.newCategory = new Category();
    this.saveCategory();
  }


  onColorChange(event: Event, category : Category) {
    const colorInput = event.target as HTMLInputElement;
    const selectedColor = colorInput.value;
    category.color = selectedColor;

    this.updateColorCategory(category);

    this.saveCategory();
  }


  updateColorCategory(cat : Category){
    let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    todos.forEach((todo : Todo) => {
      if (todo.category.name == cat.name){
        todo.category.color = cat.color;
      }
    });

    localStorage.setItem('todos', JSON.stringify(todos));
  }


  saveCategory(){
    console.log(this.categories);
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }


  toggleDarkMode() {

    if (this.darkMode) {
      document.body.setAttribute('color-theme', 'dark');      
    }
    else{
      document.body.setAttribute('color-theme', 'light');
    }
    this.settings.darkMode = this.darkMode;
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }


  onThemeColorChange(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    const selectedColor = colorInput.value;
    this.themeColor = selectedColor;

    this.settings.themeColor = this.themeColor;
    localStorage.setItem('settings', JSON.stringify(this.settings));

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
    localStorage.setItem('settings', JSON.stringify(this.settings));
    this.translate.use(this.settings.language); 

    let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    for (let todo of todos){
      if (todo.welcomeTodo === true){

        console.log("found welcome todo", todo)
        todos.splice(todos.indexOf(todo), 1);

        if (this.settings.language === 'en'){
          todo = WelcomeTodo.getWelcomeTodo();
        }
        else{
          todo = WelcomeTodo.getWelcomeTodoFr();
        }

        todos.push(todo);
        break;
      }
    }
    console.log("todos", todos)
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}

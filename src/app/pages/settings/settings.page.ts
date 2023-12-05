import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Dialog } from '@capacitor/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private translate: TranslateService) {
      // let settings = JSON.parse(localStorage.getItem('settings') || '{}');

      this.darkMode = this.settings.darkMode;
      this.translate.use(this.settings.language); 
    }

  settings = JSON.parse(localStorage.getItem('settings') || '{}');
  darkMode : boolean = false;
  themeColor : string = this.settings.themeColor || '#3880ff';

  categories : any[] = [];

  newCategory : any = {};

  ngOnInit() {

    this.categories = JSON.parse(localStorage.getItem('categories') || '[]');
    
  }


  showConfirmDelete(cat : any) {
    Dialog.confirm({
      title: 'Delete category',
      message: `Are you sure you want to delete ${cat.name} category ?`,
      okButtonTitle: 'Delete',
      cancelButtonTitle: 'Cancel',
    }).then((result) => {
      if (result.value) {
        this.removeCategory(cat);
      }
    });
  }


  removeCategory(cat : any){
    this.categories = this.categories.filter((c) => c.id !== cat.id);
    this.saveCategory();
  }


  addCategory(){

    if (!this.newCategory.name) return;
    this.categories.push({
      id: this.categories.length,
      name: this.newCategory.name,
      color: this.newCategory.color,
    });

    this.newCategory = {};
    this.saveCategory();
  }


  onColorChange(event: Event, cat : any) {
    const colorInput = event.target as HTMLInputElement;
    const selectedColor = colorInput.value;
    cat.color = selectedColor;

    this.updateColorCategory(cat);

    this.saveCategory();
  }


  updateColorCategory(cat : any){
    let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    todos.forEach((todo : any) => {
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
}

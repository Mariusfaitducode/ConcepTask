

## Stockage code intéressant


### FROM TODO PAGE

// Réinitialisation config todo en cas de besoin

setConfig(){
console.log("set config")
let configArray = {
    description: this.todo.description ? true : false ,
    priority: this.todo.priority ? true : false,
    date: this.todo.date ? true : false ,
    repeat: this.todo.repeat ? true : false ,
    // { key: 'note', value: false },
    subtasks: this.todo.list?.length ? true : false ,
};

this.todo.config = configArray;
}

Export todo

async exportTodo(){
console.log("export")
// console.log(this.todo)
// let todo = Todo.transformTodoInListByDepth(this.todo);
// console.log(todo)
let todoString = JSON.stringify(this.todo);
console.log(todoString)

const blob = new Blob([todoString], { type: 'text/plain' });

const a = document.createElement('a');
a.href = window.URL.createObjectURL(blob);
a.download = this.todo.title + '.json';
// document.body.appendChild(a);
a.click();

// document.body.removeChild(a);


//   const downloadPath = (
//     this.platform.is('android')
//  ) ? this.file.externalDataDirectory : this.file.documentsDirectory;


//  let vm = this;

//  /** HttpClient - @angular/common/http */
//  this.http.get(
//     uri, 
//     {
//        responseType: 'blob', 
//        headers: {
//           'Authorization': 'Bearer ' + yourTokenIfYouNeed,
//        }
//     }
//  ).subscribe((fileBlob: Blob) => {
//     /** File - @ionic-native/file/ngx */
//     vm.file.writeFile(downloadPath, "YourFileName.pdf", fileBlob, {replace: true});
//  });

}



### ADD PAGE


 // SET TODO -> TODO CLASS

Remplacer par unique id avec database

setMainTodoId(){
  let todoId = JSON.parse(localStorage.getItem('mainTodoId') || '0');

  if (this.newTodo.mainId) {
    this.newTodo.main = true;
  }
  else{
       this.newTodo.main = true;
       this.newTodo.mainId = todoId++;
  }
  localStorage.setItem('mainTodoId', JSON.stringify(todoId));
}



### SETTINGS PAGE


 // Categories colors
    //  let categories = JSON.parse(localStorage.getItem('categories') || '[]');

    //  if (categories.length === 0){ // If no categories, set initial categories
    //    categories = [
    //      {
    //        id: 0,
    //        name: 'Task',
    //        color: '#e83c53',
    //      },
    //      {
    //        id: 1,
    //        name: 'Project',
    //        color: '#428cff',
    //      },
    //      {
    //        id: 2,
    //        name: 'Work',
    //        color: '#ffd948',
    //      },
    //      {
    //        id: 3,
    //        name: 'Personal',
    //        color: '#29c467',
    //      },
    //      {
    //        id: 4,
    //        name: 'Event',
    //        color: '#5d58e0',
    //      },
    //    ];
    //    localStorage.setItem('categories', JSON.stringify(categories));
    //  }
 
     let settings = JSON.parse(localStorage.getItem('settings') || '{}');
 
    //  console.log(settings)
 
 
     // Welcome Todo
 
     // if (!settings.firstVisiteDone) {
 
     //   let todos = JSON.parse(localStorage.getItem('todos') || '[]');
     //   let firstTodo = WelcomeTodo.getWelcomeTodo();
     //   todos.push(firstTodo);
     //   localStorage.setItem('todos', JSON.stringify(todos));
 
     //   settings.firstVisiteDone = true;
     // }
 
    //  if (!settings.language) {  // If no language, set default language to english
    //    settings.language = 'en';
    //  }
 
     // Settings language
 
     this.translate.setDefaultLang(settings.language);
     this.translate.use(settings.language); 
 
 
     // Initial theme color
 
    //  if (settings.darkMode === undefined) {
    //    console.log("no settings")
       
    //      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    //      if (prefersDark.matches) {
    //        console.log("DARK MODE")
    //        document.body.setAttribute('color-theme', 'dark');
    //        settings.darkMode = true;
    //      }
    //      else{
    //        console.log("LIGHT MODE")
    //        document.body.setAttribute('color-theme', 'light');
    //        settings.darkMode = false;
    //      }
    //  }
 
     // Theme color settings
 
     if (settings.darkMode) {
       document.body.setAttribute('color-theme', 'dark');
     }
     else{
       console.log("LIGHT MODE SET")
       document.body.setAttribute('color-theme', 'light');
     }
 
     if (settings.themeColor){
       const style = document.createElement('style');
       style.innerHTML = `
         :root {
           --ion-color-primary: ${settings.themeColor};
           --ion-color-primary-contrast: #ffffff;
           --ion-color-primary-shade: mix(black, var(--ion-color-primary), 15%);
           --ion-color-primary-tint: mix(white, var(--ion-color-primary), 15%);
         }
       `;
       document.head.appendChild(style);
     }
 
 
     // Save settings
 
     localStorage.setItem('settings', JSON.stringify(settings));
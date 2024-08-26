

## Stockage code intéressant


FROM TODO PAGE

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
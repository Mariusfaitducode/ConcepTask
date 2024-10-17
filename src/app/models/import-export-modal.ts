import { MainTodo } from "./todo/main-todo";


export class ImportExportModal{

    
    public open: boolean = false;
    public type: 'import' | 'export' = 'export';

    // export   
    public todos: MainTodo[] = [];

    // import
    public importTask: MainTodo | null = null;


    openImportModal(todos: MainTodo[]){
        this.open = true;
        this.type = 'import';
        this.todos = todos;
    }

    openExportModal(todos: MainTodo[]){
        this.open = true;
        this.type = 'export';
        this.todos = todos;
    }
      
}
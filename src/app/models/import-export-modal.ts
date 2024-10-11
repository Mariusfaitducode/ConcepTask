import { Todo } from "./todo";


export class ImportExportModal{

    
    public open: boolean = false;
    public type: 'import' | 'export' = 'export';

    // export   
    public todos: Todo[] = [];

    // import
    public importTask: Todo | null = null;


    openImportModal(todos: Todo[]){
        this.open = true;
        this.type = 'import';
        this.todos = todos;
    }

    openExportModal(todos: Todo[]){
        this.open = true;
        this.type = 'export';
        this.todos = todos;
    }
      
}
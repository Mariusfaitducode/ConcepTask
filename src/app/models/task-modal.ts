import { Todo } from "./todo";


export class TaskModal{

    
    public open: boolean = false;
    public modify: boolean = false;

    public task: Todo | null = null;
    public parentTask: Todo | null = null;


    openModifyTaskModal(subTask : Todo, parentTask : Todo | null){
        this.open = true;
        this.modify = true;

        this.task = subTask;
        this.parentTask = parentTask;
    }

    openNewTaskModal(parentTask : Todo, todoListLength: number){
        this.open = true;
        this.modify = false;

        this.task = new Todo(todoListLength);
        this.parentTask = parentTask;
    }
      
}
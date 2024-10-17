// import { Todo } from "./todo";

import { MainTodo } from "./todo/main-todo";
import { SubTodo } from "./todo/sub-todo";


export class TaskModal{

    
    public open: boolean = false;
    public modify: boolean = false;

    public task: MainTodo | SubTodo | null = null;
    public parentTask: MainTodo | SubTodo | null = null;


    openModifyTaskModal(subTask : SubTodo, parentTask : MainTodo | SubTodo | null){
        this.open = true;
        this.modify = true;

        this.task = subTask;
        this.parentTask = parentTask;
    }

    openNewTaskModal(parentTask : MainTodo | SubTodo){
        this.open = true;
        this.modify = false;

        this.task = new SubTodo();
        this.parentTask = parentTask;
    }
      
}
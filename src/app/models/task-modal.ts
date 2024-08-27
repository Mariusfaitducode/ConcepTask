import { Todo } from "./todo";


export class TaskModal{

    
    public open: boolean = false;
    public modify: boolean = false;
    public index?: number;

    public task: Todo | null = null;
    public parentTask: Todo | null = null;
      
}
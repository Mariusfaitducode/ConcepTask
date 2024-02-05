import { Todo } from "./todo";


export class TaskModal{

    
    public open: boolean = false;
    public modify: boolean = false;
    public index?: number;

    public task: Todo | null = new Todo();
    public parentTask: Todo | null = new Todo();
      
}
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Todo } from "./todo";
import { Dialog } from "@capacitor/dialog";

export class DragAndDrop {


    public static async drop(event: CdkDragDrop<any[]>, mainTodo: Todo) {

        console.log("Element dropped")
        // console.log(event)
    
        // console.log(event.item.data.title)
        // console.log(event.previousContainer.data);
        console.log(event.container.id > event.previousContainer.id);

        let newIndex = 0;

        if (event.container.id > event.previousContainer.id){
            newIndex = event.currentIndex == 0 ? 0 : event.currentIndex - 1; 
        }
        else{
            newIndex = event.currentIndex;
        }

        if (event.container.data[newIndex] === undefined ) return;

        let item : Todo = event.item.data;
        let parentTodo = event.container.data[newIndex].todo;
    
        console.log("parent todo")
        // console.log(parentTodo.title)

        if (!parentTodo) return;

        if (parentTodo.subId == item.subId) return;

        if (parentTodo.subId == item.parentId) return;


        if (Todo.findSubTodoById(item, parentTodo.subId!)) return;
        
        await this.moveItem(item, parentTodo, mainTodo);
        
        console.log(event.container.data)
      }


      public static async moveItem(item : any, parentTodo : any, mainTodo : any){

        console.log("move item")

        const { value } = await Dialog.confirm({
            title: 'Confirm',
            message: `Are you sure to move `+ item.title +` into `+ parentTodo.title +` ?`,
          });
        
          console.log('Confirmed:', value);
      
          if (value) {

            if (parentTodo.config.subtasks !== "true"){
                parentTodo.config.subtasks = true;
            }

            Todo.deleteTodoById(mainTodo, item.subId!);
            let parent = Todo.findSubTodoById(mainTodo, parentTodo.subId!);
            parent!.list.splice(0, 0, item);
            item.parentId = parentTodo.subId;
            
        }
    }
}

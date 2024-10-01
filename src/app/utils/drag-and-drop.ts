import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Todo } from "../models/todo";
import { Dialog } from "@capacitor/dialog";
import { TranslateService } from "@ngx-translate/core";
import { TodoUtils } from "./todo-utils";

export class DragAndDrop {


    public static async drop(event: CdkDragDrop<any[]>, mainTodo: Todo, translate : TranslateService) {

        console.log("Element dropped")

        console.log(event.container, event.previousContainer, event.currentIndex)
        
        console.log(event.container.id > event.previousContainer.id);

        let newIndex = event.currentIndex;

        // Lorsque l'on déplace un élément vers le bas on doit décrémenter l'index de 1
        // if (event.container.id > event.previousContainer.id){
        //     newIndex = event.currentIndex == 0 ? 0 : event.currentIndex - 1; 
        // }
        // else{
        //     newIndex = event.currentIndex;
        // }

        if (!event.container.data || event.container.data[newIndex] === undefined ){
            console.log("Error : No data")
            return;
        }

        let item : Todo = event.item.data;
        let parentTodo = event.container.data[newIndex].todo;
    
        console.log("Search parent todo")
        // console.log(parentTodo.title)

        if (!parentTodo){
            console.log("Error : No parent todo")
            return;
        }

        if (parentTodo.id == item.id){
            console.log("Error : Cannot move on itself")
            return;
        }

        // if (parentTodo.subId == item.parentId){
        //     console.log("Error : Already on parent todo")
        //     return;
        // }


        if (TodoUtils.findSubTodoById(item, parentTodo.id!)){
            console.log("Error : Cannot add parent on children")
            return;
        }
        
        await this.moveItem(item, parentTodo, mainTodo, translate);
        
        console.log(event.container.data)
    }


    // Move item to another parent

    public static async moveItem(item : Todo, parentTodo : Todo, mainTodo : Todo, translate : TranslateService){

        console.log('SURE TO MOVE : ' + item.title + '  INTO : ' + parentTodo.title)

        const { value } = await Dialog.confirm({
            title: 'Confirm',
            // message: `${translate.instant('SURE TO MOVE TO')} `+ item.title +` ${translate.instant('INTO')}  `+ parentTodo.title +` ?`,
            message: `'SURE TO MOVE TO' `+ item.title +` 'INTO' `+ parentTodo.title +` ?`,

          });
        
          console.log('Confirmed:', value);
      
          if (value) {

            if (parentTodo.config.subtasks !== true){
                parentTodo.config.subtasks = true;
            }

            TodoUtils.deleteTodoById(mainTodo, item.id!);


            let parent = TodoUtils.findSubTodoById(mainTodo, parentTodo.id!);
            parent!.list.splice(0, 0, item);

            
            item.parentId = parentTodo.subId;
            
        }
    }
}

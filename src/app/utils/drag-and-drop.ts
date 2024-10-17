import { CdkDragDrop } from "@angular/cdk/drag-drop";
// import { Todo } from "../models/todo";
import { Dialog } from "@capacitor/dialog";
import { TranslateService } from "@ngx-translate/core";
import { TodoUtils } from "./todo-utils";
import { MainTodo } from "../models/todo/main-todo";
import { SubTodo } from "../models/todo/sub-todo";

export class DragAndDrop {


    // Verify container data actualization

    public static async drop(event: CdkDragDrop<any[]>, mainTodo: MainTodo, translate : TranslateService) {

        console.log("Element dropped")

        console.log(event.container, event.previousContainer, event.currentIndex)
        
        // console.log(event.container.data[0].todo.title);

        let newIndex = event.currentIndex;

        // Lorsque l'on déplace un élément vers le bas on doit décrémenter l'index de 1
        // Problème car ne dépend pas de la position mais du sens du déplacement

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

        let item : SubTodo = event.item.data;
        let parentTodo = event.container.data[newIndex].todo;
    
        console.log("Search parent todo")

        if (!parentTodo){
            console.log("Error : No parent todo")
            return;
        }

        if (parentTodo.id == item.id){
            console.log("Error : Cannot move on itself")
            return;
        }

        // Feature : Permet de retrier les tâches dans le même parent (garder commenté)
        // if (parentTodo.subId == item.parentId){
        //     console.log("Error : Already on parent todo")
        //     return;
        // }


        if (TodoUtils.findSubTodoById(item, parentTodo.id!)){
            console.log("Error : Cannot add parent on children")
            return;
        }
        
        await this.moveItem(item, parentTodo, mainTodo, translate);        
    }


    // Move item to another parent

    public static async moveItem(item : SubTodo, parentTodo : SubTodo, mainTodo : MainTodo, translate : TranslateService){

        console.log('SURE TO MOVE : ' + item.properties.title + '  INTO : ' + parentTodo.properties.title)

        const { value } = await Dialog.confirm({
            title: 'Confirm',
            message: `${translate.instant('SURE TO MOVE TO')} `+ item.properties.title +` ${translate.instant('INTO')}  `+ parentTodo.properties.title +` ?`,
            // message: `'SURE TO MOVE TO' `+ item.title +` 'INTO' `+ parentTodo.title +` ?`,

          });
        
          console.log('Confirmed:', value);
      
          if (value) {

            if (parentTodo.properties.config.subtasks !== true){
                parentTodo.properties.config.subtasks = true;
            }

            TodoUtils.deleteTodoById(mainTodo, item.id!);


            let parent = TodoUtils.findSubTodoById(mainTodo, parentTodo.id!);
            parent!.list.splice(0, 0, item);

            
            item.parentId = parentTodo.subId;
        }
    }
}

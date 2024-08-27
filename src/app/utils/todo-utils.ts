

import { Todo } from "../models/todo";
import { TranslateService } from "@ngx-translate/core";
import { TodoNotification } from "./todo-notification";



export class TodoUtils {


// DELETE TODO

    public static deleteTodoById(rootTodo: Todo, idToDelete: number): Todo {

        console.log('Delete todo by id, todo-utils :', idToDelete)

        TodoNotification.cancelNotification(rootTodo);
    
        // Créez une copie du todo actuel
        // const updatedTodo: Todo = { ...rootTodo, initializeMainTodo: rootTodo.initializeMainTodo };
        const updatedTodo: Todo = { ...rootTodo };

    
        // Parcourez les sous-todos récursivement
        rootTodo.list!.forEach((subTodo) => {

        if (subTodo.subId === idToDelete) {
            // Supprimer le todo
            updatedTodo.list!.splice(updatedTodo.list!.indexOf(subTodo), 1);
        } else {
            // Sinon, parcourez les sous-todos de ce todo
            TodoUtils.deleteTodoById(subTodo, idToDelete);
        }
        });
    
        // Renvoyez le todo mis à jour (ou null s'il doit être supprimé)
        return updatedTodo;
    }



    // FIND SUB TODO

    public static findSubTodoById(rootTodo: Todo, subId : number){

        let copyList = [...rootTodo.list!];

        // Bfs algorithm
        while (copyList.length > 0) {

        let todo = copyList.shift()!;

        if (todo.subId == subId) {
            return todo;
        }

        for (let subTodo of todo.list!) {
            copyList.push(subTodo);
        }
        }
        return null;
    }

    

    // NOTIFICATIONS

    

    

    // TODO TO LIST

    public static transformTodoInListByDepth(rootTodo : Todo, hideSubTask : boolean = false, level : number = 0, list : {todo: Todo, level: number}[] = []){

        if (hideSubTask && rootTodo.isDone){
        return list;
        }

        list.push({todo: rootTodo, level: level});

        let copyList = [...rootTodo.list!];
        // Dfs algorithm

        if (rootTodo.developped) {
        while(copyList.length > 0){

            let todo = copyList.shift()!;
            
            TodoUtils.transformTodoInListByDepth(todo, hideSubTask, level + 1, list)
        }
        
        }

        return list
    }


    // TASK PERCENT VISUALISATION

    public static getDoneTasksPercent(todo : Todo){
        
        let doneTasks = 0;
        let totalTasks = 0;

        let copyList = [...todo.list!];
        // Bfs algorithm
        while(copyList.length > 0){

            let todo = copyList.shift()!;

            if (todo.isDone) {
            doneTasks++;
            }
            totalTasks++;

            for (let subTodo of todo.list!) {
            copyList.push(subTodo);
            }
        }

        if (totalTasks == 0) {
            return 0;
        }
        return Math.floor(doneTasks / totalTasks * 100);
    }


    


    // COMPARE TODOS

    public static areSameTodos(todo1 : Todo, todo2 : Todo){


        if (!todo1 || !todo2) {
        return false;
        }

        const keys1 = Object.keys(todo1);
        const keys2 = Object.keys(todo2);
    
        if (keys1.length !== keys2.length) {
        return false;
        }
    
        for (let key of keys1) {

        if (key == "list") {
            
            for (let i = 0; i < todo1.list.length; i++) {

            if (!TodoUtils.areSameTodos(todo1.list[i], todo2.list[i])) {
                return false;
            }
            }
        }

        else if (!this.compareObjects(todo1[key as keyof Todo] as Object, todo2[key as keyof Todo] as Object)) {
            return false;
        }
        }
    
        return true;
    }


    public static compareObjects(object1 : Object, object2 : Object) {

        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);
        
        if (keys1.length !== keys2.length) {
        return false;
        }

        for (let key of keys1) {
            if (object1[key as keyof Object] !== object2[key as keyof Object]) {
            return false;
            }
        }
        return true
    }
}
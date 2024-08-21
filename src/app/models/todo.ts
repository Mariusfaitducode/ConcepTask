import { ScheduleEvery } from "@capacitor/local-notifications";
import { Notif } from "./notif";
import { TaskConfig } from "./task-config";
import { Category } from "./category";
import { TranslateService } from "@ngx-translate/core";

export class Todo {

    public id? : string; 

    public welcomeTodo?: boolean = false;

    public subId?: number;
    public parentId?: number;

    public main: boolean;
    public mainId?: number;

    public notifId?: number;

    public isDone: boolean = false;

    // Propriety to choose

    public config!: TaskConfig;
    
    public title: string = '';
    public category: Category;

    public description?: string;

    public priority?: string;

    public date?: Date | string;
    public time?: string;

    public reminder?: boolean;
    

    public repeat?: {
        startDate?: Date | string,
        startTime?: string,
        delayType?: ScheduleEvery,
    };

    public list: Todo[];
    public developped?: boolean = false;


    constructor(title?: string, category?: Category, main?: boolean) {

        //this.id = id;
        this.main = main || false;
        this.category = category || { name: 'task', color: 'var(--ion-color-tertiary)', id: 0};
        this.title = title || '';

        this.developped = true;

        this.repeat = {};

        this.list = [];

        this.config = new TaskConfig(); 
    }


    // DELETE TODO

    public static deleteTodoById(rootTodo: Todo, idToDelete: number): Todo {

      Notif.cancelNotification(rootTodo);
    
      // Créez une copie du todo actuel
      const updatedTodo: Todo = { ...rootTodo };
    
      // Parcourez les sous-todos récursivement
      rootTodo.list!.forEach((subTodo) => {

        if (subTodo.subId === idToDelete) {
          // Supprimer le todo
          updatedTodo.list!.splice(updatedTodo.list!.indexOf(subTodo), 1);
        } else {
          // Sinon, parcourez les sous-todos de ce todo
          Todo.deleteTodoById(subTodo, idToDelete);
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

    public static getNotifId(todo : Todo){

      if (!todo.notifId) {

        console.log("get notifId")
        // console.log(localStorage.getItem('notifId') || [])

        let notifId = JSON.parse(localStorage.getItem('notifId') || '[]');

        let newId = 0;

        for (let id of notifId) {
          
          if (id === newId) {
            newId = id + 1;
          }
          else{
            break;
          }
        }

        notifId.push(newId);


        console.log("set notifId : " + notifId)
    
        localStorage.setItem('notifId', JSON.stringify(notifId));

        todo.notifId = newId;

        return todo.notifId;
      }
      else{
        console.log("already notifId")
        return todo.notifId;
      }
    }


    

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
          
          Todo.transformTodoInListByDepth(todo, hideSubTask, level + 1, list)
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

            if (!Todo.areSameTodos(todo1.list[i], todo2.list[i])) {
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




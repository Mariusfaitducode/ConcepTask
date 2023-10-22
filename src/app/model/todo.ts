import { ScheduleEvery } from "@capacitor/local-notifications";

export class Todo {

    // 

    public subId?: number;
    public parentId?: number;

    public main: boolean;
    public mainId?: number;

    public notifId?: number;

    public isDone: boolean = false;

    // Propriety to choose

    public config!: any;
    
    public title!: string;
    public category: string;

    public description?: string;

    public priority?: string;

    public date?: Date;
    public time?: string;

    public reminder?: boolean;
    

    public repeat?: {
        startDate?: Date,
        startTime?: string,
        delayType?: ScheduleEvery,
    };

    public list: Todo[];
    public developped?: boolean = false;


    constructor(title?: string, category?: string, main?: boolean) {

        //this.id = id;
        this.main = main || false;
        this.category = category || 'default';
        this.title = title || '';

        this.list = [];

        this.config = {
          description: false,
          priority: false,
          date: false,
          repeat: false,
          subtasks: false,
        };   
    }


    public static setConfig(todo : Todo){
      console.log("set config")
      let configArray = {
         description: todo.description ? true : false ,
         priority: todo.priority ? true : false,
         date: todo.date ? true : false ,
         repeat: todo.repeat ? true : false ,
        // { key: 'note', value: false },
         subtasks: todo.list?.length ? true : false ,
      };
  
      todo.config = configArray;
    };


    public static deleteTodoById(rootTodo: Todo, idToDelete: number): Todo {
    
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

    
    public static typeColor(type : string) {
      switch (type) {

        case "default":
          return "var(--ion-color-tertiary)";
          
        case "personnal":
          return "var(--ion-color-danger)";
          
        case "project":
          return "var(--ion-color-warning)";
          
        case "work":
          return "var(--ion-color-success)";
          
        default:
          return "var(--ion-color-primary)";
      }
    }

    


    // public static findOnConfig(todo: Todo, key: string): boolean {

    //   const configItem = todo.config.find(item => item.key === key);
    //   return configItem ? configItem.value : false;
    // }


    public static getDate(newDate: Date, newTime?: string) {
      let date = new Date(newDate);

        if (newTime) {
          let time = newTime!.split(':');
          const hours = parseInt(time[0], 10); // Convertissez l'heure en entier
          const minutes = parseInt(time[1], 10);
          
          date.setHours(hours);
          date.setMinutes(minutes);
        }
        else{
          date.setHours(8);
          date.setMinutes(0);
        }
        return date;
    }


    public static getNotifId(todo : Todo){

      if (!todo.notifId) {

        console.log("get notifId")
        console.log(localStorage.getItem('notifId') || '0')

        let notifId = JSON.parse(localStorage.getItem('notifId') || '0');

        console.log("notifId : " + notifId)
  
        if (notifId == 0) {
          notifId = 1;
        }
        else{
          notifId++;
        }
        todo.notifId = notifId;

        console.log("set notifId : " + notifId)
    
        localStorage.setItem('notifId', JSON.stringify(notifId));

        return notifId;
      }
      else{
        console.log("already notifId")
        return todo.notifId;
      }
    }


    public static passedDate(todo : Todo){

      if (todo.date) {
        let date = new Date(todo.date);
        let now = new Date();
  
        if (date < now) {
          return true;
        }
      }
      return false;

    }


    public static transformTodoInListByDepth(rootTodo : Todo, level : number = 0, list : any[] = []){

      list.push({todo: rootTodo, level: level});

      let copyList = [...rootTodo.list!];
      // Dfs algorithm

      if (rootTodo.developped) {
        while(copyList.length > 0){

          let todo = copyList.shift()!;
          
          Todo.transformTodoInListByDepth(todo, level + 1, list)
        }
        
      }

      return list
    }


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
        return doneTasks / totalTasks * 100;
    }
    
}


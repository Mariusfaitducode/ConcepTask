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

    public config!: { key: string, value: boolean }[];
    
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

    public list?: Todo[];


    constructor(title?: string, category?: string, main?: boolean) {

        //this.id = id;
        this.main = main || false;
        this.category = category || 'default';
        this.title = title || '';

        this.list = [];

        this.config = [
          { key: 'description', value: false },
          { key: 'priority', value: false },
          { key: 'date', value: false },
          { key: 'repeat', value: false },
          // { key: 'note', value: false },
          { key: 'sub tasks', value: false },
        ];
    }


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
        let notifId = JSON.parse(localStorage.getItem('notifId') || '');
  
        if (!notifId) {
          notifId = 1;
        }
        else{
          notifId++;
        }
        todo.notifId = notifId;
    
        localStorage.setItem('notifId', JSON.stringify(notifId));

        return notifId;
      }
      else{
        return todo.notifId;
      }
    }


    
}


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
    public category: { name: string, color: string, id: number};

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


    constructor(title?: string, category?: any, main?: boolean) {

        //this.id = id;
        this.main = main || false;
        this.category = category || { name: 'task', color: 'var(--ion-color-tertiary)', id: 0};
        this.title = title || '';

        this.developped = true;

        this.repeat = {};

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
      // console.log("set config")
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


   public static getCorrectTextColor(hex: string): string {
      const threshold = 130;
      const hRed = hexToR(hex);
      const hGreen = hexToG(hex);
      const hBlue = hexToB(hex);
  
      function hexToR(h: string) {
        return parseInt(cutHex(h).substring(0, 2), 16);
      }
  
      function hexToG(h: string) {
        return parseInt(cutHex(h).substring(2, 4), 16);
      }
  
      function hexToB(h: string) {
        return parseInt(cutHex(h).substring(4, 6), 16);
      }
  
      function cutHex(h: string) {
        return h.charAt(0) === '#' ? h.substring(1, 7) : h;
      }
  
      const cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
      if (cBrightness > threshold) {
        return '#000000';
      } else {
        return '#ffffff';
      }
    }


    // public static findOnConfig(todo: Todo, key: string): boolean {

    //   const configItem = todo.config.find(item => item.key === key);
    //   return configItem ? configItem.value : false;
    // }


    public static getDate(newDate: Date | string, newTime?: string) {
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


    public static isDateInRepeat(todo : Todo, date : Date ){

      let startDate = Todo.getDate(todo.repeat?.startDate!);

      while(true){

        if (this.sameDates(startDate, date)) {
          return true;
        }
        else if (startDate < date) {

          if (todo.repeat!.delayType == "day") {
            startDate.setDate(startDate.getDate() + 1);
          }
          else if (todo.repeat!.delayType == "week") {
            startDate.setDate(startDate.getDate() + 7);
          }
          else if (todo.repeat!.delayType == "two-weeks") {
            startDate.setDate(startDate.getDate() + 14);
          }
          else if (todo.repeat!.delayType == "month") {
            startDate.setMonth(startDate.getMonth() + 1);
          }
          else if (todo.repeat!.delayType == "year") {
            startDate.setFullYear(startDate.getFullYear() + 1);
          }
        }
        else{
          return false;
        }
      }
    }

    public static sameDates(date1 : Date, date2 : Date){
      // Extraire les parties de la date (année, mois, jour) pour chaque date
      const annee1 = date1.getFullYear();
      const mois1 = date1.getMonth();
      const jour1 = date1.getDate();
    
      const annee2 = date2.getFullYear();
      const mois2 = date2.getMonth();
      const jour2 = date2.getDate();
    
      // Comparer les parties de la date
      return annee1 === annee2 && mois1 === mois2 && jour1 === jour2;
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

      if (todo.config.date && todo.date) {
        let date = new Date(todo.date);
        let now = new Date();
  
        if (date < now) {
          return true;
        }
      }
      return false;

    }


    public static transformTodoInListByDepth(rootTodo : Todo, hideSubTask : boolean = false, level : number = 0, list : any[] = []){

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


    public static formatDateToCustomString(todo : Todo, translate : any = undefined) {

      // console.log(translate)

      let daysOfWeek : any[] = []
      let months : any[] = []

      const daysOfWeekEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOfWeekFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

      const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthsFr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    
      if (translate && translate.store.currentLang == "fr") {
        months = monthsFr;
        daysOfWeek = dayOfWeekFr;
      }
      else{
        months = monthsEn;
        daysOfWeek = daysOfWeekEn;
      }


      if (todo.config.date){
  
        let date = Todo.getDate(todo.date!, todo.time);
  
        const day = daysOfWeek[date!.getDay()];
        const dayOfMonth = date!.getDate();
        const month = months[date!.getMonth()];
        const hours = String(date!.getHours()).padStart(2, '0');
        const minutes = String(date!.getMinutes()).padStart(2, '0');
      
        return `${day}, ${dayOfMonth} ${month} ${hours}:${minutes}`;
      }
      if (todo.config.repeat && todo.repeat!.delayType){
  
        let date = Todo.getDate(todo.repeat?.startDate!, todo.repeat?.startTime);
  
        const day = daysOfWeek[date!.getDay()];
        const dayOfMonth = date!.getDate();
        const month = months[date!.getMonth()];
        const hours = String(date!.getHours()).padStart(2, '0');
        const minutes = String(date!.getMinutes()).padStart(2, '0');

        const translateKey = `repeat.${todo.repeat!.delayType}`
        const translationParams = { day, dayOfMonth, month, hours, minutes }

        if (translate) {
          return translate.instant(translateKey, translationParams);
        }

        if (todo.repeat!.delayType == "day") {
          return `Repeat every day at ${hours}:${minutes}`;
        }
        if (todo.repeat!.delayType == "week") {
          return `Repeat every week on ${day} at ${hours}:${minutes}`;
        }
        if (todo.repeat!.delayType == "two-weeks") {
          return `Repeat every two weeks on ${day} at ${hours}:${minutes}`;
        }
        if (todo.repeat!.delayType == "month") {
          return `Repeat every month on ${dayOfMonth} at ${hours}:${minutes}`;
        }
        if (todo.repeat!.delayType == "year") {
          return `Repeat every year on ${dayOfMonth} ${month} at ${hours}:${minutes}`;
        }
        // return `Repeat every ${todo.repeat!.delayType}`;
      }
      return null; 
    }


    public static areSameTodos(todo1 : any, todo2 : any){

      // console.log("verify todos")

      // console.log(todo1, todo2)

      const keys1 = Object.keys(todo1);
      const keys2 = Object.keys(todo2);
    
      if (keys1.length !== keys2.length) {
        // console.log("length")
        // console.log(keys1.length, keys2.length)
        return false;
      }
    
      for (let key of keys1) {

        if (key == "list") {

          // console.log("list")
          
          for (let i = 0; i < todo1.list.length; i++) {

            // console.log(todo1.list[i], todo2.list[i])

            if (!Todo.areSameTodos(todo1.list[i], todo2.list[i])) {
              return false;
            }
          }
        }

        else if (!this.compareObjects(todo1[key], todo2[key])) {
          // console.log(key)
          // console.log(todo1[key], todo2[key])
          return false;
        }
      }
    
      return true;
    }

    public static compareObjects(object1 : any, object2 : any) {

      const keys1 = Object.keys(object1);
      const keys2 = Object.keys(object2);
      
      if (keys1.length !== keys2.length) {
        // console.log("length")
        return false;
      }

      for (let key of keys1) {
          if (object1[key] !== object2[key]) {
            // console.log(key)
            // console.log(object1[key], object2[key])
            return false;
          }
      }

      return true

    }

  }




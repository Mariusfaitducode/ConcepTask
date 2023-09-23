
import { LocalNotifications } from '@capacitor/local-notifications';


export class Todo {

    public subId?: number;
    public parentId?: number;

    public isDone: boolean = false;

    public main: boolean;
    public title!: string;
    public category: string;

    public description?: string;

    public isChecked?: boolean;

    public date?: Date;
    public time?: string;

    public reminder?: boolean;
    public notifId?: number;

    public repetition?: {
        startDate: Date,
        delay: number,
    };

    public list?: Todo[];


    constructor(title?: string, category?: string, main?: boolean) {

        //this.id = id;
        this.main = main || true;
        this.category = category || 'default';
        this.title = title || '';
        this.list = [];

        // this.description = description;
       
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

    public static async scheduleNotification(todo : Todo) {
        try {

          let date = new Date(todo.date!);

          if (todo.time) {
            let time = todo.time!.split(':');
            const hours = parseInt(time[0], 10); // Convertissez l'heure en entier
            const minutes = parseInt(time[1], 10);
            
            date.setHours(hours);
            date.setMinutes(minutes);
          }
          else{
            date.setHours(8);
            date.setMinutes(0);
          }

          console.log(date);

          console.log("add notification");
          // Vérifier si les notifications sont disponibles
          const available = await LocalNotifications.requestPermissions();
    
          let notifId = JSON.parse(localStorage.getItem('notifId') || '');
    
          if (!notifId) {
            notifId = 1;
          }
          else{
            notifId++;
          }

          let description = todo.description;
          if (!todo.description){
            description = '';
          }

          todo.notifId = notifId;
    
          localStorage.setItem('notifId', JSON.stringify(notifId));
          
          if (available) {
    
            // Planifier la notification
            await LocalNotifications.schedule({
              notifications: [
                {
                  title: `${todo.title} reminder`,
                  body: `${description}`,
                  id: notifId, // Un identifiant unique pour la notification
                  schedule: { at: date }, // Date et heure de la notification
                  //sound: null, // Chemin vers un fichier audio de notification (facultatif)
                  //attachments: null, // Pièces jointes (facultatif)
                  actionTypeId: '', // Identifiant d'action personnalisée (facultatif)
                },
              ],
            });
          }
        } catch (error) {
          console.error('Erreur lors de la planification de la notification', error);
        }
      }


      public static async cancelNotification(todo : Todo) {
        try {
          console.log("remove notification");

          await LocalNotifications.cancel({ notifications: [{ id: todo.notifId! }] });
        } catch (error) {
          console.error('Erreur lors de l`annulation de la notification', error);
        }
      }

}










// export class TypeTodo{
    
//         public type: string;
//         public color: string;

//         // Config could be on type
    
//         constructor() {
//             this.type = 'customize';
//             this.color = '';
//         }
    
// }

// export class Config{

//     public description?: boolean;
//     public isChecked?: boolean;
//     public date?: boolean
//     public reminder?: boolean;
//     public repetition?: boolean;
//     public list?: boolean;
    

//     constructor() {
//         this.description = false;
//         this.date = false;
//         this.reminder = false;
//         this.repetition = false;
//         this.list = false;
//     }

//     customizedConfig(){
//         this.description = false;
//         this.date = false;
//         this.reminder = false;
//         this.repetition = false;
//         this.list = false;
//     }

//     todoConfig(){
//         this.description = false;
//         this.date = false;
//         this.reminder = false;
//         this.repetition = false;
//         this.list = false;
//     }

//     todoListConfig(){
//         this.description = true;
//         this.date = true;
//         this.reminder = true;
//         this.repetition = false;
//         this.list = true;
//     }

    
// }

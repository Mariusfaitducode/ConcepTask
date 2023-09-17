
import { LocalNotifications } from '@capacitor/local-notifications';


export class Todo {

    public subId?: number;
    public parentId?: number;

    public main: boolean;
    public title!: string;
    public category: string;

    public description?: string;

    public isChecked?: boolean;

    public date?: Date;
    public time?: Date;

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

    public sayHello() {
        console.log("Hello");
    }

    public async scheduleNotification() {
        try {

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

          this.notifId = notifId;
    
          localStorage.setItem('notifId', JSON.stringify(notifId));
          
          if (available && this.date! > new Date()) {
    
    
            if(this.time){
              this.date?.setHours(this.time.getHours());
              this.date?.setMinutes(this.time.getMinutes());
            }
            else{
                this.date?.setHours(0);
                this.date?.setMinutes(0);
            }
    
            // Planifier la notification
            await LocalNotifications.schedule({
              notifications: [
                {
                  title: 'Nouvelle tâche',
                  body: `N'oubliez pas : ${this.title}`,
                  id: notifId, // Un identifiant unique pour la notification
                  schedule: { at: this.date }, // Date et heure de la notification
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


      public async cancelNotification() {
        try {
          console.log("remove notification");

          await LocalNotifications.cancel({ notifications: [{ id: this.notifId! }] });
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

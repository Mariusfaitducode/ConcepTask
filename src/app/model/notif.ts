
import { LocalNotifications, ScheduleEvery } from '@capacitor/local-notifications';
import { Todo } from './todo';


export class Notif {

    public static async scheduleNotification(todo : Todo) {
        try {
          console.log("schedule notification")
          let date = Todo.getDate(todo.date!, todo.time);
          
          // Vérifier si les notifications sont disponibles
          const available = await LocalNotifications.requestPermissions();
    
          // console.log("search notifId")
          let notifId = Todo.getNotifId(todo);
  
          // console.log("notifId : " + notifId)

          let description = todo.description;
          if (!todo.description){
            description = '';
          }


  
          if (available) {

          console.log("notification available")


            console.log(date)
    
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
                }
              ],
            });
          }
        } 
        catch (error) {
          console.error('Erreur lors de la planification de la notification', error);
        }
      }
  
  
      public static async scheduleRecurringNotification(todo: Todo) {
        try {
          let date = Todo.getDate(todo.repeat!.startDate!, todo.repeat!.startTime);
          
          // Vérifier si les notifications sont disponibles
          const available = await LocalNotifications.requestPermissions();
  
          let notifId = Todo.getNotifId(todo);
  
          let description = todo.description;
          if (!todo.description){
            description = '';
          }

          let repeat : ScheduleEvery = todo.repeat!.delayType!;

  
          if (available) {

            console.log(date)
  
            // Planifier la notification
            await LocalNotifications.schedule({
              notifications: [
                {
                  title: `${todo.title} reminder`,
                  body: `${description}`,
                  id: notifId, // Un identifiant unique pour la notification
                  schedule: { at: date,
                              every: repeat,
                             }, // Date et heure de la notification
                }
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

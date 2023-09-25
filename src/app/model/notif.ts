
import { LocalNotifications, ScheduleEvery } from '@capacitor/local-notifications';
import { Todo } from './todo';


export class Notif {

    public static async scheduleNotification(todo : Todo) {
        try {
          let date = Todo.getDate(todo.date!, todo.time);
          
          // Vérifier si les notifications sont disponibles
          const available = await LocalNotifications.requestPermissions();
    
          let notifId = Todo.getNotifId(todo);
  
          let description = todo.description;
          if (!todo.description){
            description = '';
          }
  
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
  
  
      public static async scheduleRecurringNotification(todo: Todo) {
        try {
          let date = Todo.getDate(todo.date!, todo.time);
          
          // Vérifier si les notifications sont disponibles
          const available = await LocalNotifications.requestPermissions();
  
          let notifId = Todo.getNotifId(todo);
  
          let description = todo.description;
          if (!todo.description){
            description = '';
          }

          let repeat : ScheduleEvery = todo.repeat!.delayType!;

  
          if (available) {
  
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

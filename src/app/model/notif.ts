
import { LocalNotifications, ScheduleEvery } from '@capacitor/local-notifications';
import { Todo } from './todo';

// import { Actions } from '@ionic/angular';

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
                  smallIcon: 'res://drawable/check_mark_green',
                  largeIcon: 'res://drawable/check_mark_green',

                  title: `${todo.title} reminder`,
                  body: `${description}`,
                  id: notifId,
                  schedule: { at: date },
                }
              ],
            });
          }
          return true;

        } 
        catch (error) {
          console.error('Erreur lors de la planification de la notification', error);
          return false;
        }
      }
  
  
      public static async scheduleRecurringNotification(todo: Todo) {
        try {
          let date = Todo.getDate(todo.repeat!.startDate!, todo.repeat!.startTime);

          console.log(date)
          
          // Vérifier si les notifications sont disponibles
          const available = await LocalNotifications.requestPermissions();
  
          let notifId = Todo.getNotifId(todo);
  
          let description = todo.description;
          if (!todo.description){
            description = '';
          }

          let repeat : ScheduleEvery = todo.repeat!.delayType!;

          console.log(repeat)

  
          if (available) {

            console.log(date)
  
            // Planifier la notification
            await LocalNotifications.schedule({
              notifications: [
                {
                  smallIcon: 'res://drawable/check_mark_green',
                  largeIcon: 'res://drawable/check_mark_green',

                  title: `${todo.title} reminder`,
                  body: `${description}`,
                  id: notifId,
                  schedule: { 
                    repeats: true,
                    at: date,
                    every: repeat},
                  
                }
              ],
            });
          }
          return true;

        } catch (error) {
          console.error('Erreur lors de la planification de la notification', error);
          return false;
        }
      }
  
  
      public static async cancelNotification(todo : Todo) {
        try {
          console.log("remove notification");
  
          await LocalNotifications.cancel({ notifications: [{ id: todo.notifId! }] });
          return true;
        } catch (error) {
          console.error('Erreur lors de l`annulation de la notification', error);
          return false;
        }
      }
}

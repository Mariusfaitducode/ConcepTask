
import { LocalNotifications, ScheduleEvery } from '@capacitor/local-notifications';
import { Todo } from './todo';
import { Router } from '@angular/router';

// import { Actions } from '@ionic/angular';

export class Notif {

    

    public static async scheduleNotification(todo : Todo, router : Router) {
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

            const notificationData = {
              pageToNavigate: '/todo/'+todo.mainId, // Remplacez par le chemin de la page cible
              // Autres données de notification
            };

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
                  extra: notificationData,
                }
              ],
            });

            LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
              const clickedNotificationData = notification.notification.extra;

              todo.reminder = false;
              
              // Vérifiez si des données supplémentaires existent et contiennent la page à laquelle naviguer
              if (clickedNotificationData && clickedNotificationData.pageToNavigate) {
                const pageToNavigate = clickedNotificationData.pageToNavigate;
                router.navigate([pageToNavigate]);
              }
            });

          }
          return true;

        } 
        catch (error) {
          console.error('Erreur lors de la planification de la notification', error);
          return false;
        }
      }
  
  
      public static async scheduleRecurringNotification(todo: Todo, router : Router) {
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

            const notificationData = {
              pageToNavigate: '/todo/'+todo.mainId, // Remplacez par le chemin de la page cible
              // Autres données de notification
            };

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
                  extra: notificationData,
                }
              ],
            });

            LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
              const clickedNotificationData = notification.notification.extra;
              
              // Vérifiez si des données supplémentaires existent et contiennent la page à laquelle naviguer
              if (clickedNotificationData && clickedNotificationData.pageToNavigate) {
                const pageToNavigate = clickedNotificationData.pageToNavigate;
                router.navigate([pageToNavigate]);
              }
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
  
          if (!todo.notifId) return false;
          await LocalNotifications.cancel({ notifications: [{ id: todo.notifId! }] });
          return true;
        } catch (error) {
          console.error('Erreur lors de l`annulation de la notification', error);
          return false;
        }
      }

      public static async cancelNotificationById(id : number) {
        try {
          console.log("remove notification");
  
          await LocalNotifications.cancel({ notifications: [{ id: id }] });
          return true;
        } catch (error) {
          console.error('Erreur lors de l`annulation de la notification', error);
          return false;
        }
      }
}

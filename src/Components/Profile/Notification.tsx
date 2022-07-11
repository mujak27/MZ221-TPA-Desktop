import { IonItem, IonList, IonTitle } from '@ionic/react';
import { collection } from 'firebase/firestore';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeNotification } from '../../Model/model';

type props = {
}

export const Notification : React.FC<props> = ({}) => {
  const {user, firestore} = useGlobalContext();

  const refNotifications = collection(firestore, Tables.Users, user.uid as string, Tables.Notifications);
  const {status : statusNotifications, data : resNotifications} = useFirestoreCollectionData(refNotifications, {
    idField : 'uid'
  });

  if(statusNotifications === 'loading') return <>loading notification data...</>

  const notifications = resNotifications as TypeNotification[];

  return (
    <>
      <IonTitle>
        notification
      </IonTitle>
      <IonList>
        {
          notifications ?
          notifications.map((notification)=>{
            return <IonItem>{notification.notificationValue}</IonItem>
          }): <>no notifications...</>
        }
      </IonList>
    </>
  );
};

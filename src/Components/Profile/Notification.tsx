import { IonItem, IonList, IonTitle } from '@ionic/react';
import React from 'react';
import { useGlobalContext } from '../../context/ContextProvider';

type props = {
}

export const Notification : React.FC<props> = ({}) => {
  const {notifications} = useGlobalContext();

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

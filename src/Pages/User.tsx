import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { Invitation } from '../Components/Profile/Invitation/Invitation';
import { Notification } from '../Components/Profile/Notification';
import { Profile } from '../Components/Profile/Profile';
import { useGlobalContext } from '../context/ContextProvider';

export enum Tabs {
  // eslint-disable-next-line no-unused-vars
  profile = 'profile',
  // eslint-disable-next-line no-unused-vars
  invitation = 'invitation',
  // eslint-disable-next-line no-unused-vars
  notification = 'notification'
}

const User = () => {
  const globalContext = useGlobalContext();
  const user = globalContext.user;
  const [tab, setTab] = useState(Tabs.profile);
  let CurrentTab : JSX.Element;

  switch (tab) {
    case Tabs.profile:
      CurrentTab = (<Profile />);
      break;
    case Tabs.invitation:
      CurrentTab = (<Invitation />);
      break;
    default:
      CurrentTab = (<Notification/>);
      break;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonTitle>User data {user.userName}</IonTitle>
      </IonHeader>
      <IonContent>
        <IonToolbar slot=''>
          <IonButton onClick={()=>setTab(Tabs.profile)}>
              profile
          </IonButton>
          <IonButton onClick={()=>setTab(Tabs.invitation)}>
              invitation
          </IonButton>
          <IonButton onClick={()=>setTab(Tabs.notification)}>
              notificaion
          </IonButton>
        </IonToolbar>
        {CurrentTab}
      </IonContent>
    </IonPage>
  );
};

export { User as Profile };


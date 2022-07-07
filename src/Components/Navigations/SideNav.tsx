import { IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle } from '@ionic/react';
import { clipboardOutline, gridOutline } from 'ionicons/icons';
import React from 'react';
import { useLocation } from 'react-router';
import './SideNav.css';


const appPages = [
  {
    title: 'Workspaces',
    url: '/workspace',
    icon: gridOutline,
  },
  {
    title: 'Boards',
    url: '/board',
    icon : clipboardOutline
  }
];

export const SideNav = ({} : any)=> {
  const location = useLocation().pathname;
  return (
    <IonMenu type="reveal" contentId='main'>
      <IonList>
        {appPages.map((appPage, index)=>{
          return (
            <IonMenuToggle key={index} autoHide={false} >
              <IonItem className={location==appPage.url ? 'activeNav' : ''} routerLink={`${appPage.url}`} >
                <IonIcon slot='start' icon={appPage.icon} />
                <IonLabel>{appPage.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          );
        })}
      </IonList>
    </IonMenu>
  );
};

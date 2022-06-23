import { IonButton, IonButtons, IonIcon, IonLabel, IonTitle, IonToolbar } from '@ionic/react';
import { signOut } from 'firebase/auth';
import { ellipsisHorizontalOutline, logOutOutline, personCircle } from 'ionicons/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../context/ContextProvider';

const Navbar = ({} : any)=> {
  const globalContext = useGlobalContext();
  console.info(globalContext);
  const user = globalContext.user;
  const auth = useGlobalContext().auth;
  const onSignOut = async () => {
    await signOut(auth);
  };


  return (
    <IonToolbar className=''>
      {/* <IonButton routerLink={`/home`}>
      </IonButton> */}
      <Link to='/home' className='ion-align-self-center'>
        <IonTitle>CHello</IonTitle>
      </Link>
      <IonButtons slot="secondary">
        <IonLabel>{user.userName}</IonLabel>
        <IonButton color="primary" routerLink={`/profile/${user.userUid}`}>
          <IonIcon slot="icon-only" icon={personCircle} />
        </IonButton>
      </IonButtons>
      <IonButtons slot="primary">
        <IonButton color="primary" onClick={onSignOut}>
          <IonIcon slot="icon-only" ios={ellipsisHorizontalOutline} md={logOutOutline} />
        </IonButton>
      </IonButtons>
    </IonToolbar>
  );
};

export { Navbar };


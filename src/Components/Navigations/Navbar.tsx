import { IonButton, IonButtons, IonIcon, IonImg, IonLabel, IonTitle, IonToolbar } from '@ionic/react';
import { signOut } from 'firebase/auth';
import { ellipsisHorizontalOutline, logOutOutline, personCircle } from 'ionicons/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../context/ContextProvider';

const Navbar = ({} : any)=> {
  const {user, auth}= useGlobalContext();
  const onSignOut = async () => {
    await signOut(auth);
  };

  console.info(user.userImageLink);

  return (
    <IonToolbar className=''>
      <Link to='/home' className='ion-align-self-center'>
        <IonTitle>CHello</IonTitle>
      </Link>
      <IonButtons slot="secondary">
        <IonLabel>{user.userName}</IonLabel>
        <IonButton color="primary" routerLink={`/profile/${user.userUid}`}>
          {
            user.userImageLink && user.userImageLink != '' ?
            (<IonImg style={{height:'50px', width:'50px', borderRadius:'100px'}} src={user.userImageLink} />) :
            <IonIcon slot="icon-only" icon={personCircle} />
          }
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


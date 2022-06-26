import { IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonTitle } from '@ionic/react';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { enumNotifFreq } from '../../Model/model';

const Profile = () => {
  const {user}= useGlobalContext();
  const [name, setName] = useState(user.userName);
  const [bio, setBio] = useState(user.userBio);
  const [notifFreq, setNotifFreq] = useState(user.userNotifFreq);

  const onSave = ()=>{

  }

  return (
    <>
      <IonTitle>profile</IonTitle>
      <IonItem>
        <IonLabel 
          position='fixed'
          >Name</IonLabel>
        <IonInput
          value={name}
          onIonChange={e=>setName(e.detail.value as string)}
          />
      </IonItem>
      <IonItem>
        <IonLabel 
          position='fixed'
          >Bio</IonLabel>
        <IonInput
          value={bio}
          onIonChange={e=>setBio(e.detail.value as string)}
          />
      </IonItem>
      <IonItem>
        <IonLabel 
          position='fixed'
          >Notif 
        </IonLabel>
        <IonSelect
          interface='popover'
          value={notifFreq}
          onIonChange={(e)=>{
            setNotifFreq(e.detail.value);
          }}>
        {
          Object.keys(enumNotifFreq).map((notifFreq)=>{
            return (
              <IonSelectOption
                key={nanoid()}
                value={notifFreq}
              >{notifFreq}</IonSelectOption>);
          })
        }
        </IonSelect>
      </IonItem>
      <IonItem>
        <IonLabel 
          position='fixed'
          >pict
        </IonLabel>
        <input
          type='file'
        />
      </IonItem>
      <IonButton onClick={onSave}>save</IonButton>
    </>
  );
};

export { Profile };


import { IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonTitle } from '@ionic/react';
import { doc, writeBatch } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { enumNotifFreq, Tables, TypeUser } from '../../Model/model';

const Profile = () => {
  const {user, firestore}= useGlobalContext();
  const [name, setName] = useState(user.userName);
  const [bio, setBio] = useState(user.userBio);
  const [notifFreq, setNotifFreq] = useState(user.userNotifFreq);
  const [imageFile, setImageFile] = useState<Object | null>();
  // const [imageLink, setImageLink] = useState('');

  const onSave = async ()=>{
    // const refImage = ref(storage, `users/${user.uid as string}/${imageFile?.name}`)
    // uploadBytesResumable(refImage, imageFile)
    const refUser = doc(firestore, Tables.Users, user.uid as string);
    const batch = writeBatch(firestore);
    batch.update(refUser, {
      userName : name,
      userBio : bio,
      userNotifFreq : notifFreq,
      // userImageLink : im
    } as TypeUser);
    await batch.commit();

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
          accept='.jpg,.jpeg,.png'
          onChange={(e)=>{
            console.info((e.target.files as FileList)[0]);
            setImageFile((e.target.files as FileList)[0]);
            console.info(imageFile)
          }
          }
        />
      </IonItem>
      <IonButton onClick={onSave}>save</IonButton>
    </>
  );
};

export { Profile };


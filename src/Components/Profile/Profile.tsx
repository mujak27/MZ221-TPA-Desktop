import { IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonTitle } from '@ionic/react';
import { doc, writeBatch } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { enumNotifFreq, Tables, TypeUser } from '../../Model/model';

const Profile = () => {
  const {user, firestore, storage}= useGlobalContext();
  const [name, setName] = useState(user.userName);
  const [bio, setBio] = useState(user.userBio);
  const [notifFreq, setNotifFreq] = useState(user.userNotifFreq);
  const [imageFile, setImageFile] = useState<File>();
  // const [imageLink, setImageLink] = useState('');

  const onSave = async ()=>{
    const batch = writeBatch(firestore);
    const refStorage = ref(storage, `${user.userUid}/${(imageFile as File).name}`)
    const metadata = {contentType : 'profile pic'}

    await uploadBytes(refStorage, imageFile as File, metadata);
    const url = await getDownloadURL(refStorage);
    console.info(url);
      
      
    const refUser = doc(firestore, Tables.Users, user.uid as string);
    batch.update(refUser, {
      userName : name,
      userBio : bio,
      userNotifFreq : notifFreq,
      userImageLink : url
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
            setImageFile((e.target.files as FileList)[0] as File);
            console.info(imageFile);
          }
          }
        />
      </IonItem>
      <IonButton onClick={onSave}>save</IonButton>
    </>
  );
};

export { Profile };


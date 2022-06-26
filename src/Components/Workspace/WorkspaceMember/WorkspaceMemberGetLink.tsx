/* eslint-disable no-unused-vars */
import { IonButton, IonInput, IonItem, IonLabel, IonText } from '@ionic/react';
import { addDoc, collection, DocumentReference } from 'firebase/firestore';
import React, { useState } from 'react';
import { useGlobalContext } from '../../../context/ContextProvider';
import { EnumItemType, Tables, TypeInvitationLink } from '../../../Model/model';

type props = {
  itemType : EnumItemType
  itemRef : DocumentReference,
}

export const WorkspaceMemberGetLink : React.FC<props> = ({itemType, itemRef}) => {
  const {firestore} = useGlobalContext();
  const [completed, setCompleted] = useState(false);
  const [getLink, setGetLink] = useState(false);
  const [link, setLink] = useState('');
  const [expirationDate, setExpirationDate] = useState(1);

  
  const generateLink = async ()=>{
    const expiredDate = new Date;
    expiredDate.setDate(expiredDate.getDate() + expirationDate);
    const refInvitationLink = collection(firestore, Tables.InvitationLink);
    await addDoc(refInvitationLink, {
      refItem: itemRef,
      InvitationExpired: expiredDate.getTime(),
      InvitationType: itemType,
    } as TypeInvitationLink).then( (data) =>{
      setLink(window.location.protocol + '//' + window.location.host + '/join/' + data.id);
      setCompleted(true);
    });
  };

  const onClickHandle = ()=>{
    setGetLink(true);
    generateLink();
  };


  if (!getLink) {
    return (
      <IonItem>
        <IonLabel>set expiration day:</IonLabel>
        <IonInput
          type='number'
          min='1'
          placeholder='day'
          value={expirationDate}
          onIonChange={(e)=>{setExpirationDate(parseInt(e.detail.value as string))}}
          />
        <IonButton onClick={onClickHandle}>
          get link
        </IonButton>
      </IonItem>
    );
  }

  if (!completed) {
    return (
      <IonText>generating link...</IonText>
    );
  }

  return (
    <>
      {link}
    </>
  );
};

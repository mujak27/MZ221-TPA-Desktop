/* eslint-disable no-unused-vars */
import { IonButton, IonInput, IonItem, IonLabel, IonText } from '@ionic/react';
import { addDoc, collection, DocumentReference } from 'firebase/firestore';
import React, { useState } from 'react';
import { useGlobalContext } from '../../../../context/ContextProvider';
import { EnumItemType, Tables, TypeInvitationLink } from '../../../../Model/model';
import { useWorkspaceContext } from '../../../Workspace/WorkspaceContext';
import { useBoardContext } from '../../BoardContext';

type props = {
  itemType : EnumItemType
  refItem : DocumentReference,
}

export const BoardMemberGetLink : React.FC<props> = ({itemType, refItem}) => {
  const {firestore} = useGlobalContext();
  const {board} = useBoardContext();
  const {workspace} = useWorkspaceContext();
  const [completed, setCompleted] = useState(false);
  const [getLink, setGetLink] = useState(false);
  const [link, setLink] = useState('');
  const [expirationDate, setExpirationDate] = useState(1);

  const generateLink = async ()=>{
    const expiredDate = new Date;
    expiredDate.setDate(expiredDate.getDate() + expirationDate);
    const refInvitationLink = collection(firestore, Tables.InvitationLink);
    await addDoc(refInvitationLink, {
      refItem: refItem,
      InvitationExpired: expiredDate.getTime(),
      InvitationType: itemType,
      BoardUid: board.uid as string,
      WorkspaceUid: workspace.uid as string,
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

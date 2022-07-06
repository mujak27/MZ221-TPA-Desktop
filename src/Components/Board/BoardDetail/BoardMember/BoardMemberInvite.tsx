/* eslint-disable no-unused-vars */
import { IonButton, IonInput, IonItem, IonItemDivider, IonTitle } from '@ionic/react';
import { doc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useGlobalContext } from '../../../../context/ContextProvider';
import { EnumItemType, Tables } from '../../../../Model/model';
import { useBoardContext } from '../../BoardContext';
import { BoardMemberGetEmail } from './BoardMemberGetEmail';
import { BoardMemberGetLink } from './BoardMemberGetLink';

type props = {

}

export const BoardMemberInvite : React.FC<props> = ({})=>{
  const {firestore} = useGlobalContext();
  const [email, setEmail] = useState('');
  const [submitEmail, setSubmitEmail] = useState(false);
  const {board} = useBoardContext();

  const refBoard = doc(firestore, Tables.Boards, board.uid as string);

  const onSearchEmailHandle = ()=>{
    setSubmitEmail(true);
  };

  // input email,
  return (
    <>
      <IonTitle>
        Invite
      </IonTitle>
      <IonItemDivider>
        By Link : 
        <BoardMemberGetLink itemType={EnumItemType.Board} refItem={refBoard} />
      </IonItemDivider>
      <IonItem>
        <IonInput
          type='text'
          value={email}
          onIonChange={(e)=>setEmail(e.detail.value as string)}
          placeholder='email'
        />
        <IonButton onClick={onSearchEmailHandle}>search</IonButton>
      </IonItem>
      <IonItem>
        {
        submitEmail ?
          (<BoardMemberGetEmail itemRef={refBoard} itemUid={board.uid as string} userEmail={email} />):
          null
        }
      </IonItem>

    </>
  );
};

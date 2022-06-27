import { IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeCard, TypeComment } from '../../Model/model';
import { useBoardContext } from '../Board/BoardContext';
import { useWorkspaceContext } from '../Workspace/WorkspaceContext';

type props = {
  card : TypeCard
}

export const CardCreateComment : React.FC<props> = ({card}) => {
  const {firestore, user} = useGlobalContext();
  const {workspace} = useWorkspaceContext();
  const {board} = useBoardContext();

  const [value, setValue] = useState('');

  const onSubmitHandle = async () =>{

  
  const refComments = collection(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Cards, card.uid as string, Tables.Comments);
  await addDoc(refComments, {
    userUids : [user.userUid],
    commentMentions : [],
    commentOwnerUid : user.userUid,
    commentReplies : [],
    commentValue : value,
  } as TypeComment)
  };

  return (
    <>
      <IonItem>
        <IonLabel>input comment:</IonLabel>
        <IonInput
          type='text'
          placeholder="Name"
          value={value}
          onIonChange={(e)=>setValue(e.detail.value as string)}/>
        <IonButton onClick={onSubmitHandle}>create</IonButton>
      </IonItem>
    </>
  );
};

import { IonButton, IonInput, IonItem } from '@ionic/react';
import { addDoc, collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeCard, TypeGroup } from '../../Model/model';
import { useBoardContext } from '../Board/BoardContext';
import { useWorkspaceContext } from '../Workspace/WorkspaceContext';

type props = {
  group : TypeGroup
}

export const GroupCreateCard : React.FC<props> = ({group}) => {
  const {firestore, setRefresh} = useGlobalContext();
  const {workspace} = useWorkspaceContext();
  const {board} = useBoardContext();
  const [cardTitle, setCardTitle] = useState('');

  const onSubmitHandle = async () =>{
    console.log('submitted');
    try {
      const refCard = await addDoc(collection(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Cards), {
        cardTitle: cardTitle,
        cardDescription: '',
        cardCreatedDate: serverTimestamp(),
        cardChecklists: [],
      } as TypeCard);

      const batch = writeBatch(firestore);
      const refGroup = doc(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Groups, group.uid as string);
      batch.update(refGroup, {
        groupCardUids: [
          ...group.groupCardUids,
          refCard.id,
        ],
      } as TypeGroup);
      await batch.commit();
      setRefresh(true);
    } catch (exception) {
      console.info(exception);
    }
  };

  return (
    <>
      <IonItem>
        <IonInput
          type='text'
          placeholder="Name"
          value={cardTitle}
          onIonChange={(e)=>setCardTitle(e.detail.value as string)}/>
        <IonButton onClick={onSubmitHandle}>create</IonButton>
      </IonItem>
    </>
  );
};

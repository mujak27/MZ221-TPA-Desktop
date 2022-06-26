import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel } from '@ionic/react';
import { deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { close } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeCard } from '../../Model/model';
import { useBoardContext } from '../Board/BoardContext';
import { useWorkspaceContext } from '../Workspace/WorkspaceContext';
import { CardChecklists } from './CardChecklists';

type props = {
  card : TypeCard
  exitHandle : () => void
}

export const CardDetail : React.FC<props> = ({card, exitHandle}) => {
  const {firestore, setRefresh} = useGlobalContext();
  const [title, setTitle] = useState(card.cardTitle);
  const [description, setDescription] = useState(card.cardDescription);
  const [checklists, setChecklists] = useState(card.cardChecklists);
  const {workspace} = useWorkspaceContext();
  const {board} = useBoardContext();

  useEffect(()=>{
    console.log('checklists changed');
    console.log(checklists);
  }, [checklists]);

  const onSaveHandle = async () => {
    try {
      const batch = writeBatch(firestore);
      const cardRef = doc(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Cards, card.uid as string);
      batch.update(cardRef, {
        cardTitle: title,
        cardDescription: description,
        cardChecklists: checklists,
      });
      console.log(checklists);
      await batch.commit();
      exitHandle();
    } catch (error) {
      alert(error);
      exitHandle();
    }
  };

  const onDeleteHandle = async ()=>{
    const cardRef = doc(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Cards, card.uid as string);
    await deleteDoc(cardRef);
    setRefresh(true);
  }

  const onExitHandle = () => {
    exitHandle();
  };

  return (
    <>
      <IonIcon onClick={onExitHandle} slot='primary' icon={close} />
      <IonContent>
        <IonItem>
          <IonLabel position="fixed">Name</IonLabel>
          <IonInput
            type='text'
            placeholder="Name"
            value={title}
            onIonChange={(e)=>setTitle(e.detail.value as string)}/>
        </IonItem>
        <IonItem>
          <IonLabel position="fixed">Description</IonLabel>
          <IonInput
            type='text'
            placeholder="Description"
            value={description}
            onIonChange={(e)=>setDescription(e.detail.value as string)} />
        </IonItem>
        <CardChecklists card={card} checklists={checklists} setChecklists={setChecklists}/>
      </IonContent>
      <IonItem>
        <IonButton onClick={onSaveHandle}>save</IonButton>
        <IonButton onClick={onDeleteHandle}>delete</IonButton>
      </IonItem>
    </>
  );
};

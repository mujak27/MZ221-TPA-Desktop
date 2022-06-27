import { IonButton, IonCheckbox, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonTitle } from '@ionic/react';
import { deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { close } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeCard } from '../../Model/model';
import { useBoardContext } from '../Board/BoardContext';
import { useWorkspaceContext } from '../Workspace/WorkspaceContext';
import { CardChecklists } from './CardChecklists';
import { CardComments } from './CardComment';

type props = {
  card : TypeCard
  exitHandle : () => void
}

export const CardDetail : React.FC<props> = ({card, exitHandle}) => {
  const {firestore, user, setRefresh} = useGlobalContext();
  const [title, setTitle] = useState(card.cardTitle);
  const [description, setDescription] = useState(card.cardDescription);
  const [checklists, setChecklists] = useState(card.cardChecklists);
  const [watch, setWatch] = useState(card.cardWatchers.includes(user.uid as string));
  const {workspace} = useWorkspaceContext();
  const {board} = useBoardContext();

  useEffect(()=>{
    console.log('checklists changed');
    console.log(checklists);
  }, [checklists]);

  const onSaveHandle = async () => {
    try {
      let cardWatchers = card.cardWatchers;
      if(watch) {
        if(!cardWatchers.includes(user.uid as string)) 
          cardWatchers.push(user.uid as string);
      }else{
        cardWatchers = cardWatchers.filter((cardWatcher)=>{
          if(cardWatcher == user.uid as string) return false;
          return true;
        })
      }
      const batch = writeBatch(firestore);
      const cardRef = doc(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Cards, card.uid as string);
      batch.update(cardRef, {
        cardTitle: title,
        cardDescription: description,
        cardChecklists: checklists,
        cardWatchers: cardWatchers,
      } as TypeCard);
      await batch.commit();
      exitHandle();
      setRefresh(true);
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
      <IonContent>
        <IonItem>
          <IonButton onClick={onExitHandle} >
            <IonIcon icon={close} />
          </IonButton>
          <IonTitle>edit card</IonTitle>
        </IonItem>
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
        <IonItem>
          <IonCheckbox checked={watch} onIonChange={(e)=>{setWatch(e.detail.checked)}} />
          <IonLabel className='ion-padding-horizontal'>watch this card</IonLabel>
        </IonItem>
        <CardChecklists card={card} checklists={checklists} setChecklists={setChecklists}/>
        <CardComments card={card} />
      </IonContent>
      <IonItem>
        <IonButton onClick={onSaveHandle}>save</IonButton>
        <IonButton onClick={onDeleteHandle}>delete</IonButton>
      </IonItem>
    </>
  );
};

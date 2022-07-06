import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonModal } from '@ionic/react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { close } from 'ionicons/icons';
import { default as React, useState } from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { BoardStatus, BoardVisibility, Tables, TypeBoard, TypeMember } from '../../Model/model';
import { useWorkspaceContext } from './WorkspaceContext';

type props = {
}

const WorkspaceCreateBoard : React.FC<props> = ({}) => {
  const globalContext = useGlobalContext();
  const firestore = globalContext.firestore;
  const user = globalContext.user;
  const [showCreate, setShowCreate] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const {workspace} = useWorkspaceContext();

  const onSubmitHandle = async () =>{
    try {
      const refBoard = await addDoc(collection(firestore, Tables.Boards ), {
        boardName: boardName,
        boardDescription: boardDescription,
        boardMembers: [user.userUid],
        boardVisibility: BoardVisibility.Board,
        boardStatus: BoardStatus.Open,
        boardCreatedDate: serverTimestamp(),
        boardGroupUids: [],
        boardLogs: [],
        boardDeleteRequest: [],
        boardWorkspaceUid: workspace.uid,
        boardFavoritedBy: [],
      } as TypeBoard);
      await addDoc(collection(firestore, Tables.Boards, refBoard.id, Tables.Members ), {
        userUid: user.userUid,
        isAdmin: true,
        isOwner: true,
      } as TypeMember);
      setShowCreate(false);
    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <>
      <IonButton onClick={()=>setShowCreate(true)}>Create Board</IonButton>
      <IonModal isOpen={showCreate} onDidDismiss={()=>setShowCreate(false)}>
        <IonIcon onClick={()=>setShowCreate(false)} slot='primary' icon={close} />
        <IonContent>
          <IonItem>
            <IonLabel position="fixed">Name</IonLabel>
            <IonInput
              type='text'
              placeholder="Name"
              value={boardName}
              onIonChange={(e)=>setBoardName(e.detail.value as string)}/>
          </IonItem>
          <IonItem>
            <IonLabel position="fixed">Description</IonLabel>
            <IonInput
              type='text'
              placeholder="Description"
              value={boardDescription}
              onIonChange={(e)=>setBoardDescription(e.detail.value as string)} />
          </IonItem>
        </IonContent>
        <IonButton onClick={onSubmitHandle}>create board</IonButton>
      </IonModal>
    </>
  );
};


export default WorkspaceCreateBoard;

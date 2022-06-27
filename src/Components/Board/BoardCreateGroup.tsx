import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonModal } from '@ionic/react';
import { addDoc, collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { close } from 'ionicons/icons';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeBoard, TypeGroup } from '../../Model/model';
import { useWorkspaceContext } from '../Workspace/WorkspaceContext';
import { useBoardContext } from './BoardContext';

type props = {
}

export const BoardCreateGroup : React.FC<props> = ({}) => {
  const {firestore, setRefresh} = useGlobalContext();
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState('');
  const {workspace} = useWorkspaceContext();
  const {board} = useBoardContext();

  const onSubmitHandle = async () =>{
    try {
      const refGroup = await addDoc(collection(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Groups), {
        groupName: groupName,
        groupCreatedDate: serverTimestamp(),
        groupCardUids: [],
      } as TypeGroup);

      const batch = writeBatch(firestore);
      const refBoard = doc(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string);
      batch.update(refBoard, {
        boardGroupUids: [
          refGroup.id,
          ...board.boardGroupUids,
        ],
      } as TypeBoard);
      await batch.commit();
      alert('success creating group');
      setShowCreate(false);
      setRefresh(true);
    } catch (exception) {
      alert(exception);
    }
  };

  return (
    <>
      <IonButton onClick={()=>setShowCreate(true)}>Create Group</IonButton>
      <IonModal isOpen={showCreate} onDidDismiss={()=>setShowCreate(false)}>
        <IonIcon onClick={()=>setShowCreate(false)} slot='primary' icon={close} />
        <IonContent>
          <IonItem>
            <IonLabel position="fixed">Name</IonLabel>
            <IonInput
              type='text'
              placeholder="Name"
              value={groupName}
              onIonChange={(e)=>setGroupName(e.detail.value as string)}/>
          </IonItem>
        </IonContent>
        <IonButton onClick={onSubmitHandle}>create group</IonButton>
      </IonModal>
    </>
    // <div>
    //   <input type='text' name='' value={groupName} onChange={(e)=>setGroupName(e.target.value)} />
    //   <button onClick={onSubmitHandle}> create group!</button>
    // </div>
  );
};

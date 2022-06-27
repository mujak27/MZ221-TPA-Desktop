import { IonButton, IonIcon, IonItem, IonModal, IonText, IonTitle } from '@ionic/react';
import { doc, writeBatch } from 'firebase/firestore';
import { close, mail } from 'ionicons/icons';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { useGlobalContext } from '../../../context/ContextProvider';
import { Tables, TypeWorkspace } from '../../../Model/model';
import { useWorkspaceContext } from '../WorkspaceContext';

type props = {
  showModal : boolean,
  setShowModal : React.Dispatch<React.SetStateAction<boolean>>,
}

export const WorkspaceLogs : React.FC<props> = ({showModal, setShowModal}) => {
  const {firestore, setRefresh} = useGlobalContext();
  const {workspace, userWorkspace: currentUser} = useWorkspaceContext();
  const [logs, setLogs] = useState(workspace.workspaceLogs);

  const onRemoveHandle = async (index : number)=>{
    const newLogs = Array.from(logs);
    newLogs.splice(index);
    setLogs(newLogs);
    const batch = writeBatch(firestore);
    const refWorkspace = doc(firestore, Tables.Workspaces, workspace.uid as string);
    batch.update(refWorkspace, {
      workspaceLogs: newLogs
    } as TypeWorkspace);
    await batch.commit();
    setRefresh(true);
  }

  return (
    <>
      <IonButton color="primary" onClick={()=>setShowModal(true)}>
        <IonIcon slot="icon-only" icon={mail} />
      </IonButton>
      <IonModal isOpen={showModal} onDidDismiss={()=>setShowModal(false)}>
        {
          logs.length ?
          logs.map((log, index)=>{
            return (  
              <IonItem key={nanoid()}>
                {
                  currentUser &&
                  currentUser.isAdmin?
                    (
                      <IonButton  onClick={()=>onRemoveHandle(index)}>
                        <IonIcon icon={close} />
                      </IonButton>
                    ):null
                }
                <IonText>{log}</IonText>
              </IonItem>
            )
          }) : <IonItem><IonTitle>nothing here yet...</IonTitle></IonItem>
        }
      </IonModal>
    </>
  );
};

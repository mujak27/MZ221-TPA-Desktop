import { IonButton, IonIcon, IonItem, IonModal, IonText, IonTitle } from '@ionic/react';
import { doc, writeBatch } from 'firebase/firestore';
import { close, mail } from 'ionicons/icons';
import { nanoid } from 'nanoid';
import React from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeWorkspace } from '../../Model/model';
import { useWorkspaceContext } from './WorkspaceContext';

type props = {
  showModal : boolean,
  setShowModal : React.Dispatch<React.SetStateAction<boolean>>,
}

export const WorkspaceLogs : React.FC<props> = ({showModal, setShowModal}) => {
  const {firestore, setRefresh} = useGlobalContext();
  const {workspace, currentUser} = useWorkspaceContext();

  const onRemoveHandle = async (index : number)=>{
    const newLogs = workspace.workspaceLogs
    newLogs.splice(index);
    console.info(newLogs);
    const batch = writeBatch(firestore);
    const cardRef = doc(firestore, Tables.Workspaces, workspace.uid as string);
    batch.update(cardRef, {
      workspaceLogs: newLogs
    } as TypeWorkspace);
    await batch.commit();
    console.info('updated');
    setRefresh(true);
  }



  return (
    <>
      <IonButton color="primary" onClick={()=>setShowModal(true)}>
        <IonIcon slot="icon-only" icon={mail} />
      </IonButton>
      <IonModal isOpen={showModal} onDidDismiss={()=>setShowModal(false)}>
        {
          workspace.workspaceLogs.length  ?
          workspace.workspaceLogs.map((log, index)=>{
            return (  
              <IonItem key={nanoid()}>
                <IonText>{log}</IonText>
                {
                  currentUser.isAdmin?
                    (
                      <IonButton  onClick={()=>onRemoveHandle(index)}>
                        <IonIcon icon={close} />
                      </IonButton>
                    ):null
                }
              </IonItem>
            )
          }) : <IonItem><IonTitle>nothing here yet...</IonTitle></IonItem>
        }
      </IonModal>
    </>
  );
};

import { IonButton, IonIcon, IonItem, IonModal, IonTitle } from '@ionic/react';
import { deleteDoc, doc } from 'firebase/firestore';
import { checkmarkCircle, closeCircle, trash } from 'ionicons/icons';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables } from '../../Model/model';
import { useWorkspaceContext } from './WorkspaceContext';


type props = {
  showModal : boolean,
  setShowModal : React.Dispatch<React.SetStateAction<boolean>>,
}

export const WorkspaceDelete : React.FC<props> = () => {
  const firestore = useGlobalContext().firestore;
  const {workspace} = useWorkspaceContext();
  const [showDelete, setShowDelete] = useState(false);
  const {history} = useGlobalContext();
  const {setRefresh} = useGlobalContext();


  const onDelete = ()=>{
    const refWorkspace = doc(firestore, Tables.Workspaces, workspace.uid as string);
    deleteDoc(refWorkspace);
    setRefresh(true);
    history.push('/workspace');
  };

  return (
    <>
      <IonButton color="primary" onClick={()=>setShowDelete(true)}>
        <IonIcon slot="icon-only" icon={trash} />
      </IonButton>
      <IonModal isOpen={showDelete}>
        <IonTitle className='ion-text-center'>
          Delete workspace {workspace.workspaceName}?
        </IonTitle>
        <IonItem style={{width: '100%'}}>
          <IonButton color='primary' onClick={()=>setShowDelete(false)}>
            <IonIcon icon={closeCircle} />
          </IonButton>
          <IonButton color='danger' onClick={onDelete}>
            <IonIcon icon={checkmarkCircle} />
          </IonButton>
        </IonItem>
      </IonModal>
    </>
  );
};

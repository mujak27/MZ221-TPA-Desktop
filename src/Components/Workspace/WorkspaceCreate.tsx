import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonModal } from '@ionic/react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { close } from 'ionicons/icons';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeMember, TypeWorkspace, WorkspaceVisibility } from '../../Model/model';

type props = {
}

export const WorkspaceCreate : React.FC<props> = ({}) => {
  const globalContext = useGlobalContext();
  const firestore = globalContext.firestore;
  const userUid = globalContext.user.userUid;
  const [showCreate, setShowCreate] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');

  const onSubmitHandle = async () =>{
    try {
      const refWorkspace = await addDoc(collection(firestore, Tables.Workspaces), {
        workspaceName: workspaceName,
        workspaceDescription: workspaceDescription,
        workspaceVisibility: WorkspaceVisibility.Workspace,
        workspaceCreatedDate: serverTimestamp(),
        workspaceMembers: [userUid],
      } as TypeWorkspace);
      await addDoc(collection(firestore, Tables.Workspaces, refWorkspace.id, Tables.Members), {
        userUid: userUid,
        isAdmin: true,
        isOwner: true,
      } as TypeMember);
      setShowCreate(false);
    } catch (exception) {
      alert('failed : ' + exception);
    }
  };

  return (
    <>
      <IonButton onClick={()=>setShowCreate(true)}>crete new workspace</IonButton>
      <IonModal isOpen={ showCreate } onDidDismiss={()=>setShowCreate(false)} >
        <IonIcon onClick={()=>setShowCreate(false)} slot='primary' icon={close} />
        <IonContent>
          <IonItem>
            <IonLabel position="fixed">Name</IonLabel>
            <IonInput
              type='text'
              placeholder="Name"
              value={workspaceName}
              onIonChange={(e)=>setWorkspaceName(e.detail.value as string)}/>

          </IonItem>
          <IonItem>
            <IonLabel position="fixed">Description</IonLabel>
            <IonInput
              type='text'
              placeholder="Description"
              value={workspaceDescription}
              onIonChange={(e)=>setWorkspaceDescription(e.detail.value as string)} />
          </IonItem>
        </IonContent>
        <IonButton onClick={onSubmitHandle}>create workspace</IonButton>
      </IonModal>
    </>
  );
};

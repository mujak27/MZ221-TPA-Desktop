/* eslint-disable no-unused-vars */
import { IonButton, IonCard, IonCardContent, IonCardTitle } from '@ionic/react';
import { addDoc, collection, DocumentReference, writeBatch } from 'firebase/firestore';
import React from 'react';
import { useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { getPath } from '../../Helper';
import { Tables, TypeMember, TypeWorkspace } from '../../Model/model';

type props = {
  refWorkspace : DocumentReference,
}

export const JoinWorkspace : React.FC<props> = ({refWorkspace}) => {
  const {user, firestore, history, setRefresh} = useGlobalContext();
  const {status: statusWorkspace, data: resWorkspace} = useFirestoreDocData(refWorkspace, {
    idField: 'uid',
  });

  if (statusWorkspace === 'loading') {
    return <>loading workspace data...</>;
  }

  const workspace = resWorkspace as TypeWorkspace;

  const onJoinHandle = async ()=>{
    try {
      console.info('join11');
      console.info(user);
      console.info(user.userUid);
      const docRef = refWorkspace;
      const path = getPath(docRef);
      path.push(Tables.Members);
      // @ts-ignore
      const refMembers = collection(firestore, ...(path));
      await addDoc(refMembers, {
        isAdmin: false,
        isOwner: false,
        userUid: user.userUid,
      } as TypeMember);
      const batch = writeBatch(firestore);
      batch.update(docRef, {
        workspaceMembers: [
          ...workspace.workspaceMembers,
          user.userUid,
        ],
        workspaceLogs : [
          ...workspace.workspaceLogs,
          `${user.userName} has joined this workspace!`
        ]
      } as TypeWorkspace);
      await batch.commit();
      alert('joined');
      history.push('/workspace/' + workspace.uid as string);
      setRefresh(true);
    } catch (e) {
      alert(e);
    }
  };

  const redirectToWorkspace = ()=>{
    history.push('/workspace/' + workspace.uid as string);
    setRefresh(true);
  }

  if(workspace.workspaceMembers.includes(user.userUid)){
    return (
      <IonCard className='ion-padding'>
        <IonCardTitle>
          you are already a member of workspace {workspace.workspaceName}
        </IonCardTitle>
        <IonCardContent>
          <IonButton onClick={redirectToWorkspace}>redirect to workspace {workspace.workspaceName}</IonButton>
        </IonCardContent>
      </IonCard>
    )
  }

  return (
    <IonCard className='ion-padding'>
      <IonCardTitle>
        you have been invited to join and collaborate to workspace {workspace.workspaceName}
      </IonCardTitle>
      <IonCardContent>
        <IonButton onClick={onJoinHandle}>
          join
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

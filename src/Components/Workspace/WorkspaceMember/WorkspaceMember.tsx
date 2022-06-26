import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonModal, IonRow, IonTitle } from '@ionic/react';
import { collection } from 'firebase/firestore';
import { closeCircle, peopleCircle } from 'ionicons/icons';
import React, { useState } from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../../context/ContextProvider';
import { Tables, TypeMember } from '../../../Model/model';
import { useWorkspaceContext } from '../WorkspaceContext';
import { WorkspaceMemberDelete } from './WorkspaceMemberDelete';
import { WorkspaceMemberInvite } from './WorkspaceMemberInvite';

type props = {
  showModal : boolean,
  setShowModal : React.Dispatch<React.SetStateAction<boolean>>,
}

export enum Tabs {
  // eslint-disable-next-line no-unused-vars
  Invite = 'Invite',
  // eslint-disable-next-line no-unused-vars
  Delete = 'Delete',
}

export const WorkspaceMember : React.FC<props> = ({showModal, setShowModal}) => {
  const {firestore} = useGlobalContext();
  const {workspace} = useWorkspaceContext();
  const [tab, setTab] = useState<Tabs>(Tabs.Invite);
  const workspaceUid = workspace.uid as string;

  const refMembers = collection(firestore, Tables.Workspaces, workspaceUid, Tables.Members );
  const {status: statusMembers, data: resMembers} = useFirestoreCollectionData(refMembers, {
    idField: 'uid',
  });


  if (statusMembers === 'loading') {
    return <>loading members data...</>;
  }

  const members = resMembers as Array<TypeMember>;
  console.info(members);


  return (
    <>
      <IonButton color='primary' onClick={()=>setShowModal(true)}>
        <IonIcon icon={peopleCircle}/>
      </IonButton>
      <IonModal isOpen={showModal} onDidDismiss={()=>setShowModal(false)}>
        <IonItem>
          <IonButton onClick={()=>setShowModal(false)}>
            <IonIcon icon={closeCircle} />
          </IonButton>
          <IonTitle>manage members here</IonTitle>
        </IonItem>
        <IonContent>
          <IonGrid>
            <IonRow>
              <IonCol size='6'>
                <IonButton onClick={()=>setTab(Tabs.Invite)}>
                  invite
                </IonButton>
              </IonCol>
              <IonCol size='6'>
                <IonButton onClick={()=>setTab(Tabs.Delete)}>
                  manage
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          {/* <IonList> */}
          {tab == Tabs.Invite ?(
              <>
                <WorkspaceMemberInvite />
              </>
            ):(
              <>
                <WorkspaceMemberDelete />
              </>
            )
          }
          {/* </IonList> */}
        </IonContent>
      </IonModal>
    </>
  );
};

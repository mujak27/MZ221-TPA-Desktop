import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { collection } from 'firebase/firestore';
import { peopleCircle } from 'ionicons/icons';
import React, { useState } from 'react';
import { useRouteMatch } from 'react-router';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeMember } from '../../Model/model';
import { useWorkspaceContext } from './WorkspaceContext';

type props = {
  showModal : boolean,
  setShowModal : React.Dispatch<React.SetStateAction<boolean>>,
}

type _props ={

}

const workspaceManageMemberInvite : React.FC<_props> = ({})=>{
  return (
    <IonHeader>
      <>invite</>
    </IonHeader>
  );
};


const workspaceManageMemberDelete : React.FC<_props> = ({})=>{
  return (
    <IonHeader>
      <>Delete</>
    </IonHeader>
  );
};

enum Tabs {
  invite = 'invite',
  delete = 'delete',
}

export const WorkspaceManageMember : React.FC<props> = ({showModal, setShowModal}) => {
  const {firestore} = useGlobalContext();
  const {workspace} = useWorkspaceContext();
  const [tab, setTab] = useState<Tabs>(Tabs.invite);
  const workspaceUid = workspace.uid as string;
  const match = useRouteMatch();
  console.info(match);

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
          <IonButton onClick={()=>setShowModal(false)}></IonButton>
        </IonItem>
        <IonHeader>
          <IonTitle>manage members here</IonTitle>
        </IonHeader>
        <IonContent>
          <IonToolbar slot=''>
            <IonButton onClick={()=>setTab(Tabs.invite)}>
              invite
            </IonButton>
            <IonButton onClick={()=>setTab(Tabs.delete)}>
              delete
            </IonButton>
          </IonToolbar>
          {tab == Tabs.invite ? (<>invite</>) : (<>delete</>)}
        </IonContent>
      </IonModal>
    </>
  );
};

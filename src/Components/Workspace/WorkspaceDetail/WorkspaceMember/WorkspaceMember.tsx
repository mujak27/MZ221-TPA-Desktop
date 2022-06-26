import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonModal, IonRow, IonTitle } from '@ionic/react';
import { closeCircle, peopleCircle } from 'ionicons/icons';
import React, { useState } from 'react';
import { WorkspaceMemberInvite } from './WorkspaceMemberInvite';
import { WorkspaceMemberManage } from './WorkspaceMemberManage';

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
  const [tab, setTab] = useState<Tabs>(Tabs.Invite);

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
                <WorkspaceMemberManage />
              </>
            )
          }
          {/* </IonList> */}
        </IonContent>
      </IonModal>
    </>
  );
};

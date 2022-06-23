import { IonContent, IonHeader, IonItem, IonText, IonTitle } from '@ionic/react';
import React, { useState } from 'react';
import { WorkspaceBoards } from './WorkspaceBoards';
import { useWorkspaceContext } from './WorkspaceContext';
import { WorkspaceDelete } from './WorkspaceDelete';
import { WorkspaceManageMember } from './WorkspaceManageMember';


type props = {

}

export const WorkspaceDetail : React.FC<props> = () => {
  const {workspace} = useWorkspaceContext();
  const [showDelete, setShowDelete] = useState(false);
  const [showManageMember, setShowManageMember] = useState(false);

  return (
    <>
      <IonHeader>
        <IonItem>
          <IonTitle size='large'>
            <h2>
              {workspace.workspaceName}
            </h2>
          </IonTitle>
          <WorkspaceManageMember showModal={showManageMember} setShowModal={setShowManageMember} />
          <WorkspaceDelete showModal={showDelete} setShowModal={setShowDelete} />
        </IonItem>
      </IonHeader>
      <IonContent >
        <div className='ion-padding-vertical'>
          <IonTitle>
            <h3>
            Description
            </h3>
          </IonTitle>
          <IonText className='ion-padding-start'>{workspace.workspaceDescription}</IonText> <br/>
        </div>
        <WorkspaceBoards/>
      </IonContent>
    </>
  );
};

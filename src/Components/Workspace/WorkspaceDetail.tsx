import { IonContent, IonHeader, IonItem, IonText, IonTitle } from '@ionic/react';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { useGlobalContext } from '../../context/ContextProvider';
import { WorkspaceBoards } from './WorkspaceBoards';
import { useWorkspaceContext } from './WorkspaceContext';
import { WorkspaceLeave } from './WorkspaceLeave';
import { WorkspaceLogs } from './WorkspaceLogs';
import { WorkspaceMember } from './WorkspaceMember/WorkspaceMember';
import { WorkspaceSettings } from './WorkspaceSettings';


type props = {

}

export const WorkspaceDetail : React.FC<props> = () => {
  const {setRefresh, history} = useGlobalContext();
  const {workspace, currentUser} = useWorkspaceContext();
  const [showSettings, setShowSettings] = useState(false);
  const [showManageMember, setShowManageMember] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showLeave, setShowLeave] = useState(false);

  console.info(currentUser);

  console.info(workspace);

  if(workspace == undefined){
    history.push('/workspace');
    console.info('woww');
    setRefresh(true);
    return <Redirect to={'/workspace'} />
  }

  return (
    <>
      <IonHeader>
        <IonItem>
          <IonTitle size='large'>
            <h2>
              {workspace.workspaceName}
            </h2>
          </IonTitle>
          <WorkspaceLeave showModal={showLeave} setShowModal={setShowLeave} />
          <WorkspaceLogs showModal={showLogs} setShowModal={setShowLogs} />
          {currentUser.isAdmin ?
            (
              <>
                <WorkspaceMember showModal={showManageMember} setShowModal={setShowManageMember} />
                <WorkspaceSettings showModal={showSettings} setShowModal={setShowSettings} />
              </>
            ):null
          }
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

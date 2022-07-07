import { IonContent, IonHeader, IonItem, IonText, IonTitle } from '@ionic/react';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { useGlobalContext } from '../../../context/ContextProvider';
import { WorkspaceBoards } from '../WorkspaceBoards';
import { useWorkspaceContext } from '../WorkspaceContext';
import { WorkspaceLeave } from './WorkspaceLeave';
import { WorkspaceLogs } from './WorkspaceLogs';
import { WorkspaceMember } from './WorkspaceMember/WorkspaceMember';
import { WorkspaceSettings } from './WorkspaceSettings';


type props = {

}

export const WorkspaceDetail : React.FC<props> = () => {
  const {setRefresh, history, user} = useGlobalContext();
  const {workspace} = useWorkspaceContext();
  const [showSettings, setShowSettings] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showLeave, setShowLeave] = useState(false);

  if(workspace == undefined){
    history.push('/workspace');
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
          <WorkspaceLogs showModal={showLogs} setShowModal={setShowLogs} />
          {
            workspace.workspaceMembers.includes(user.userUid) ?
            <WorkspaceLeave showModal={showLeave} setShowModal={setShowLeave} /> :
            null
          }
          {
            workspace.workspaceAdmins.includes(user.userUid) ?
            (
              <>
                <WorkspaceMember showModal={showMember} setShowModal={setShowMember} />
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

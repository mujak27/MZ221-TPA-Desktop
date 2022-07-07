import { IonList, IonListHeader } from '@ionic/react';
import { nanoid } from 'nanoid';
import React from 'react';
import { useGlobalContext } from '../../../../context/ContextProvider';
import { useWorkspaceContext } from '../../WorkspaceContext';
import { WorkspaceMemberItem } from './WorkspaceMemberItem';

type props = {

}

export const WorkspaceMemberManage : React.FC<props> = ({})=>{
  const {user} = useGlobalContext();
  const {workspace} = useWorkspaceContext();

  return (
    <>
      <IonListHeader>
        <>Mange existing member</>
      </IonListHeader>
      <IonList>
        {
          workspace.workspaceMembers.map((workspaceMember)=>{
            if (workspaceMember == user.userUid) return null;
            return (<WorkspaceMemberItem key={nanoid()}  memberUid={workspaceMember} />);
          })
        }
      </IonList>
    </>
  );
};

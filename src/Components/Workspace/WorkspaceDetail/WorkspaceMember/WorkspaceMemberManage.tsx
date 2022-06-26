import { IonList, IonListHeader } from '@ionic/react';
import { collection } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../../../context/ContextProvider';
import { Tables, TypeMember } from '../../../../Model/model';
import { useWorkspaceContext } from '../../WorkspaceContext';
import { WorkspaceMemberItem } from './WorkspaceMemberItem';

type props = {

}

export const WorkspaceMemberManage : React.FC<props> = ({})=>{
  const {firestore, user} = useGlobalContext();
  const {workspace} = useWorkspaceContext();

  const refWorkspaceMembers = collection(firestore, Tables.Workspaces, workspace.uid as string, Tables.Members);
  const {status: statusWorkspaceMember, data: resWorkspaceMembers} = useFirestoreCollectionData(refWorkspaceMembers, {
    idField: 'uid',
  });

  if (statusWorkspaceMember === 'loading') {
    return <IonListHeader>retrieving data...</IonListHeader>;
  }

  const workspaceMembers = resWorkspaceMembers as Array<TypeMember>;

  return (
    <>
      <IonListHeader>
        <>Mange existing member</>
      </IonListHeader>
      <IonList>
        {
          workspaceMembers.map((workspaceMember)=>{
            if (workspaceMember.userUid == user.userUid) return null;
            return (<WorkspaceMemberItem key={nanoid()} member={workspaceMember} userUid={workspaceMember.userUid} />);
          })
        }
      </IonList>
    </>
  );
};

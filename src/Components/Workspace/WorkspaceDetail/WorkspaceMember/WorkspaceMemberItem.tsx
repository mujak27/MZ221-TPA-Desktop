import { IonButton, IonItem } from '@ionic/react';
import { collection, doc, query, where, writeBatch } from 'firebase/firestore';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../../../context/ContextProvider';
import { KeyUser, Tables, TypeUser, TypeWorkspace } from '../../../../Model/model';
import { useWorkspaceContext } from '../../WorkspaceContext';

type props = {
  memberUid : string,
}

export const WorkspaceMemberItem : React.FC<props> = ({memberUid})=>{
  const {firestore} = useGlobalContext();
  const {workspace} = useWorkspaceContext();

  const refWorkspace = doc(firestore, Tables.Workspaces, workspace.uid as string);

  const refUsers = collection(firestore, Tables.Users);
  const {status: statusUsers, data: resUsers} = useFirestoreCollectionData(query(
      refUsers,
      where(KeyUser.userUid, '==', memberUid),
  ), {
    idField: 'uid',
  });
  
  if (statusUsers === 'loading') {
    return <IonItem>retrieving data...</IonItem>;
  }

  const user = (resUsers as Array<TypeUser>)[0];
    console.info(resUsers);

  const onKickHandle = async ()=>{
    try {
      const batch = writeBatch(firestore);
      batch.update(refWorkspace, {
        workspaceMembers:
          workspace.workspaceMembers.filter((member)=>{
            if (member == memberUid as string) return false;
            return true;
          }),
      } as TypeWorkspace);
      await batch.commit();
      alert('removed');
    } catch (e) {
      alert(e);
    }
  };


  const onSetAdminHandle = async ()=>{
    try {
      const batch = writeBatch(firestore);
      const newWorkspaceAdmins = Array .from(workspace.workspaceAdmins);
      newWorkspaceAdmins.push(memberUid);
      batch.update(refWorkspace, {
        workspaceAdmins : newWorkspaceAdmins,
      } as TypeWorkspace);
      await batch.commit();
      alert('success');
    } catch (e) {
      alert(e);
    }
  };

  const onRevokeAdminHandle = async ()=>{
    try {
      const batch = writeBatch(firestore);
      const newWorkspaceAdmins = Array .from(workspace.workspaceAdmins).filter((admin)=> {return admin!=memberUid});
      batch.update(refWorkspace, {
        workspaceAdmins : newWorkspaceAdmins,
      } as TypeWorkspace);
      await batch.commit();
      alert('success');
    } catch (e) {
      alert(e);
    }
  }

  return (
    <IonItem>
      {user.userName}
      {!workspace.workspaceAdmins.includes(user.userUid) ?
        (
          <>
            <IonButton color='danger' onClick={onKickHandle}>kick</IonButton>
            <IonButton color='primary' onClick={onSetAdminHandle}>set admin</IonButton>
          </>
            ) : <IonButton color='danger' onClick={onRevokeAdminHandle}>revoke</IonButton>
      }
    </IonItem>
  );
};

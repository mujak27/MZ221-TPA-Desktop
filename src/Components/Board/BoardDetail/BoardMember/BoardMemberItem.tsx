import { IonButton, IonItem } from '@ionic/react';
import { collection, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../../../context/ContextProvider';
import { KeyUser, Tables, TypeMember, TypeUser, TypeWorkspace } from '../../../../Model/model';
import { useWorkspaceContext } from '../../../Workspace/WorkspaceContext';

type props = {
  member : TypeMember,
  userUid : string,
}

export const BoardMemberItem : React.FC<props> = ({member, userUid})=>{
  const {firestore} = useGlobalContext();
  const {workspace} = useWorkspaceContext();


  const refUsers = collection(firestore, Tables.Users);
  const {status: statusUsers, data: resUsers} = useFirestoreCollectionData(query(
      refUsers,
      where(KeyUser.userUid, '==', userUid),
  ), {
    idField: 'uid',
  });

  if (statusUsers === 'loading') {
    return <IonItem>retrieving data...</IonItem>;
  }

  const user = (resUsers as Array<TypeUser>)[0];

  const onKickHandle = async ()=>{
    try {
      await deleteDoc(doc(firestore, Tables.Workspaces, workspace.uid as string, Tables.Members, member.uid as string));
      const refWorkspace = doc(firestore, Tables.Workspaces, workspace.uid as string);
      const batch = writeBatch(firestore);
      batch.update(refWorkspace, {
        workspaceMembers:
          workspace.workspaceMembers.filter((memberUid)=>{
            if (memberUid == member.userUid as string) return false;
            return true;
          }),
      } as TypeWorkspace);
      await batch.commit();
      alert('removed');
    }catch(e){
      alert(e);
    }
  };


  const onSetAdminHandle = async ()=>{
    try {
      const batch = writeBatch(firestore);
      const refMember = doc(firestore, Tables.Workspaces, workspace.uid as string, Tables.Members, member.uid as string);
      batch.update(refMember, {
        isAdmin: true,
      } as TypeMember);
      await batch.commit();
      alert('success');
    } catch (e) {
      alert(e);
    }
  };

  return (
    <IonItem>
      {user.userName}
      {!member.isAdmin ?
        (
          <>
            <IonButton color='danger' onClick={onKickHandle}>kick</IonButton>
            <IonButton color='primary' onClick={onSetAdminHandle}>set admin</IonButton>
          </>
            ) : <IonButton disabled color='medium'>admin</IonButton>
      }
    </IonItem>
  );
};

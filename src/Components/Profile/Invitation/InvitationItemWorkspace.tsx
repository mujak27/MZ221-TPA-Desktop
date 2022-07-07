/* eslint-disable no-unused-vars */
import { IonButton, IonItem } from '@ionic/react';
import { collection, writeBatch } from 'firebase/firestore';
import React from 'react';
import { useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../../../context/ContextProvider';
import { getPath } from '../../../Helper';
import { Tables, TypeInvitation, TypeWorkspace } from '../../../Model/model';

type props = {
  invitation : TypeInvitation
}

export const InvitationItemWorkspace : React.FC<props> = ({invitation}) => {
  const {user, firestore} = useGlobalContext();
  const workspaceRef = invitation.itemRef;

  const {status: statusWorkspace, data: resWorkspace} = useFirestoreDocData(workspaceRef, {
    idField: 'uid',
  });

  if (statusWorkspace === 'loading') {
    return <>loading...</>;
  }
  if (resWorkspace === undefined) return null;

  const workspace = resWorkspace as TypeWorkspace;

  // useEffect(()=>{
  //   if (workspace.workspaceMembers.includes(user.userUid)) {
  //     const f = ()=>{
  //       const refUser = doc(firestore, Tables.Users, user.userUid);
  //       const batch = writeBatch(firestore);
  //       batch.update(refUser, {
  //         userInvitation : [
  //           ...(user.userInvitation.filter((invitation)=>{
  //             if(invitation.itemUid == workspace.uid as string) return false
  //             return true;
  //           }))
  //         ]
  //       } as TypeUser);
  //       batch.commit();
  //       setRefresh(true);
  //       return null;
  //     }
  //     f();
  //   }
  // }, []);

  const onClickHandle = async ()=>{
    try {
      const docRef = invitation.itemRef;
      const path = getPath(docRef);
      path.push(Tables.Members);
      // @ts-ignore
      const refMembers = collection(firestore, ...path);
      const batch = writeBatch(firestore);
      batch.update(docRef, {
        workspaceMembers: [
          ...workspace.workspaceMembers,
          user.userUid,
        ],
        workspaceLogs : [
          ...workspace.workspaceLogs,
          `${user.userName} has joined this workspace!`
        ]
      } as TypeWorkspace);
      await batch.commit();
      alert('joined');
    } catch (e) {
      alert(e);
    }
  };

  return (
    <IonItem>
      invitation to join to workspace {workspace.workspaceName}
      <IonButton onClick={onClickHandle}>join</IonButton>
    </IonItem>
  );
};

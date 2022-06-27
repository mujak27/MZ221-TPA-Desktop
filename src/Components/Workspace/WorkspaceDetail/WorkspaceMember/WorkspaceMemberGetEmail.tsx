import { IonButton } from '@ionic/react';
import { collection, doc, DocumentReference, query, where, writeBatch } from 'firebase/firestore';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../../../context/ContextProvider';
import { EnumItemType, KeyUser, Tables, TypeUser, TypeInvitation } from '../../../../Model/model';
import { useWorkspaceContext } from '../../WorkspaceContext';

type props = {
  userEmail: string,
  itemUid : string,
  itemRef : DocumentReference,
}

export const WorkspaceMemberGetEmail : React.FC<props> = ({userEmail, itemUid, itemRef: refWorkspace}) => {
  const {firestore} = useGlobalContext();
  const {workspace} = useWorkspaceContext();

  const refUsers = collection(firestore, Tables.Users );
  const {status: statusUsers, data: resUsers} = useFirestoreCollectionData(query(
      refUsers,
      where(KeyUser.userEmail, '==', userEmail),
  ), {
    idField: 'uid',
  });

  if (statusUsers === 'loading') {
    return <>loading user data...</>;
  }
  if ((resUsers as Array<TypeUser>).length==0) {
    return <>not found</>;
  }

  const user = (resUsers as Array<TypeUser>)[0];
  const invited = workspace.workspaceMembers.includes(user.uid as string);

  const onInviteHandle = async () => {
    const batch = writeBatch(firestore);
    const refUser = doc(firestore, Tables.Users, user.uid as string);
    batch.update(refUser, {
      userInvitation: [
        ...user.userInvitation,
        {
          itemUid: itemUid,
          invitationType: EnumItemType.Workspace,
          itemRef: refWorkspace,
        } as TypeInvitation,
      ],
    } as TypeUser);
    await batch.commit();
    alert('invitation sent!');
  };

  return (
    <>
      {user.userName}
      {
        !invited ?
        <IonButton onClick={onInviteHandle}>invite</IonButton>:
        <IonButton disabled color='medium'>already joined</IonButton>

      }
    </>
  );
};

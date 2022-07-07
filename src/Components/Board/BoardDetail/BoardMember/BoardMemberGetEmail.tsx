import { IonButton } from '@ionic/react';
import { collection, doc, DocumentReference, query, where, writeBatch } from 'firebase/firestore';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../../../context/ContextProvider';
import { EnumItemType, KeyUser, Tables, TypeInvitation, TypeUser } from '../../../../Model/model';
import { useWorkspaceContext } from '../../../Workspace/WorkspaceContext';
import { useBoardContext } from '../../BoardContext';

type props = {
  userEmail: string,
  itemUid : string,
  itemRef : DocumentReference,
}

export const BoardMemberGetEmail : React.FC<props> = ({userEmail, itemUid, itemRef}) => {
  const {firestore} = useGlobalContext();
  const {board} = useBoardContext();
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

  const newUser = (resUsers as Array<TypeUser>)[0];
  const invited = board.boardMembers.includes(newUser.uid as string);

  if(!workspace.workspaceMembers.includes(newUser.userUid)){
    // not member of the workspace
    return <>invite user {newUser.userName} to workspace first to join the board</>;
  }

  const onInviteHandle = async () => {
    const batch = writeBatch(firestore);
    const refUser = doc(firestore, Tables.Users, newUser.uid as string);
    batch.update(refUser, {
      userInvitation: [
        ...newUser.userInvitation,
        {
          itemUid: itemUid,
          invitationType: EnumItemType.Board,
          itemRef: itemRef,
        } as TypeInvitation,
      ],
    } as TypeUser);
    await batch.commit();
    alert('invitation sent!');
  };

  return (
    <>
      {newUser.userName}
      {
        !invited ?
        <IonButton onClick={onInviteHandle}>invite</IonButton>:
        <IonButton disabled color='medium'>already joined</IonButton>

      }
    </>
  );
};

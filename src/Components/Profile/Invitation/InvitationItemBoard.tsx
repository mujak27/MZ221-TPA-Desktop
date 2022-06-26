/* eslint-disable no-unused-vars */
import { IonButton, IonItem } from '@ionic/react';
import { addDoc, collection, doc, writeBatch } from 'firebase/firestore';
import React from 'react';
import { useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../../../context/ContextProvider';
import { getPath } from '../../../Helper';
import { Tables, TypeBoard, TypeInvitation, TypeMember, TypeUser } from '../../../Model/model';

type props = {
  invitation : TypeInvitation
}

export const InvitationItemBoard : React.FC<props> = ({invitation}) => {
  const {user, firestore, setRefresh} = useGlobalContext();
  const refBoard = invitation.itemRef;

  const {status: statusBoard, data: resBoard} = useFirestoreDocData(refBoard, {
    idField: 'uid',
  });

  if (statusBoard === 'loading') {
    return <>loading...</>;
  }
  if (resBoard === undefined) return null;

  const board = resBoard as TypeBoard;

  if (board.boardMembers.includes(user.userUid)) {
    const f = ()=>{
      const refUser = doc(firestore, Tables.Users, user.userUid);
      const batch = writeBatch(firestore);
      batch.update(refUser, {
        userInvitation : [
          ...(user.userInvitation.filter((invitation)=>{
            if(invitation.itemUid == board.uid as string) return false
            return true;
          }))
        ]
      } as TypeUser);
      batch.commit();
      setRefresh(true);
      return null;
    }
    f();
  }

  const onClickHandle = async ()=>{
    try {
      const docRef = invitation.itemRef;
      const path = getPath(docRef);
      path.push(Tables.Members);
      // @ts-ignore
      const refMembers = collection(firestore, ...path);
      await addDoc(refMembers, {
        isAdmin: false,
        isOwner: false,
        userUid: user.userUid as string,
      } as TypeMember);
      const batch = writeBatch(firestore);
      batch.update(docRef, {
        boardMembers: [
          ...board.boardMembers,
          user.userUid,
        ],
        boardLogs : [
          ...board.boardLogs,
          `${user.userName} has joined this board!`
        ]
      } as TypeBoard);
      await batch.commit();
      alert('joined');
    } catch (e) {
      alert(e);
    }
  };

  return (
    <IonItem>
      invitation to join to board {board.boardName}
      <IonButton onClick={onClickHandle}>join</IonButton>
    </IonItem>
  );
};

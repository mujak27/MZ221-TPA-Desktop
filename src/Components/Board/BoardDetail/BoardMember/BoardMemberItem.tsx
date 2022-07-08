import { IonButton, IonItem } from '@ionic/react';
import { collection, doc, query, where, writeBatch } from 'firebase/firestore';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../../../context/ContextProvider';
import { KeyUser, Tables, TypeBoard, TypeUser } from '../../../../Model/model';
import { useBoardContext } from '../../BoardContext';

type props = {
  memberUid : string,
}

export const BoardMemberItem : React.FC<props> = ({memberUid})=>{
  const {firestore} = useGlobalContext();
  const {board} = useBoardContext();
  
  const refBoard = doc(firestore, Tables.Boards, board.uid as string);
  
  const refMember = collection(firestore, Tables.Users);
  const {status: statusMembers, data: resMembers} = useFirestoreCollectionData(query(
      refMember,
      where(KeyUser.userUid, '==', memberUid),
  ), {
    idField: 'uid',
  });

  if (statusMembers === 'loading') {
    return <IonItem>retrieving data...</IonItem>;
  }

  const member = (resMembers as Array<TypeUser>)[0];

  const onKickHandle = async ()=>{
    try {
      const batch = writeBatch(firestore);
      batch.update(refBoard, {
        boardMembers:
          board.boardMembers.filter((member)=>{
            if (member == memberUid as string) return false;
            return true;
          }),
      } as TypeBoard);
      await batch.commit();
      alert('removed');
    }catch(e){
      alert(e);
    }
  };


  const onSetAdminHandle = async ()=>{
    try {
      const newBoardAdmins = Array.from(board.boardAdmins);
      newBoardAdmins.push(memberUid);
      const batch = writeBatch(firestore);
      batch.update(refBoard,{
        boardAdmins: newBoardAdmins,
      } as TypeBoard)
      await batch.commit();
      alert('success');
    } catch (e) {
      alert(e);
    }
  };


  const onRevokeAdminHandle = async ()=>{
    try {
      const batch = writeBatch(firestore);
      const newBoardAdmins = Array .from(board.boardAdmins).filter((admin)=> {return admin!=memberUid});
      batch.update(refBoard, {
        boardAdmins : newBoardAdmins,
      } as TypeBoard);
      await batch.commit();
      alert('success');
    } catch (e) {
      alert(e);
    }
  }


  return (
    <IonItem>
      {member.userName}
      {!board.boardAdmins.includes(memberUid) ?
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

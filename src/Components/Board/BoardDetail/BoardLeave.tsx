import { IonButton, IonIcon, IonItem, IonModal, IonTitle } from '@ionic/react';
import { deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { checkmarkCircle, closeCircle, exit } from 'ionicons/icons';
import React from 'react';
import { useGlobalContext } from '../../../context/ContextProvider';
import { Tables, TypeBoard } from '../../../Model/model';
import { useWorkspaceContext } from '../../Workspace/WorkspaceContext';
import { useBoardContext } from '../BoardContext';

type props = {
  showModal : boolean,
  setShowModal : React.Dispatch<React.SetStateAction<boolean>>,
}

export const BoardLeave : React.FC<props> = ({showModal, setShowModal}) => {
  const {firestore, setRefresh, user, history} = useGlobalContext();
  const {workspace, workspaceMembers: members} = useWorkspaceContext();
  const {board, userBoard} = useBoardContext();
  
  const onLeave = async ()=>{
    let newMemberUids = Array.from(board.boardMembers).filter((memberUid)=>{
      if(memberUid == user.userUid) return false;
      return true;
    });
    console.info(board.boardMembers);
    console.info(newMemberUids);
    if(newMemberUids.length == 0){
      deleteDoc(doc(firestore, Tables.Boards, board.uid as string));
      alert('leave and deleted');
      return;
    }

    let memberNotAdmin = Array.from(members);
    memberNotAdmin = memberNotAdmin.filter((member)=>{
      return !((member.userUid == user.userUid) || member.isAdmin)
    })
    if(memberNotAdmin.length > 0){
      alert('you are the last admin!, set anyone as admin or just delete the board');
      return;
    }


    const refMember = doc(firestore, Tables.Boards, board.uid as string,  Tables.Members, userBoard.uid as string);
    deleteDoc(refMember);
    const batch = writeBatch(firestore);
    const cardRef = doc(firestore, Tables.Boards, board.uid as string);
    batch.update(cardRef, {
      boardMembers: [
        ...(board.boardMembers.filter((userUid)=>{
          if(userUid == user.userUid) return false;
          return true;
        })),
      ]
    } as TypeBoard);
    await batch.commit();
    alert('success left')
    history.push(`/workspace/${workspace.uid as string}`);
    setRefresh(true);
  }

  return (
    <>
      <IonButton color="primary" onClick={()=>setShowModal(true)}>
        <IonIcon slot="icon-only" icon={exit} />
      </IonButton>
      <IonModal isOpen={showModal} onDidDismiss={()=>setShowModal(false)}>
        <IonItem>
          <IonTitle>
            Leave board {board.boardName} ?
          </IonTitle>
        <IonItem>
        </IonItem>
          <IonItem style={{width: '100%'}}>
            <IonButton color='primary' onClick={()=>setShowModal(false)}>
              <IonIcon icon={closeCircle} />
            </IonButton>
            <IonButton color='danger' onClick={onLeave}>
              <IonIcon icon={checkmarkCircle} />
            </IonButton>
          </IonItem>
        </IonItem>
      </IonModal>
    </>
  );
};

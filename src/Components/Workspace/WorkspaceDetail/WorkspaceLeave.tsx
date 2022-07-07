import { IonButton, IonIcon, IonItem, IonModal, IonTitle } from '@ionic/react';
import { collection, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore';
import { checkmarkCircle, closeCircle, exit } from 'ionicons/icons';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../../context/ContextProvider';
import { BoardStatus, KeyBoard, Tables, TypeBoard, TypeWorkspace } from '../../../Model/model';
import { useWorkspaceContext } from '../WorkspaceContext';

type props = {
  showModal : boolean,
  setShowModal : React.Dispatch<React.SetStateAction<boolean>>,
}

export const WorkspaceLeave : React.FC<props> = ({showModal, setShowModal}) => {
  const {firestore, setRefresh, user, history} = useGlobalContext();
  const {workspace} = useWorkspaceContext();
  

  const refBoards = collection(firestore, Tables.Boards);
  const {status : statusBoards, data : resBoards} = useFirestoreCollectionData(query(
      refBoards, 
      where(KeyBoard.boardWorkspaceUid, '==', workspace.uid as string)
      ), {
    idField: 'uid'
  })

  if(statusBoards === 'loading') return <>fetching data...</>

  const boards = resBoards as Array<TypeBoard>

  const onLeave = async ()=>{
    console.info('my uid');
    console.info(user.userUid);
    let newMemberUids = Array.from(workspace.workspaceMembers);
    newMemberUids = newMemberUids.filter((memberUid)=>{
      console.info('compare')
      console.info('compare' + memberUid + ' - ', user.userUid);
      console.info(memberUid == user.userUid);
      if(memberUid == user.userUid) return false;
      return true;
    });
    if(newMemberUids.length == 0){
      deleteDoc(doc(firestore, Tables.Workspaces, workspace.uid as string));

      const batch = writeBatch(firestore);
      boards.forEach((board)=>{
        const refBoard = doc(firestore, Tables.Boards, board.uid as string);
        batch.update(refBoard, {
          boardStatus: BoardStatus.Close,
          boardWorkspaceUid: '',
        } as TypeBoard)
        console.info(board.boardName + ' closed');
      })
      batch.commit();
      alert('leave and deleted');
      return;
    }
    console.info('member besides curr')
    console.info(newMemberUids);

    let memberNotAdmin = Array.from(workspace.workspaceMembers).filter((member)=>{
      return (member != user.userUid && !workspace.workspaceAdmins.includes(member))
    })
    console.info('member besides me not admin');
    console.info(memberNotAdmin);
    if(memberNotAdmin.length > 0){
      alert('you are the last admin!, set anyone as admin or just delete the workspace');
      return;
    }

    const batch = writeBatch(firestore);
    const cardRef = doc(firestore, Tables.Workspaces, workspace.uid as string);
    batch.update(cardRef, {
      workspaceMembers: [
        ...(workspace.workspaceMembers.filter((userUid)=>{
          if(userUid == user.userUid) return false;
          return true;
        })),
      ]
    } as TypeWorkspace);
    await batch.commit();

    alert('success left')
    setRefresh(true);
    history.push('/workspace');
  }

  return (
    <>
      <IonButton color="primary" onClick={()=>setShowModal(true)}>
        <IonIcon slot="icon-only" icon={exit} />
      </IonButton>
      <IonModal isOpen={showModal} onDidDismiss={()=>setShowModal(false)}>
        <IonItem>
          <IonTitle>
            Leave workspace {workspace.workspaceName} ?
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

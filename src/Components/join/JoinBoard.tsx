/* eslint-disable no-unused-vars */
import { IonButton, IonCard, IonCardContent, IonCardTitle } from '@ionic/react';
import { doc, writeBatch } from 'firebase/firestore';
import React from 'react';
import { useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeBoard, TypeInvitationLink, TypeWorkspace } from '../../Model/model';

type props = {
  invitationLink : TypeInvitationLink,
}

export const JoinBoard : React.FC<props> = ({invitationLink}) => {
  const {user, firestore, history, setRefresh} = useGlobalContext();
  const {status: statusBoard, data: resBoard} = useFirestoreDocData(invitationLink.refItem, {
    idField: 'uid',
  });

  const refWorkspace = doc(firestore, Tables.Workspaces, invitationLink.WorkspaceUid);
  const {status: statusWorkspace, data: resWorkspace} = useFirestoreDocData(refWorkspace, {
    idField: 'uid',
  });

  if (statusBoard === 'loading' || statusWorkspace === 'loading') {
    return <>loading board data...</>;
  }

  const board = resBoard as TypeBoard;
  const workspace = resWorkspace as TypeWorkspace;

  const onJoinHandle = async ()=>{
    try {
      console.info('join board');
      console.info(user);
      console.info(user.userUid);
      const docRef = invitationLink.refItem;
      const batch = writeBatch(firestore);
      batch.update(docRef, {
        boardMembers: [
          ...board.boardMembers,
          user.userUid,
        ],
        boardLogs : [
          ...board.boardLogs,
          `${user.userName} has joined this workspace!`
        ]
      } as TypeBoard);
      await batch.commit();
      alert('joined');
      history.push('/workspace/' + board.uid as string);
      setRefresh(true);
    } catch (e) {
      alert(e);
    }
  };

  const redirectToWorkspace = ()=>{
    history.push('/workspace/' + workspace.uid as string + '/board' + board.uid as string);
    setRefresh(true);
  }

  console.info(workspace);

  if(!(workspace.workspaceMembers.includes(user.userUid))) 
  return <> join the workspace first ! </>

  if(board.boardMembers && board.boardMembers.includes(user.userUid)){
    return (
      <IonCard className='ion-padding'>
        <IonCardTitle>
          you are already a member of board {board.boardName}
        </IonCardTitle>
        <IonCardContent>
          <IonButton onClick={redirectToWorkspace}>redirect to board {board.boardName}</IonButton>
        </IonCardContent>
      </IonCard>
    )
  }

  return (
    <IonCard className='ion-padding'>
      <IonCardTitle>
        you have been invited to join and collaborate to board {board.boardName}
      </IonCardTitle>
      <IonCardContent>
        <IonButton onClick={onJoinHandle}>
          join
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

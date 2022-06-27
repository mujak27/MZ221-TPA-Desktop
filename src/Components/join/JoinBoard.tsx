/* eslint-disable no-unused-vars */
import { IonButton, IonCard, IonCardContent, IonCardTitle } from '@ionic/react';
import { addDoc, collection, doc, DocumentReference, writeBatch } from 'firebase/firestore';
import React from 'react';
import { useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { getPath } from '../../Helper';
import { Tables, TypeBoard, TypeMember, TypeWorkspace } from '../../Model/model';

type props = {
  refBoard : DocumentReference,
}

export const JoinBoard : React.FC<props> = ({refBoard}) => {
  const {user, firestore, history, setRefresh} = useGlobalContext();
  const {status: statusBoard, data: resBoard} = useFirestoreDocData(refBoard, {
    idField: 'uid',
  });

  const pathWorkspace = Array.from(getPath(refBoard)).slice(0,2);
  console.info(pathWorkspace);
  // @ts-ignore
  const refWorkspace = doc(firestore, ...pathWorkspace)
  console.info(refWorkspace);
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
      const docRef = refBoard;
      const path = getPath(docRef);
      path.push(Tables.Members);
      // @ts-ignore
      const refMembers = collection(firestore, ...(path));
      await addDoc(refMembers, {
        isAdmin: false,
        isOwner: false,
        userUid: user.userUid,
      } as TypeMember);
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
    history.push('/workspace/' + board.uid as string);
    setRefresh(true);
  }

  if(!workspace.workspaceMembers.includes(user.userUid)) 
  return <> join the workspace first ! </>

  if(board.boardMembers && board.boardMembers.includes(user.userUid)){
    return (
      <IonCard className='ion-padding'>
        <IonCardTitle>
          you are already a member of workspace {board.boardName}
        </IonCardTitle>
        <IonCardContent>
          <IonButton onClick={redirectToWorkspace}>redirect to workspace {board.boardName}</IonButton>
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

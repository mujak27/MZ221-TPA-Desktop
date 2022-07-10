import { IonButton, IonContent, IonHeader, IonItem, IonTitle } from '@ionic/react';
import { collection, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore';
import React from 'react';
import { Redirect, useParams } from 'react-router';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../../../context/ContextProvider';
import { BoardStatus, KeyWorkspace, Tables, TypeBoard, TypeWorkspace } from '../../../Model/model';
import '../../style.css';

type props = {
}

export const BoardClosedDetail : React.FC<props> = ({}) => {
  const {firestore, history, setRefresh, user} = useGlobalContext();
  const {boardUid} = useParams() as {boardUid : string};

  const refWorkspace = collection(firestore, Tables.Workspaces);
  const {status : statusWorkspaces, data:resWorkspaces} = useFirestoreCollectionData(query(
    refWorkspace,
    where(KeyWorkspace.workspaceMembers, 'array-contains', user.userUid)
  ), {
    idField: 'uid'
  })

  const refBoard = doc(firestore, Tables.Boards, boardUid);
  const {status : statusBoard, data: resBoard} = useFirestoreDocData(refBoard, {
    idField: 'uid'
  });

  if(statusBoard === 'loading' || statusWorkspaces === 'loading') {
    return <>fetching board data...</>
  }

  const board = resBoard as TypeBoard;
  const workspaces = resWorkspaces as Array<TypeWorkspace>;
  
  if(board == undefined){
    history.push('/board');
    setRefresh(true);
    return <Redirect to={'/board'} />
  }

  const onAdopt = (workspaceUid : string) => {
    const batch = writeBatch(firestore);
    batch.update(refBoard, {
      boardAdmins: [user.userUid],
      boardMembers: [user.userUid],
      boardStatus: BoardStatus.Open,
      boardWorkspaceUid: workspaceUid,
    } as TypeBoard)
    const refWorkspace = doc(firestore, Tables.Workspaces, workspaceUid);
    const newWorkspaceBoardUids = (()=>{
      const workspace = workspaces.filter((workspace)=>{return workspace.uid as string == workspaceUid})[0];
      const newWorkspaceBoardUids = Array.from(workspace.workspaceBoardUids); 
      newWorkspaceBoardUids.push(boardUid);
      return newWorkspaceBoardUids;
    })();
    batch.update(refWorkspace, {
      workspaceBoardUids: newWorkspaceBoardUids, 
    } as TypeWorkspace)
    batch.commit();
    history.push(`/workspace/${workspaceUid}/board/${boardUid}`);
    setRefresh(true);
  }

  const onPermanentClose = ()=>{
    deleteDoc(refBoard);
    history.push('/board');
    setRefresh(true);
  }

  return (
    <>
      <IonHeader>
        <IonItem>
          <IonTitle size='large'>
          <h1>{board.boardName}</h1>
          </IonTitle>
        </IonItem>
      </IonHeader>
      <IonContent>
        this board is closed, choose workspace to adopt this board
        {
          workspaces.map((workspace)=>{
            return (
              <IonItem>
                <IonButton onClick={()=>onAdopt(workspace.uid as string)} >{workspace.workspaceName}</IonButton>
              </IonItem>
            )
          })
        }
        or permanently closed this board
        <IonButton onClick={onPermanentClose}>Permanent Close</IonButton>
      </IonContent>
    </>
  );
};

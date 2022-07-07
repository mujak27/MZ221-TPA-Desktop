import { IonCol, IonGrid, IonItem, IonRow, IonTitle } from '@ionic/react';
import { collection, query, where } from 'firebase/firestore';
import { union, uniqBy } from 'lodash';
import { nanoid } from 'nanoid';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { BoardVisibility, KeyBoard, Tables, TypeBoard, WorkspaceVisibility } from '../../Model/model';
import { BoardItem } from '../Board/BoardItem';
import '../style.css';
import { useWorkspaceContext } from './WorkspaceContext';
import WorkspaceCreateBoard from './WorkspaceCreateBoard';


type props = {
}

export const WorkspaceBoards : React.FC<props> = ({}) => {
  const {firestore, user} = useGlobalContext();
  const {workspace} = useWorkspaceContext();

  const refBoard = collection(firestore, Tables.Boards);
  const {status: statusPrivBoard, data: resPrivBoards} = useFirestoreCollectionData(query(refBoard,
    where(KeyBoard.boardWorkspaceUid, '==', workspace.uid as string),
      where(KeyBoard.boardMembers, 'array-contains', user.userUid),
  ), {
    idField: 'uid',
  });
  const {status: statusPublicBoard, data: resPublicBoards} = useFirestoreCollectionData(query(refBoard,
    where(KeyBoard.boardWorkspaceUid, '==', workspace.uid as string),
    where(KeyBoard.boardVisibility, '==', BoardVisibility.Public),
  ), {
    idField: 'uid',
  });

  const {status: statusWorkspaceBoard, data: resWorkspaceBoards} = useFirestoreCollectionData(query(refBoard,
    where(KeyBoard.boardWorkspaceUid, '==', workspace.uid as string),
      where(KeyBoard.boardVisibility, '==', BoardVisibility.Workspace),
  ), {
    idField: 'uid',
  });
  
  
  if (statusPrivBoard === 'loading' || statusWorkspaceBoard === 'loading' || statusPublicBoard === 'loading') {
    return (
      <div>
        loading board data
      </div>
    );
  }
  
  const privBoards = resPrivBoards as Array<TypeBoard>
  const workspaceBoards = resWorkspaceBoards as Array<TypeBoard>
  const publicBoards = resPublicBoards as Array<TypeBoard>

  let boards = union(privBoards, publicBoards);
  if(workspace.workspaceMembers.includes(user.userUid)){
    boards = union(boards, workspaceBoards);
  }else{
    console.info('not member board');
  }
  boards = uniqBy(boards, 'uid');



  const ItemInRow = 6;
  const boardJsx = boards.map((board)=>{
    return (
      <IonCol size={`${12/ItemInRow}`} key={nanoid()}>
        <BoardItem board={board} />
      </IonCol>
    );
  });

  const boardJsxChunkGenerator = ()=>{
    const source = boardJsx;
    const res : Array<JSX.Element> = [];
    for(let i=0; i < source.length; i+=ItemInRow){
      const chunk = source.slice(i, i+ItemInRow);
      res.push((
        <IonRow key={nanoid()}>
          {(chunk)}
        </IonRow>
      ))
    }
    return res;
  }
  const boardJsxChunk = boardJsxChunkGenerator();


  return (
    <div>
      <IonItem>
        <IonTitle >
          <h3 style={{width: '100%', display: 'block'}}>
          Boards
          </h3>
        </IonTitle>
      </IonItem>
      {
        workspace.workspaceVisibility == WorkspaceVisibility.Public && !workspace.workspaceMembers.includes(user.userUid) ?
        null :
        <WorkspaceCreateBoard/>
      }
      <IonGrid>
        {
          boardJsxChunk
        }
      </IonGrid>
    </div>
  );
};
